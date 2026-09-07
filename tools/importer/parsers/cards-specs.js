/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-specs. Base: cards.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-05
 *
 * Block library (Cards — no images): 1 column, multiple rows. First row = block name.
 * Each subsequent row = one card, text-only. This cell can contain a heading
 * (label) and description (value).
 *
 * This variant is text-only spec pairs (Activity, Adventure Type, Trip Length,
 * Group Size, Difficulty, Price). Each <div.cmp-contentfragment__element> holds a
 * <dt> label and <dd> value → one card row with label heading + value paragraph.
 */
export default function parse(element, { document }) {
  // Each spec pair is a definition element (dt = label, dd = value).
  const specs = Array.from(element.querySelectorAll('.cmp-contentfragment__element'));

  const cells = [];

  specs.forEach((spec) => {
    const label = spec.querySelector('.cmp-contentfragment__element-title, dt');
    const value = spec.querySelector('.cmp-contentfragment__element-value, dd');

    const labelText = label ? (label.textContent || '').trim() : '';
    const valueText = value ? (value.textContent || '').trim() : '';

    // Only add a card row when there is content to show.
    if (!labelText && !valueText) return;

    const contentCell = [];
    if (labelText) {
      const heading = document.createElement('h3');
      heading.textContent = labelText;
      contentCell.push(heading);
    }
    if (valueText) {
      const p = document.createElement('p');
      p.textContent = valueText;
      contentCell.push(p);
    }

    // 1-column block: single cell holding the label heading + value paragraph.
    cells.push([contentCell]);
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-specs', cells });
  element.replaceWith(block);
}
