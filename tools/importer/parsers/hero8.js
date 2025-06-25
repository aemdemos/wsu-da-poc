/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the hero image from the appropriate wrapper
  const img = element.querySelector('.hero-banner__tinted-low img') || null;

  // Extract the heading/title (first h1 in content area)
  let heading = element.querySelector('.content h1, h1');
  // Only include heading if present
  heading = heading || '';

  // Compose block table according to spec: 1 col, 3 rows, 'Hero' as header
  const cells = [
    ['Hero'],
    [img ? img : ''],
    [heading ? heading : '']
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}