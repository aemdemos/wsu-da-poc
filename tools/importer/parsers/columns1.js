/* global WebImporter */
export default function parse(element, { document }) {
  // Find the immediate .row for columns
  const row = element.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;

  // Left column: title, body, button - collect in order
  const leftGrid = cols[0].querySelector('.aem-Grid');
  const leftContent = [];
  if (leftGrid) {
    // Title (reference existing heading)
    const titleComp = leftGrid.querySelector('.component--title');
    if (titleComp) {
      const heading = titleComp.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) leftContent.push(heading);
    }
    // Body (wysiwyg)
    const wysiwyg = leftGrid.querySelector('.component--wysiwyg');
    if (wysiwyg) {
      // Remove empty trailing <p> if present
      let children = Array.from(wysiwyg.childNodes).filter(n => {
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'P') {
          return n.textContent.trim().length > 0;
        }
        return true;
      });
      if (children.length > 0) {
        // Wrap in a fragment
        const frag = document.createDocumentFragment();
        children.forEach(child => frag.appendChild(child));
        leftContent.push(frag);
      }
    }
    // Button
    const buttonDiv = leftGrid.querySelector('.buttonWsu');
    if (buttonDiv) leftContent.push(buttonDiv);
  }

  // Right column: image
  const rightGrid = cols[1].querySelector('.aem-Grid');
  const rightContent = [];
  if (rightGrid) {
    const imgDiv = rightGrid.querySelector('.image-component img');
    if (imgDiv) rightContent.push(imgDiv);
  }

  // Build block table as per specification:
  // First row is a single cell header, second row is as many columns as needed
  const cells = [
    ['Columns (columns1)'],
    [[leftContent, rightContent]]
  ];
  // However, we want two columns in the second row: [[left, right]]
  // But the header row must be one column only: ['Columns (columns1)']
  // So, separate header and data row properly:
  const properCells = [
    ['Columns (columns1)'],
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(properCells, document);
  element.replaceWith(table);
}
