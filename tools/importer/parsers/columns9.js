/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column cells
  let columns = [];
  const rows = element.querySelectorAll('.row');
  let found = false;
  rows.forEach((row) => {
    if (found) return;
    const colDivs = row.querySelectorAll(':scope > .col-sm-6');
    if (colDivs.length >= 2) {
      found = true;
      colDivs.forEach((colDiv) => {
        columns.push(colDiv);
      });
    }
  });
  // Fallback if nothing found
  if (columns.length === 0) {
    const colDivs = element.querySelectorAll('.col-sm-6');
    colDivs.forEach((colDiv) => {
      columns.push(colDiv);
    });
  }
  if (columns.length === 0) {
    columns = [element];
  }
  // The header row must be a single cell
  const headerRow = ['Columns (columns9)'];
  // The second row contains all columns as cells
  const tableRows = [headerRow, columns];
  // createTable will automatically make the header row span all columns
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
