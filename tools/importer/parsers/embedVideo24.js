/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row exactly matching the example
  const cells = [
    ['Embed (embedVideo24)']
  ];

  // Compose content cell: must include ALL visible content (logo and navigation text)
  const cellContents = [];

  // 1. Add the logo image (first logo or logo block)
  const logoBlock = element.querySelector('.logo--block');
  if (logoBlock) {
    // Reference the original element (not cloning)
    cellContents.push(logoBlock);
  }

  // 2. Add all visible navigation text (as in screenshot)
  // Find all top-level nav name spans in order
  const navSpans = Array.from(
    element.querySelectorAll('.header--subnavbtn__link > span.header--nav--menu--name, .header--subnavbtn.only--parent > a > span.header--nav--menu--name')
  );
  // Map to text and join with enough spacing to mirror the screenshot
  const navText = navSpans.map(s => s.textContent.trim()).filter(Boolean).join('    ');
  if (navText) {
    const navContainer = document.createElement('span');
    navContainer.textContent = navText;
    cellContents.push(navContainer);
  }

  // 3. Ensure ALL visible text content from the navigation is included (catch any missed top-level navs)
  // There may be top-level menu buttons not matching the above selectors (e.g., if class structure varies)
  // So also include all .header--nav--menu--name spans not already included
  const allNavNameSpans = Array.from(element.querySelectorAll('.header--nav--menu--name'));
  allNavNameSpans.forEach(span => {
    if (!navSpans.includes(span)) {
      const extraNav = document.createElement('span');
      extraNav.textContent = span.textContent.trim();
      cellContents.push(extraNav);
    }
  });

  // 4. If no nav is found at all, fallback to all direct text content
  if (cellContents.length === 0) {
    const fallback = element.textContent.replace(/\s+/g, ' ').trim();
    if (fallback) {
      cellContents.push(fallback);
    }
  }

  // Compose the content row
  cells.push([cellContents]);

  // Build the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
