/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active slide or fallback to first
  let activeSlide = element.querySelector('.slide_item.slide_item__active');
  if (!activeSlide) {
    activeSlide = element.querySelector('.slide_item');
  }

  // Extract image element from the slide
  let image = '';
  const imgWrapper = activeSlide.querySelector('.slide_img img');
  if (imgWrapper) {
    image = imgWrapper;
  }

  // Extract all relevant text content and elements from the caption container
  let captionContent = '';
  const captionContainer = activeSlide.querySelector('.slide_caption_container');
  if (captionContainer) {
    // We'll gather all children in order, preserve full structure
    const blocks = [];
    Array.from(captionContainer.childNodes).forEach(node => {
      if (
        (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') ||
        (node.nodeType === Node.TEXT_NODE && node.textContent.trim())
      ) {
        blocks.push(node);
      }
    });
    if (blocks.length === 1) {
      captionContent = blocks[0];
    } else if (blocks.length > 1) {
      captionContent = blocks;
    }
  }

  // Compose block table
  const cells = [
    ['Hero'],
    [image || ''],
    [captionContent || '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
