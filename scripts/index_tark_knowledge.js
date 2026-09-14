import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possiblePaths = [
  'C:\\Users\\gupta\\Downloads\\TarkAI',
  path.resolve(__dirname, '../../../TarkAI'),
  path.resolve(__dirname, '../../TarkAI'),
  path.resolve(__dirname, '../TarkAI'),
];

const TARK_ROOT = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
const OUTPUT_FILE = path.resolve(__dirname, '../data/tark_knowledge_index.json');

console.log(`[TARK AI Indexer] Starting knowledge ingestion from: ${TARK_ROOT}`);

if (!fs.existsSync(TARK_ROOT)) {
  console.error(`[TARK AI Indexer] ERROR: TarkAI repository root not found at ${TARK_ROOT}`);
  process.exit(1);
}

const IGNORED_DIRS = new Set([
  '.git', 'node_modules', '.venv', '__pycache__', 'dist', 'build', '.pytest_cache',
  'assets', 'uploads', 'scratch', '.husky', '.idea', '.vscode'
]);

const IGNORED_FILES = new Set([
  '.env', '.env.local', '.env.production', '.env.development', '.DS_Store',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
]);

const ALLOWED_EXTENSIONS = new Set([
  '.md', '.py', '.js', '.jsx', '.ts', '.tsx', '.json', '.yml', '.yaml'
]);

function isSecretOrSensitive(content) {
  const patterns = [
    /gsk_[a-zA-Z0-9]{20,}/i,
    /sk-[a-zA-Z0-9]{20,}/i,
    /BEGIN (RSA|OPENSSH|PRIVATE) KEY/i,
    /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/,
    /client_secret\s*=\s*['"][^'"]+['"]/i,
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
    // Split on h1 and h2, but keep h3 within the section for full context
    if (/^#{1,2}\s+/.test(line)) {
      if (currentLines.length > 0) {
        const text = currentLines.join('\n').trim();
        if (text.length > 50) {
          chunks.push({
            id: `${relativePath}#${startLine}-${i}`,
            source: path.basename(filePath),
            file_path: relativePath,
            section: currentHeader,
            title: `${path.basename(filePath)} · ${currentHeader}`,
            document_type: 'markdown_doc',
            lines: [startLine, i],
            content: text,
            language: 'markdown'
          });
        }
      }
      currentHeader = line.replace(/^#{1,2}\s+/, '').trim();
      currentLines = [line];
      startLine = i + 1;
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    const text = currentLines.join('\n').trim();
    if (text.length > 50) {
      chunks.push({
        id: `${relativePath}#${startLine}-${lines.length}`,
        source: path.basename(filePath),
        file_path: relativePath,
        section: currentHeader,
        title: `${path.basename(filePath)} · ${currentHeader}`,
        document_type: 'markdown_doc',
        lines: [startLine, lines.length],
        content: text,
        language: 'markdown'
      });
    }
  }

  return chunks;
}

function chunkCode(filePath, relativePath, content, language) {
  const lines = content.split('\n');
  const chunks = [];
  const chunkSize = 45;
  const overlap = 8;

  for (let i = 0; i < lines.length; i += (chunkSize - overlap)) {
    const slice = lines.slice(i, i + chunkSize);
    const text = slice.join('\n').trim();
    if (text.length > 40) {
      const firstLine = slice.find(l => l.trim().length > 0) || '';
      let section = 'Module Implementation';
      const defMatch = firstLine.match(/(class\s+\w+|def\s+\w+|function\s+\w+|export\s+const\s+\w+|export\s+default\s+function\s+\w+)/);
      if (defMatch) section = defMatch[0];

      chunks.push({
        id: `${relativePath}#${i + 1}-${Math.min(i + chunkSize, lines.length)}`,
        source: path.basename(filePath),
        file_path: relativePath,
        section,
        title: `${path.basename(filePath)} (${section})`,
        document_type: 'code_source',
        lines: [i + 1, Math.min(i + chunkSize, lines.length)],
        content: text,
        language
      });
    }
  }

  return chunks;
}

function scanDirectory(dir, relativeDir = '') {
  let chunks = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const name = entry.name;
    const fullPath = path.join(dir, name);
    const relPath = relativeDir ? path.join(relativeDir, name).replace(/\\/g, '/') : name;

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(name)) continue;
      chunks = chunks.concat(scanDirectory(fullPath, relPath));
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(name) || name.startsWith('.env')) continue;
      const ext = path.extname(name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) continue;

      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (isSecretOrSensitive(content)) {
          console.warn(`[TARK AI Indexer] Skipped potential secret file: ${relPath}`);
          continue;
        }

        if (ext === '.md') {
          chunks = chunks.concat(chunkMarkdown(fullPath, relPath, content));
        } else if (['.py', '.ts', '.tsx', '.js', '.jsx', '.json', '.yml', '.yaml'].includes(ext)) {
          const lang = ext === '.py' ? 'python' : ext.startsWith('.ts') ? 'typescript' : ext.startsWith('.js') ? 'javascript' : 'config';
          chunks = chunks.concat(chunkCode(fullPath, relPath, content, lang));
        }
      } catch (err) {
        console.warn(`[TARK AI Indexer] Failed reading file ${relPath}:`, err.message);
      }
    }
  }

  return chunks;
}

// Tokenizer & Stopwords for BM25/Lexical Search
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
  'will', 'with', 'the', 'this', 'but', 'they', 'have', 'had', 'what', 'when',
  'where', 'who', 'which', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don',
  'should', 'now'
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

console.log('[TARK AI Indexer] Ingesting files...');
const allChunks = scanDirectory(TARK_ROOT);

console.log(`[TARK AI Indexer] Ingested ${allChunks.length} semantic chunks. Building lexical index...`);

// Build term frequency and document frequency index
const docFreq = {};
const chunkDocs = allChunks.map((chunk) => {
  const tokens = tokenize(`${chunk.title} ${chunk.section} ${chunk.content} ${chunk.file_path}`);
  const tf = {};
  const seen = new Set();
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
    if (!seen.has(t)) {
      seen.add(t);
      docFreq[t] = (docFreq[t] || 0) + 1;
    }
  });
  return {
    ...chunk,
    tokens,
    tf,
    docLength: tokens.length
  };
});

const totalDocs = chunkDocs.length;
const avgDocLength = chunkDocs.reduce((sum, d) => sum + d.docLength, 0) / (totalDocs || 1);

const knowledgeBase = {
  project: 'TARK AI',
  source_repo: 'https://github.com/gpranit16/tark-ai',
  generated_at: new Date().toISOString(),
  total_chunks: totalDocs,
  avg_doc_length: avgDocLength,
  doc_freq: docFreq,
  chunks: chunkDocs
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(knowledgeBase, null, 2), 'utf8');
console.log(`[TARK AI Indexer] Knowledge base successfully saved to ${OUTPUT_FILE} (${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB)`);
