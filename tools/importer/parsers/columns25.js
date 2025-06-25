/* global WebImporter */
export default function parse(element, { document }) {
  // Find the row containing the columns
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct children columns (should be two columns for columns25)
  const cols = Array.from(row.children).filter(
    col => col.classList.contains('col-sm-6')
  );

  // If fallback needed, get all direct divs as columns if .col-sm-6 not found
  const columns = cols.length > 0 ? cols : Array.from(row.children);

  // For each column, gather the main content block
  const cellEls = columns.map(col => {
    // For the left: look for image section
    const img = col.querySelector('img');
    if (img) {
      // Reference its containing .image-component if possible
      const imgComp = img.closest('.image-component');
      if (imgComp) return imgComp;
      return img;
    }
    // For the right: look for heading + text content container
    // Find the main title and content containers
    const title = col.querySelector('.component--title');
    const wysiwyg = col.querySelector('.component--wysiwyg');
    // Combine those into a div if both are present
    if (title && wysiwyg) {
      const wrap = document.createElement('div');
      wrap.appendChild(title);
      wrap.appendChild(wysiwyg);
      return wrap;
    }
    // If only one is present
    if (title) return title;
    if (wysiwyg) return wysiwyg;
    // fallback: return all content in col
    return col;
  });

  // Build the table structure
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns25)'],
    cellEls
  ], document);

  element.replaceWith(table);
}
