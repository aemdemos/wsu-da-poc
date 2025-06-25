/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: Must match the example exactly
  const header = ['Hero'];

  // Row 2: background image (may be absent)
  let imageEl = '';
  const heroImg = element.querySelector('.hero-banner img');
  if (heroImg) {
    imageEl = heroImg;
  }

  // Row 3: Collect all text content for the hero area
  let contentEls = [];
  // Try to locate the main content area
  let contentContainer = element.querySelector('.hero-banner__content-wrapper') || element.querySelector('.content');

  if (!contentContainer) {
    // Fallback: search for h1 and description directly
    const h1 = element.querySelector('h1');
    const desc = element.querySelector('.hero-banner__desc');
    if (h1) contentEls.push(h1);
    if (desc) contentEls.push(desc);
  } else {
    // In the hero-banner__content-wrapper, gather all relevant visible elements
    const contentChildren = Array.from(contentContainer.children).filter(node => {
      // Exclude empty nodes
      if (node.nodeType === 3) return node.textContent.trim().length > 0;
      return true;
    });
    if (contentChildren.length > 0) {
      contentEls = contentChildren;
    } else {
      // Fallback: grab text nodes as well, if for some reason children are missing
      contentEls = Array.from(contentContainer.childNodes).filter(node => {
        if (node.nodeType === 3) return node.textContent.trim().length > 0;
        return true;
      });
    }
  }

  // The third cell should contain all text content, joined as a fragment if more than one
  let textCell;
  if (contentEls.length === 1) {
    textCell = contentEls[0];
  } else if (contentEls.length > 1) {
    // Place elements sequentially in the cell
    const frag = document.createDocumentFragment();
    contentEls.forEach(e => frag.append(e));
    textCell = frag;
  } else {
    textCell = '';
  }

  // Assemble the table rows: header, image row, text content row
  const rows = [
    header,
    [imageEl],
    [textCell]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
