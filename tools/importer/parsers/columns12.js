/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as in the example, single column
  const headerRow = ['Columns (columns12)'];

  // Find the .row containing the columns
  let row = element.querySelector('.row');
  if (!row) {
    row = element.querySelector('[class*=row]');
  }
  if (!row) return;

  // Get all immediate children that are columns
  const cols = Array.from(row.querySelectorAll(':scope > .col-sm-6'));
  if (cols.length < 2) return;

  // Each column may contain a .aem-Grid as its main grid wrapper; grab the .aem-Grid or all content
  function extractColContent(col) {
    // Prefer the main .aem-Grid if present, else just use the full column
    const grid = col.querySelector(':scope > .aem-Grid');
    if (grid) {
      // Some .aem-Grid may be empty wrappers, so check for meaningful children
      const kids = Array.from(grid.children).filter(
        node => node.textContent.trim().length > 0 || node.querySelector('img, h1, h2, h3, h4, h5, h6, p, a, ul, ol, li')
      );
      if (kids.length > 0) {
        // Return all direct children
        return kids;
      }
    }
    // fallback: use all direct children that are meaningful
    const kids = Array.from(col.children).filter(
      node => node.textContent.trim().length > 0 || node.querySelector('img, h1, h2, h3, h4, h5, h6, p, a, ul, ol, li')
    );
    if (kids.length > 0) return kids;
    // fallback: use the column itself
    return [col];
  }

  const col1Content = extractColContent(cols[0]);
  const col2Content = extractColContent(cols[1]);

  // The content for each cell is either the array of meaningful children, or the element itself
  // The structure must be: [[header], [col1Content, col2Content]]
  const cells = [
    headerRow,
    [col1Content, col2Content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
