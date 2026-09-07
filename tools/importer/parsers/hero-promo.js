/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo. Base: hero.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-05
 *
 * Block library (Hero): 1 column, 3 rows. First row = block name.
 * Row 2 = background image (optional). Row 3 = text content
 * (title heading, subheading/description, CTA link).
 */
export default function parse(element, { document }) {
  // Background image (row 2, optional)
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  // Text content (row 3)
  const contentCell = [];
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));

  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  // Empty-block guard
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 1-column block: each row is a single cell.
  const cells = [];
  if (image) cells.push([image]);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
