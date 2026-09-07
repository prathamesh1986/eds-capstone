/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq.
 * Base block: accordion
 * Source: https://wknd.site/us/en/faqs.html (selector: .accordion.panelcontainer)
 * Generated: 2026-09-05
 *
 * Block library convention (accordion): 2-column table. First row = block name.
 * Each subsequent row is one accordion item: [ title cell, content cell ].
 *
 * Source is AEM Core Component accordion markup:
 *   .cmp-accordion__item
 *     .cmp-accordion__button > .cmp-accordion__title  → question (title cell)
 *     .cmp-accordion__panel  (contains nested containers/.cmp-text) → answer (content cell)
 */
export default function parse(element, { document }) {
  // Each accordion item = one question + one answer row.
  const items = element.querySelectorAll('.cmp-accordion__item');

  const cells = [];

  items.forEach((item) => {
    // --- Title cell: the question label ---
    // Prefer the dedicated title span; fall back to the button/header text.
    const titleEl = item.querySelector('.cmp-accordion__title, .cmp-accordion__button, .cmp-accordion__header');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // --- Content cell: the answer body ---
    const panel = item.querySelector('.cmp-accordion__panel, [class*="panel"]');
    const contentEls = [];
    if (panel) {
      // Innermost authored content lives in .cmp-text wrappers; pull their
      // child elements (p, h3, etc.) to preserve semantic markup.
      const textBlocks = panel.querySelectorAll('.cmp-text');
      if (textBlocks.length) {
        textBlocks.forEach((tb) => {
          Array.from(tb.children).forEach((child) => {
            if (child.textContent.trim()) contentEls.push(child);
          });
        });
      } else {
        // Fallback: no .cmp-text wrapper — take the panel's meaningful content.
        Array.from(panel.children).forEach((child) => {
          if (child.textContent.trim() || child.querySelector('img')) contentEls.push(child);
        });
      }
    }

    // Skip empty items; otherwise add the 2-cell row (pad content if empty).
    if (!titleText && contentEls.length === 0) return;
    cells.push([titleText, contentEls.length ? contentEls : '']);
  });

  // Empty-block guard: nothing extractable.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
