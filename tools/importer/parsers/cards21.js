/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards21)'];
  // Find the .row that contains the cards
  const row = element.querySelector('.row');
  if (!row) return;
  // Get all immediate card columns
  const cardCols = Array.from(row.querySelectorAll(':scope > div'));
  const rows = [headerRow];
  // Loop through each card column
  cardCols.forEach(col => {
    // Find <article class="tile ...">
    const article = col.querySelector('article.tile');
    if (!article) return;
    // Find the tile wrapper for image info
    const tileWrapper = article.querySelector('.tile__wrapper');
    let imgEl = null;
    if (tileWrapper) {
      // Use the highest-res image available
      let imgUrl = tileWrapper.getAttribute('data-src1920')
        || tileWrapper.getAttribute('data-src1440')
        || tileWrapper.getAttribute('data-src1024')
        || tileWrapper.getAttribute('data-src825')
        || tileWrapper.getAttribute('data-src540');
      if (imgUrl) {
        imgEl = document.createElement('img');
        imgEl.src = imgUrl;
        // Try to use the card title as alt
        const titleText = article.querySelector('.title__text');
        imgEl.alt = titleText ? titleText.textContent.trim() : '';
      }
    }
    // Prepare text cell content: title only (as in the HTML)
    let textCell = [];
    const cardTitle = article.querySelector('.title__text');
    if (cardTitle) {
      // Use a <strong> for title as closest to bold in original and example
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = cardTitle.textContent.trim();
      textCell.push(titleStrong);
    }
    rows.push([
      imgEl || '',
      textCell.length ? textCell : ''
    ]);
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
