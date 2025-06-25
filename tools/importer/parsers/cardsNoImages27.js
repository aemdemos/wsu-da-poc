/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row containing the cards
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > .vg--small.col-sm-6.col-lg-3.col-md-6');

  // Prepare the table rows array
  const rows = [['Cards']]; // header row as in the example

  cols.forEach((col) => {
    // Each col should contain .component--tile > article > a > ...
    const article = col.querySelector('article');
    if (!article) return;
    const link = article.querySelector('a');
    if (!link) return;
    // Title is always in .title__text
    const title = link.querySelector('.title__text');
    if (!title) return;

    // Find a description if present -- look for a p, div, or span after title__text
    let description = null;
    // Look for a sibling paragraph or similar after .title__text
    let possibleDesc = title.parentElement;
    while (possibleDesc && possibleDesc !== link) {
      const next = possibleDesc.nextElementSibling;
      if (next && ['P', 'DIV', 'SPAN'].includes(next.tagName) && next !== title) {
        description = next;
        break;
      }
      possibleDesc = possibleDesc.parentElement;
    }

    // Build contents array: Title as <strong> in <a>, description (if present) as <p>
    const a = link;
    // Remove all children
    while (a.firstChild) a.removeChild(a.firstChild);
    // Add <strong> with title text as content
    const strong = document.createElement('strong');
    strong.textContent = title.textContent.trim();
    a.appendChild(strong);

    const cellContents = [a];
    if (description) {
      // If a description is found, wrap it in a <p> if not already
      if (description.tagName === 'P') {
        cellContents.push(description);
      } else {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        cellContents.push(p);
      }
    }
    rows.push([cellContents]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
