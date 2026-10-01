// Each authored row is one guide. Preserve headings, anchors, and optional content.
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const article = document.createElement('article');
    article.className = 'field-notes-guide';
    [...row.children].forEach((cell) => article.append(...cell.childNodes));
    row.replaceWith(article);
  });
}
