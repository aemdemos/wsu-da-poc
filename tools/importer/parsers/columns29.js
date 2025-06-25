/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the 'band' container which contains the columns
  const mainBand = element.querySelector('.band.bg--off-white');
  if (!mainBand) return;

  // Find the main row with the columns
  const row = mainBand.querySelector('.row');
  if (!row) return;

  // Get the two columns
  const cols = row.querySelectorAll(':scope > .col-sm-6');
  if (cols.length < 2) return;

  // --- Left column: image ---
  const leftCol = cols[0];
  // Grab the first image-component (preserves structure)
  const imageComponent = leftCol.querySelector('.image-component');
  const leftCellContent = imageComponent ? [imageComponent] : [];

  // --- Right column: heading and rich text ---
  const rightCol = cols[1];
  const rightCellContent = [];
  // Heading (h3)
  const heading = rightCol.querySelector('h3.title__text');
  if (heading) {
    rightCellContent.push(heading);
  }
  // Rich text (component--wysiwyg)
  const wysiwyg = rightCol.querySelector('.component--wysiwyg');
  if (wysiwyg) {
    rightCellContent.push(wysiwyg);
  }

  // Build the table cells array
  const headerRow = ['Columns (columns29)'];
  const dataRow = [leftCellContent, rightCellContent];
  const cells = [headerRow, dataRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
