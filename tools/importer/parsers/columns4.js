/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row containing the two columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get the first and second (left, right) columns
  const cols = row.querySelectorAll(':scope > .col-sm-6, :scope > .col-sm-6.js-col');
  if (cols.length < 2) return;
  const leftCol = cols[0];
  const rightCol = cols[1];

  // LEFT COLUMN: gather heading, paragraph, and button in order
  const leftGrid = leftCol.querySelector('.aem-Grid');
  const leftContent = [];
  if (leftGrid) {
    // Title
    const title = leftGrid.querySelector('.component--title h3, .component--title h2, .component--title h1');
    if (title) leftContent.push(title);
    // First non-empty wysiwyg paragraph
    const wysiwygs = leftGrid.querySelectorAll('.component--wysiwyg');
    for (const wys of wysiwygs) {
      const p = wys.querySelector('p');
      if (p && p.textContent.trim()) {
        leftContent.push(p);
        break;
      }
    }
    // Button
    const button = leftGrid.querySelector('.buttonWsu');
    if (button) leftContent.push(button);
  }

  // RIGHT COLUMN: find the image
  const rightGrid = rightCol.querySelector('.aem-Grid');
  let img = null;
  if (rightGrid) {
    const imageContainer = rightGrid.querySelector('.image-component img');
    if (imageContainer) img = imageContainer;
  }

  // Construct the table header and content row
  const tableHeader = ['Columns (columns4)'];
  const tableRow = [
    leftContent.length === 1 ? leftContent[0] : leftContent,
    img
  ];

  const table = WebImporter.DOMUtils.createTable([
    tableHeader,
    tableRow
  ], document);
  element.replaceWith(table);
}
