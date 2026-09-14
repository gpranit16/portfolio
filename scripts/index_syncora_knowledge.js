import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  'C:\\Users\\gupta\\Downloads\\syncora-main\\syncora-main',
  'C:\\Users\\gupta\\Downloads\\syncora-main',
  path.resolve(__dirname, '../../../syncora-main'),
  path.resolve(__dirname, '../../syncora-main'),
];

const SYNCORA_ROOT = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
const OUTPUT_FILE = path.resolve(__dirname, '../data/syncora_knowledge_index.json');

console.log(`[Syncora Indexer] Ingesting from: ${SYNCORA_ROOT}`);

if (!fs.existsSync(SYNCORA_ROOT)) {
  console.error(`[Syncora Indexer] Root not found at ${SYNCORA_ROOT}`);
  process.exit(1);
}

const IGNORED_DIRS = new Set([
  '.git', 'node_modules', '.venv', 'dist', 'build', '.vscode', '.idea', 'coverage'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.md', '.js', '.jsx', '.ts', '.tsx', '.sql', '.json', '.html'
]);

function isSecret(content) {
  const patterns = [
    /gsk_[a-zA-Z0-9]{20,}/i,
    /sk-[a-zA-Z0-9]{20,}/i,
    /BEGIN (RSA|OPENSSH|PRIVATE) KEY/i,
    /jwt_secret\s*=\s*['"][^'"]+['"]/i,
  ];
  return patterns.some(p => p.test(content));
}

function chunkMarkdown(filePath, relativePath, content) {
  const lines = content.split('\n');
  const chunks = [];
  let currentHeader = path.basename(filePath);
  let currentLines = [];
  let startLine = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,3}\s+/.test(line)) {
      if (currentLines.length > 0) {
        const text = currentLines.join('\n').trim();
        if (text.length > 40) {
          chunks.push({
            id: `${relativePath}#${startLine}-${i}`,
            source: path.basename(filePath),
            file_path: relativePath,
            section: currentHeader,
            title: `${path.basename(filePath)} · ${currentHeader}`,
            lines: [startLine, i],
            content: text,
          });
        }
      }
      currentHeader = line.replace(/^#{1,3}\s+/, '').trim();
      currentLines = [line];
      startLine = i + 1;
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    const text = currentLines.join('\n').trim();
    if (text.length > 40) {
      chunks.push({
        id: `${relativePath}#${startLine}-${lines.length}`,
        source: path.basename(filePath),
        file_path: relativePath,
        section: currentHeader,
        title: `${path.basename(filePath)} · ${currentHeader}`,
        lines: [startLine, lines.length],
        content: text,
      });
    }
  }

  return chunks;
}

function chunkCode(filePath, relativePath, content) {
  const lines = content.split('\n');
  const chunks = [];
  const chunkSize = 60;
  const overlap = 15;

  for (let i = 0; i < lines.length; i += (chunkSize - overlap)) {
    const slice = lines.slice(i, i + chunkSize);
    const text = slice.join('\n').trim();
    if (text.length > 60) {
      chunks.push({
        id: `${relativePath}#${i + 1}-${Math.min(i + chunkSize, lines.length)}`,
        source: path.basename(filePath),
        file_path: relativePath,
        section: `Lines ${i + 1}-${Math.min(i + chunkSize, lines.length)}`,
        title: `${path.basename(filePath)}`,
        lines: [i + 1, Math.min(i + chunkSize, lines.length)],
        content: text,
      });
    }
  }
  return chunks;
}

const allChunks = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(SYNCORA_ROOT, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walk(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext) && !entry.name.endsWith('.min.js')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.length > 20 && content.length < 500000 && !isSecret(content)) {
            if (ext === '.md') {
              allChunks.push(...chunkMarkdown(fullPath, relPath, content));
            } else {
              allChunks.push(...chunkCode(fullPath, relPath, content));
            }
          }
        } catch (e) {
          // ignore unreadable
        }
      }
    }
  }
}

walk(SYNCORA_ROOT);

// Also index curated Master Knowledge Base topics from data/syncora_topics
const TOPICS_DIR = path.resolve(__dirname, '../data/syncora_topics');
if (fs.existsSync(TOPICS_DIR)) {
  const topicFiles = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.md'));
  for (const f of topicFiles) {
    const fullPath = path.join(TOPICS_DIR, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    const chunks = chunkMarkdown(fullPath, `master_kb/${f}`, content);
    chunks.forEach(c => {
      c.isMasterKB = true;
    });
    allChunks.push(...chunks);
  }
}

// Calculate BM25 doc frequencies & token lengths
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'in',
  'is', 'it', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will', 'with', 'this'
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

const docFreq = {};
let totalTokens = 0;

allChunks.forEach(chunk => {
  const tokens = tokenize(chunk.content + ' ' + (chunk.title || ''));
  chunk.tokens = tokens;
  chunk.docLength = tokens.length;
  totalTokens += tokens.length;

  const tf = {};
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  chunk.tf = tf;

  const seen = new Set(tokens);
  seen.forEach(t => {
    docFreq[t] = (docFreq[t] || 0) + 1;
  });
});

const indexData = {
  project: 'syncora',
  total_chunks: allChunks.length,
  avg_doc_length: allChunks.length > 0 ? totalTokens / allChunks.length : 100,
  doc_freq: docFreq,
  chunks: allChunks,
};

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), 'utf8');
console.log(`[Syncora Indexer] Indexed ${allChunks.length} chunks to ${OUTPUT_FILE}`);
