/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row with two columns (side by side content)
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = Array.from(row.querySelectorAll(':scope > .col-sm-6'));
  if (cols.length < 2) return;

  // First column: gather all content within the first .col-sm-6
  let firstCellContent = [];
  const firstGrid = cols[0].querySelector(':scope > .aem-Grid');
  if (firstGrid) {
    firstCellContent = Array.from(firstGrid.children);
  } else {
    firstCellContent = Array.from(cols[0].children);
  }
  if (firstCellContent.length === 1) firstCellContent = firstCellContent[0];

  // Second column: gather all content within the second .col-sm-6
  let secondCellContent = [];
  const secondGrid = cols[1].querySelector(':scope > .aem-Grid');
  if (secondGrid) {
    secondCellContent = Array.from(secondGrid.children);
  } else {
    secondCellContent = Array.from(cols[1].children);
  }
  if (secondCellContent.length === 1) secondCellContent = secondCellContent[0];

  const cells = [
    ['Columns (columns18)'],
    [firstCellContent, secondCellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
