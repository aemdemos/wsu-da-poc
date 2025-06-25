/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel block
  const carousel = element.querySelector('.carousel');
  if (!carousel) return;
  const slickTrack = carousel.querySelector('.slick-track');
  if (!slickTrack) return;
  // Only non-cloned slides
  const slides = Array.from(slickTrack.children).filter(slide => slide.classList.contains('carousel__item') && !slide.classList.contains('slick-cloned'));
  // Header row
  const rows = [['Carousel']];
  slides.forEach(slide => {
    // Get image
    let imgEl = '';
    const imgContainer = slide.querySelector('.carousel__item__imgWithQuote');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img && img.getAttribute('src')) {
        // Fix relative URLs to absolute
        if (img.src.startsWith('/')) {
          const a = document.createElement('a');
          a.href = img.src;
          img.src = a.href;
        }
        imgEl = img;
      }
    }
    // Get all text content in .carousel__item__quote-text
    let textCell = '';
    const textContainer = slide.querySelector('.carousel__item__quote-text');
    if (textContainer) {
      // Collect all ELEMENT children and text nodes
      const children = [];
      textContainer.childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          children.push(node);
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          // For text nodes, wrap in span to preserve
          const span = document.createElement('span');
          span.textContent = node.textContent.trim();
          children.push(span);
        }
      });
      if (children.length > 0) {
        textCell = children;
      } else {
        // fallback: plain text
        textCell = textContainer.textContent.trim();
      }
    }
    rows.push([imgEl, textCell]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
