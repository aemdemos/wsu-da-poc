/* global WebImporter */
export default function parse(element, { document }) {
  // Find the banner background image
  const bannerBg = element.querySelector('.rich-background-banner__background');
  let img = '';
  if (bannerBg) {
    const foundImg = bannerBg.querySelector('img');
    if (foundImg) img = foundImg;
  }
  
  // Find the content: heading, subheading, CTA (if present)
  const contentParts = [];
  // Main heading (h1)
  const mainHeading = element.querySelector('h1');
  if (mainHeading) contentParts.push(mainHeading);
  // Subheading (h4)
  const subHeading = element.querySelector('h4');
  if (subHeading) contentParts.push(subHeading);
  // CTA button (a.cmp-button)
  const ctaButton = element.querySelector('a.cmp-button');
  if (ctaButton) contentParts.push(ctaButton);

  // Compose the hero block table: 1 col, 3 rows: [header, (optional)img, content]
  const cells = [
    ['Hero'],
    [img],
    [contentParts]
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
