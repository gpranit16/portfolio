import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOPICS_DIR = path.resolve(__dirname, '../data/churn_topics');
const OUTPUT_FILE = path.resolve(__dirname, '../data/churn_knowledge_index.json');

console.log(`[Churn Indexer] Ingesting knowledge from: ${TOPICS_DIR}`);

if (!fs.existsSync(TOPICS_DIR)) {
  console.error(`[Churn Indexer] Topics directory not found at ${TOPICS_DIR}`);
  process.exit(1);
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
        if (text.length > 30) {
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
    if (text.length > 30) {
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

const allChunks = [];
const topicFiles = fs.readdirSync(TOPICS_DIR).filter(f => f.endsWith('.md'));

for (const f of topicFiles) {
  const fullPath = path.join(TOPICS_DIR, f);
  const content = fs.readFileSync(fullPath, 'utf8');
  allChunks.push(...chunkMarkdown(fullPath, `master_kb/${f}`, content));
}

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
  project: 'churn-reaper',
  total_chunks: allChunks.length,
  avg_doc_length: allChunks.length > 0 ? totalTokens / allChunks.length : 100,
  doc_freq: docFreq,
  chunks: allChunks,
};

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), 'utf8');
console.log(`[Churn Indexer] Indexed ${allChunks.length} chunks to ${OUTPUT_FILE}`);
