/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to select the immediate child by class
  function getImmediateChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get left (acknowledgement + nav) and right (contact + social)
  const leftCol = getImmediateChildByClass(element, 'cmp-footer__container__left');
  const rightCol = getImmediateChildByClass(element, 'cmp-footer__container__right');

  // Compose cells for the columns block
  // Left column: Title + icons + text + nav links
  // Right column: Contact + social

  // --- LEFT COLUMN ---
  let leftContent = [];
  if (leftCol) {
    // Title and icons
    const titleBlock = leftCol.querySelector('.cmp-footer__title');
    if (titleBlock) leftContent.push(titleBlock);
    // Text
    const textBlock = leftCol.querySelector('.cmp-text');
    if (textBlock) leftContent.push(textBlock);
    // Nav Links (footer nav links)
    const navBlock = leftCol.querySelector('.cmp-footer__navlink');
    if (navBlock) leftContent.push(navBlock);
  }

  // --- RIGHT COLUMN ---
  let rightContent = [];
  if (rightCol) {
    // Contact block (may include title, contact list, address)
    const contactBlock = rightCol.querySelector('.cmp-footer__contact');
    if (contactBlock) rightContent.push(contactBlock);
    // Social block (follow us)
    const followBlock = rightCol.querySelector('.cmp-footer__follow');
    if (followBlock) rightContent.push(followBlock);
  }

  // Build the table for Columns (columns10)
  // Header MUST exactly match the block name
  const headerRow = ['Columns (columns10)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
