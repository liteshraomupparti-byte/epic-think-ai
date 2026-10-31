// test/scratch-nested-list-test.js

function formatInline(s) { return s; }

function parseListLines(lines) {
  const result = [];
  // Stack of active lists: { type: 'ul'|'ol', indent: number }
  const listStack = [];

  function closeListsUntil(targetIndent) {
    while (listStack.length > 0 && listStack[listStack.length - 1].indent > targetIndent) {
      const top = listStack.pop();
      result.push(top.type === 'ul' ? '</ul>' : '</ol>');
    }
  }

  function closeAllLists() {
    while (listStack.length > 0) {
      const top = listStack.pop();
      result.push(top.type === 'ul' ? '</ul>' : '</ol>');
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed) {
      closeAllLists();
      continue;
    }

    // Measure leading spaces for indentation level
    const leadingSpaces = raw.match(/^\s*/)[0].length;

    // Check for unordered list item
    const ulMatch = trimmed.match(/^[-*+•]\s+(.*)$/);
    // Check for ordered list item
    const olMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);

    if (ulMatch || olMatch) {
      const itemType = ulMatch ? 'ul' : 'ol';
      const itemContent = ulMatch ? ulMatch[1] : olMatch[2];

      if (listStack.length === 0) {
        // Start first list
        listStack.push({ type: itemType, indent: leadingSpaces });
        result.push(itemType === 'ul' ? '<ul>' : '<ol>');
      } else {
        const currentTop = listStack[listStack.length - 1];
        if (leadingSpaces > currentTop.indent) {
          // Deeper nesting
          listStack.push({ type: itemType, indent: leadingSpaces });
          result.push(itemType === 'ul' ? '<ul>' : '<ol>');
        } else if (leadingSpaces < currentTop.indent) {
          // Unwind to matching or lower indent
          closeListsUntil(leadingSpaces);
          if (listStack.length === 0 || listStack[listStack.length - 1].indent < leadingSpaces) {
            listStack.push({ type: itemType, indent: leadingSpaces });
            result.push(itemType === 'ul' ? '<ul>' : '<ol>');
          }
        } else if (currentTop.type !== itemType) {
          // Same indent but different list type (switched from ul to ol or vice versa)
          const closed = listStack.pop();
          result.push(closed.type === 'ul' ? '</ul>' : '</ol>');
          listStack.push({ type: itemType, indent: leadingSpaces });
          result.push(itemType === 'ul' ? '<ul>' : '<ol>');
        }
      }

      result.push(`<li>${formatInline(itemContent)}</li>`);
      continue;
    }

    // Not a list line
    closeAllLists();
    result.push(`<p>${formatInline(trimmed)}</p>`);
  }

  closeAllLists();
  return result.join('\n');
}

const sample = [
  '- Item 1',
  '  - Item 1.1',
  '  - Item 1.2',
  '    - Deep 1.2.1',
  '- Item 2',
  '1. Step 1',
  '2. Step 2',
  '   1. Step 2.a',
  'Regular paragraph'
];

console.log(parseListLines(sample));
