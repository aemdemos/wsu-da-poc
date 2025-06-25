/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main column structure: two columns
  // The real row is deep in the hierarchy, so be robust
  let row = element.querySelector('.row');
  if (!row) {
    // fallback: look for direct .col-sm-6 children
    const cols = element.querySelectorAll('.col-sm-6');
    if (cols.length === 2) {
      row = element; // Use the element as the 'row', and its col children
    } else {
      return; // Cannot find two columns, abort
    }
  }

  // Get the two column elements
  let columns;
  if (row.classList && row.classList.contains('row')) {
    columns = row.querySelectorAll(':scope > .col-sm-6');
  } else {
    columns = row.querySelectorAll(':scope > .col-sm-6');
  }

  if (columns.length < 2) return;

  // Left column: image block
  const imageCol = columns[0];
  // Get the main image element (reference existing element, no clone)
  const image = imageCol.querySelector('img');
  let imageContent = [];
  if (image) {
    // Reference the containing anchor if present, else just the image
    const anchor = image.closest('a');
    if (anchor && anchor.contains(image)) {
      imageContent = [anchor];
    } else {
      imageContent = [image];
    }
  }

  // Right column: text content block
  const textCol = columns[1];
  const textContent = [];
  // Heading (keep its semantics)
  const heading = textCol.querySelector('h1,h2,h3,h4,h5,h6');
  if (heading) textContent.push(heading);

  // Add all WYSIWYG content (paragraphs and all children, if present and not empty)
  const wysiwygs = textCol.querySelectorAll('.component--wysiwyg');
  wysiwygs.forEach(wys => {
    // Only add non-empty
    Array.from(wys.children).forEach(child => {
      // If not an empty paragraph
      if (child.textContent.trim() || child.querySelector('img,video,iframe')) {
        textContent.push(child);
      }
    });
  });

  // Add button (reference existing <a> element only)
  const button = textCol.querySelector('.cmp-button');
  if (button) textContent.push(button);

  // Table header (from example)
  const headerRow = ['Columns (columns3)'];
  // Content row: left col = image, right col = text
  const contentRow = [imageContent, textContent];

  const cells = [headerRow, contentRow];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
