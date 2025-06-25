/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block within the element (look for the deepest accordion)
  let accordion = element.querySelector('.component--accordion .accordion, .component--accordion, .accordion');
  // Fallback: look for .accordion inside main element
  if (!accordion) {
    accordion = element.querySelector('.accordion');
  }
  if (!accordion) return;

  // Get all accordion items (each item is a row)
  const items = accordion.querySelectorAll('.accordion__item, .js-accordion__item');
  // Prepare rows with header
  const rows = [['Accordion']];

  items.forEach(item => {
    // Title cell: get the button element and preserve its HTML structure
    const btn = item.querySelector('.accordion__head, .js-accordion__trigger');
    let titleCell = '';
    if (btn) {
      const titleDiv = document.createElement('div');
      // preserve button's HTML content (bold, etc)
      titleDiv.innerHTML = btn.innerHTML;
      titleCell = titleDiv;
    }

    // Content cell: get the inner content block
    let contentCell = '';
    const body = item.querySelector('.accordion__body, .js-accordion__body');
    if (body) {
      // Usually has an .accordion__inner wrapper
      let contentRoot = body.querySelector('.accordion__inner');
      if (!contentRoot) contentRoot = body;
      // Use all direct children (paragraphs, divs, etc)
      const children = Array.from(contentRoot.children);
      if (children.length === 1) {
        contentCell = children[0];
      } else if (children.length > 1) {
        contentCell = children;
      } else {
        // If no children, but there is text
        contentCell = contentRoot.textContent.trim();
      }
    }

    rows.push([titleCell, contentCell]);
  });

  // Replace the original element with the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
