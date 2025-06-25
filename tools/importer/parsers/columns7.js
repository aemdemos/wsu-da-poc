/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing columns
  const row = element.querySelector('.row');
  if (!row) return;
  // Select left and right columns
  const cols = row.querySelectorAll(':scope > .col-sm-6');
  if (cols.length !== 2) return;

  // LEFT COLUMN: All content inside its aem-Grid
  let leftContent = [];
  const leftGrid = cols[0].querySelector(':scope > .aem-Grid');
  if (leftGrid) {
    // Only direct children for robust structure
    leftContent = Array.from(leftGrid.children);
  } else {
    leftContent = [cols[0]];
  }

  // RIGHT COLUMN: image block (all content, not just the image)
  let rightContent = [];
  const rightGrid = cols[1].querySelector(':scope > .aem-Grid');
  if (rightGrid) {
    // Usually one .image block
    const imageBlock = rightGrid.querySelector(':scope > .image');
    if (imageBlock) {
      rightContent = [imageBlock];
    } else {
      rightContent = [rightGrid];
    }
  } else {
    rightContent = [cols[1]];
  }

  // Compose table rows: header must be a single cell, then next row actual columns
  const cells = [
    ['Columns (columns7)'], // header row: only one cell
    [leftContent, rightContent], // content row: two columns
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Set header cell to have colspan matching the number of columns in second row
  const th = table.querySelector('tr:first-child th');
  if (th && table.rows[1] && table.rows[1].cells.length > 1) {
    th.setAttribute('colspan', table.rows[1].cells.length);
  }

  element.replaceWith(table);
}
