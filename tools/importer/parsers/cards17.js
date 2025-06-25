/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child by selector
  const cmp = element.querySelector('.cmp-news-events');
  if (!cmp) return;
  const cells = [];
  // Header row matches the spec
  cells.push(['Cards (cards17)']);

  // --- Main Story Card ---
  const mainCard = cmp.querySelector('.cmp-news-events-data-card');
  if (mainCard) {
    const img = mainCard.querySelector('.cmp-news-events-card-image img');
    const contentDiv = mainCard.querySelector('.cmp-news-events-content');
    const textParts = [];
    if (contentDiv) {
      const date = contentDiv.querySelector('.cmp-news-events-content-year');
      if (date) textParts.push(date);
      const title = contentDiv.querySelector('.cmp-news-events-content-text');
      if (title) textParts.push(title);
      const desc = contentDiv.querySelector('.cmp-news-events-content-text-paragraph');
      if (desc) textParts.push(desc);
    }
    cells.push([
      img,
      textParts
    ]);
  }

  // --- News Gallery Cards ---
  const galleryCards = Array.from(cmp.querySelectorAll('.cmp-news-events-gallery'));
  galleryCards.forEach(card => {
    const img = card.querySelector('.cmp-news-events-image img');
    const contentDiv = card.querySelector('.cmp-news-events-content');
    const textParts = [];
    if (contentDiv) {
      const date = contentDiv.querySelector('.cmp-news-events-content-year');
      if (date) textParts.push(date);
      const title = contentDiv.querySelector('.cmp-news-events-content-text');
      if (title) textParts.push(title);
    }
    cells.push([
      img,
      textParts
    ]);
  });

  // --- Events Description Cards (no image) ---
  const descCards = Array.from(cmp.querySelectorAll('.cmp-news-events-description'));
  descCards.forEach(card => {
    const contentDiv = card.querySelector('.cmp-news-events-description-image');
    const textParts = [];
    if (contentDiv) {
      const date = contentDiv.querySelector('.cmp-news-events-description-year');
      if (date) textParts.push(date);
      const title = contentDiv.querySelector('.cmp-news-events-description-text');
      if (title) textParts.push(title);
    }
    cells.push([
      '', textParts]);
  });

  // --- Action Buttons (if present) ---
  // Only add a button row if there is at least one button
  const newsBtn = cmp.querySelector('.cmp-news-events-btn .cmp-button');
  const calBtn = cmp.querySelector('.cmp-news-events-calendar .cmp-button');
  if (newsBtn || calBtn) {
    cells.push([
      '',
      [newsBtn, calBtn].filter(Boolean)
    ]);
  }

  // Replace element with table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
