/* global WebImporter */
export default function parse(element, { document }) {
  // Compose content for the embed block
  const content = [];

  // Find the main heading (h1-h6) in the block, if any
  const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    content.push(heading);
  }

  // Collect all relevant visible text content (such as intro text, paragraphs)
  // that are not inside the heading and are not containers for the video
  // We'll look for direct children or grandchildren in the major column
  // Often in these pagebuilder grids, video is in its own component
  // This will ensure we don't miss text if it is outside the heading
  // Avoid duplicating the heading text
  const used = new Set();
  if (heading) used.add(heading);
  // Find all elements with text content, but skip elements that contain only whitespace
  const textEls = Array.from(element.querySelectorAll('p, span, div'))
    .filter(el => {
      // Ignore if this is the heading
      if (used.has(el)) return false;
      // Ignore if contains only whitespace
      if (!el.textContent.trim()) return false;
      // Ignore if it contains an iframe (for video area)
      if (el.querySelector('iframe')) return false;
      // Ignore if it's a grid or purely structural
      const classList = el.classList.value;
      if (classList.match(/aem-Grid|component--video|video-component|row|col/)) return false;
      // Ignore if its parent is the heading
      if (heading && heading.contains(el)) return false;
      return true;
    });
  textEls.forEach(el => {
    if (!used.has(el)) {
      content.push(el);
      used.add(el);
    }
  });

  // Find the first iframe (video embed)
  const iframe = element.querySelector('iframe');
  if (iframe && iframe.src) {
    // Add a line break if previous content exists
    if (content.length > 0) {
      content.push(document.createElement('br'));
    }
    const a = document.createElement('a');
    a.href = iframe.src;
    a.textContent = iframe.src;
    content.push(a);
  }

  if (!content.length) {
    // fallback: use the whole element as-is
    content.push(element);
  }

  const cells = [
    ['Embed (embedVideo26)'],
    [content]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
