// test/scratch-tokenizer-test.js
// Test syntax highlighting tokenizer for CodeBlock component

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function highlightSyntax(code, lang) {
  if (!code) return '';
  const safeLang = (lang || '').toLowerCase().trim();
  
  // Clean raw code
  let escaped = escapeHtml(code);

  // If plaintext, return escaped
  if (['text', 'plaintext', 'txt', 'none', ''].includes(safeLang)) {
    return escaped;
  }

  // Token regexes for code highlighting
  // 1. Strings (single, double, template quotes)
  const stringRegex = /(&quot;[\s\S]*?&quot;|&#039;[\s\S]*?&#039;|`[\s\S]*?`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
  
  // 2. Comments (// line, /* block */, # python/shell line)
  const commentRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g;

  // 3. Keywords
  const jsKeywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|import|export|from|as|default|class|extends|new|this|super|async|await|try|catch|finally|throw|typeof|instanceof|void|delete|in|of|yield|interface|type|enum|implements|public|private|protected|readonly)\b/g;
  const pyKeywords = /\b(def|class|return|if|elif|else|for|while|break|continue|import|from|as|try|except|finally|raise|with|yield|lambda|pass|global|nonlocal|async|await|assert|del|in|is|not|and|or)\b/g;
  const sqlKeywords = /\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|JOIN|INNER|LEFT|RIGHT|OUTER|FULL|CROSS|ON|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|CREATE|TABLE|ALTER|DROP|INDEX|VIEW|UNION|ALL|DISTINCT|AS|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|CASE|WHEN|THEN|ELSE|END|EXISTS|COUNT|SUM|AVG|MIN|MAX)\b/gi;
  
  // Select keyword regex
  let keywordRegex = jsKeywords;
  if (['python', 'py'].includes(safeLang)) keywordRegex = pyKeywords;
  else if (['sql'].includes(safeLang)) keywordRegex = sqlKeywords;
  else if (['html', 'xml'].includes(safeLang)) {
    // HTML tags
    return escaped.replace(/(&lt;\/?)([a-zA-Z0-9_\-]+)([\s\S]*?)(&gt;)/g, (m, open, tag, attrs, close) => {
      const highlightedAttrs = attrs.replace(/([a-zA-Z0-9_\-]+)=(&quot;[^&]*&quot;|&#039;[^&]*&#039;|"[^"]*")/g, '<span class="code-token-attr">$1</span>=<span class="code-token-string">$2</span>');
      return `${open}<span class="code-token-keyword">${tag}</span>${highlightedAttrs}${close}`;
    });
  }

  // Numbers
  const numberRegex = /\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g;

  // Booleans / Constants
  const boolRegex = /\b(true|false|null|undefined|None|True|False|NaN|Infinity)\b/g;

  // Common Built-in Types & Classes
  const typeRegex = /\b([A-Z][a-zA-Z0-9_$]+)\b/g;

  // Decorators / Annotations (e.g., @app.get, @override)
  const decoratorRegex = /(@[a-zA-Z0-9_$.]+)/g;

  // Placeholders mapping to prevent regex collisions
  const tokens = [];
  const mask = (content, className) => {
    const id = `__CODE_TOK_${tokens.length}__`;
    tokens.push(`<span class="${className}">${content}</span>`);
    return id;
  };

  // Step A: Mask Comments
  escaped = escaped.replace(commentRegex, (m) => mask(m, 'code-token-comment'));

  // Step B: Mask Strings
  escaped = escaped.replace(stringRegex, (m) => mask(m, 'code-token-string'));

  // Step C: Highlight Decorators
  escaped = escaped.replace(decoratorRegex, (m) => mask(m, 'code-token-decorator'));

  // Step D: Highlight Keywords
  escaped = escaped.replace(keywordRegex, (m) => `<span class="code-token-keyword">${m}</span>`);

  // Step E: Highlight Booleans / Null
  escaped = escaped.replace(boolRegex, (m) => `<span class="code-token-boolean">${m}</span>`);

  // Step F: Highlight Numbers
  escaped = escaped.replace(numberRegex, (m) => `<span class="code-token-number">${m}</span>`);

  // Step G: Highlight Types/Classes
  escaped = escaped.replace(typeRegex, (m) => `<span class="code-token-type">${m}</span>`);

  // Step H: Restore Tokens (strings and comments)
  for (let i = tokens.length - 1; i >= 0; i--) {
    escaped = escaped.replace(`__CODE_TOK_${i}__`, tokens[i]);
  }

  return escaped;
}

// Test with Python code
const pySample = `
# FastAPI Example
from fastapi import FastAPI, HTTPException
import time

app = FastAPI(title="Epic Think AI")

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id < 0:
        raise HTTPException(status_code=400, detail="Invalid ID")
    return {"id": item_id, "active": True, "count": 42}
`;

console.log("--- Highlighted Python ---");
const pyResult = highlightSyntax(pySample, 'python');
console.log(pyResult.slice(0, 400));

// Test with JavaScript code
const jsSample = `
// High performance async stream
export async function fetchStream(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP error " + res.status);
  return await res.json();
}
`;

console.log("\n--- Highlighted JS ---");
const jsResult = highlightSyntax(jsSample, 'javascript');
console.log(jsResult.slice(0, 400));
