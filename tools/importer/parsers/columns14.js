/* global WebImporter */
export default function parse(element, { document }) {
  // Find both main column divs (image left, content right)
  const row = element.querySelector('.row');
  if (!row) return;
  const colDivs = Array.from(row.children).filter(div => div.classList.contains('col-sm-6'));
  if (colDivs.length !== 2) return;

  // Left column: image
  let imageCell = '';
  const img = colDivs[0].querySelector('img');
  if (img) imageCell = img;

  // Right column: collect all content as a fragment
  const col2Container = colDivs[1];
  const col2Content = [];

  // Grab heading (h3)
  const h3 = col2Container.querySelector('h3');
  if (h3) col2Content.push(h3);

  // WYSIWYG content: all direct children (preserve order/structure)
  const wysiwyg = col2Container.querySelector('.component--wysiwyg');
  if (wysiwyg) {
    // Only include element or text nodes, skip screenreader-only
    Array.from(wysiwyg.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('sr-only')) return;
      // Remove empty text nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      col2Content.push(node);
    });
  }

  // Compose the block table
  const cells = [
    ['Columns (columns14)'],
    [imageCell, col2Content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
