/* global WebImporter */
export default function parse(element, { document }) {
  // Safely find the main .row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div.col-sm-6, :scope > div.col-sm-6.js-col');
  if (cols.length < 2) return;

  // Left column: all content (title and wysiwyg)
  const leftCol = cols[0];
  const leftContent = document.createElement('div');
  Array.from(leftCol.children).forEach((child) => {
    leftContent.appendChild(child);
  });

  // Right column: first image (if any)
  const rightCol = cols[1];
  let rightContent = document.createElement('div');
  const image = rightCol.querySelector('img');
  if (image) {
    rightContent.appendChild(image);
  } else {
    // fallback: use everything if no image found
    Array.from(rightCol.children).forEach((child) => {
      rightContent.appendChild(child);
    });
  }

  // The header row is a single cell string, matching example ('Columns (columns6)')
  // The next row has two cells (matching two columns)
  const cells = [
    ['Columns (columns6)'],
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
