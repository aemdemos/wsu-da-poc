/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card-component__card elements (each card)
  const cards = Array.from(element.querySelectorAll('.card-component__card'));

  const headerRow = ['Cards (cards15)'];
  const rows = [headerRow];

  cards.forEach(card => {
    // --- IMAGE CELL ---
    // Find the first <img> inside this card
    const img = card.querySelector('img');
    // If no img, use null to leave cell empty
    const imgCell = img || '';

    // --- TEXT CELL ---
    const textContent = [];

    // Title: Use as strong (semantic in table cell)
    const title = card.querySelector('.card-title, h3');
    if (title) {
      const strong = document.createElement('strong');
      strong.textContent = title.textContent.trim();
      textContent.push(strong);
    }

    // Description: include full description content (preserving original HTML)
    const desc = card.querySelector('.card-description');
    if (desc) {
      // Include all <p> and linebreaks, preserving links, bold etc
      Array.from(desc.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // If there's a text node (some cards may have), wrap in a <span>
          const span = document.createElement('span');
          span.textContent = node.textContent;
          textContent.push(span);
        }
      });
    }

    // CTA: last button link (if present)
    const cta = card.querySelector('.card-component__button .button__item, .card-component__button a[role="button"]');
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim();
      p.appendChild(a);
      textContent.push(p);
    }

    rows.push([imgCell, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
