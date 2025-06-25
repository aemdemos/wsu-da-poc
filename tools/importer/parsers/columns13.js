/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the row containing columns
  let row = element.querySelector('.row');
  if (!row) row = element.querySelector('[class*="row"]');
  if (!row) return;

  // Grab all columns for the block (should be two columns)
  const cols = Array.from(row.children).filter(col => col.classList.contains('col-sm-6') || col.className.match(/col-sm-6/));
  if (cols.length < 2) return;

  // Gather content for each column, referencing source elements directly
  const colContents = cols.map(col => {
    const colGrid = col.querySelector('.aem-Grid');
    const colDiv = document.createElement('div');
    if (colGrid) {
      Array.from(colGrid.children).forEach(child => {
        colDiv.appendChild(child);
      });
    } else {
      Array.from(col.children).forEach(child => {
        colDiv.appendChild(child);
      });
    }
    return colDiv;
  });

  // Prepare the table header row with a single header cell, but will set colspan after creation
  const headerRow = ['Columns (columns13)'];

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    colContents
  ], document);

  // Fix: Set colspan on the header cell to span all columns
  const headerTh = table.querySelector('tr:first-child > th');
  if (headerTh && colContents.length > 1) {
    headerTh.setAttribute('colspan', colContents.length);
  }

  element.replaceWith(table);
}
