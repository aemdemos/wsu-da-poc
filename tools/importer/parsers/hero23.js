/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Extract background image (first <img> in 'rich-background-banner__background')
  let bgImg = null;
  const bgBanners = element.querySelectorAll('.rich-background-banner__background');
  for (const banner of bgBanners) {
    const img = banner.querySelector('img');
    if (img) {
      bgImg = img;
      break;
    }
  }

  // 2. Extract headline (first h1 in the banner, optionally h2)
  let headline = null;
  // Search for h1 within obvious title containers
  const titleCandidates = element.querySelectorAll('.component--title h1, .title__text, h1, h2');
  for (const t of titleCandidates) {
    // Avoid grabbing small sub-headings (pick first top-level heading with text)
    if (t.textContent && t.textContent.trim().length > 0) {
      headline = t;
      break;
    }
  }

  // 3. Extract CTAs (buttons/links in hero area)
  // Find visible buttons/links with class 'cmp-button' (for robustness, a few selectors)
  const ctaLinks = [];
  const ctaButtons = element.querySelectorAll('.cmp-button, .buttonWsu a, .button a, a[role="button"]');
  ctaButtons.forEach(a => {
    // Only add unique, visible CTAs
    if (!ctaLinks.includes(a) && a.textContent && a.textContent.trim().length) {
      ctaLinks.push(a);
    }
  });

  // 4. Compose content cell: headline + CTAs
  const contentItems = [];
  if (headline) contentItems.push(headline);
  if (ctaLinks.length > 0) {
    // Add space between headline and CTA(s) if both are present
    if (headline) contentItems.push(document.createElement('br'));

    // Place all CTAs in a wrapper span (preserving reference)
    const ctaWrapper = document.createElement('span');
    ctaLinks.forEach((cta, i) => {
      ctaWrapper.appendChild(cta);
      if (i < ctaLinks.length - 1) {
        // Add a space between CTAs
        ctaWrapper.appendChild(document.createTextNode(' '));
      }
    });
    contentItems.push(ctaWrapper);
  }

  // 5. Compose table as in example: header, image row, content row
  const cells = [
    ['Hero'],
    [bgImg ? bgImg : ''],
    [contentItems.length > 0 ? contentItems : ''],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 6. No Section Metadata table needed (not in example)
  // 7. Replace element
  element.replaceWith(table);
}
