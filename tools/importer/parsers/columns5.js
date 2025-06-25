/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main promo-block container
  const promoBlock = element.querySelector('.cmp-promo-block');
  let leftContent, rightContent;
  if (promoBlock) {
    leftContent = promoBlock.querySelector('.cmp-promo-block-left-container');
    rightContent = promoBlock.querySelector('.cmp-promo-block-right-container');
  }

  // Defensive fallback for left
  if (!leftContent) {
    leftContent = document.createElement('div');
    const heading = promoBlock ? promoBlock.querySelector('h2') : null;
    const text = promoBlock ? promoBlock.querySelector('.text') : null;
    const buttonWrapper = promoBlock ? promoBlock.querySelector('.cmp-promo-block__button-wrapper') : null;
    if (heading) leftContent.appendChild(heading);
    if (text) leftContent.appendChild(text);
    if (buttonWrapper) leftContent.appendChild(buttonWrapper);
  }
  // Defensive fallback for right
  if (!rightContent) {
    rightContent = document.createElement('div');
    const image = promoBlock ? promoBlock.querySelector('.cmp-promo-block-right-container img') : null;
    if (image) rightContent.appendChild(image);
  }

  // Table header: one cell (as in the example)
  const headerRow = ['Columns (columns5)'];
  // Table columns row: left, right (as in the example)
  const columnsRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  element.replaceWith(table);
}
