/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-experience. Base: hero.
 * Source: https://wknd.site/us/en/adventures.html
 * Block library: Hero — 1 column; row 2 = background image (optional);
 * row 3 = title (heading) + subheading + optional CTA.
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Title — validated: <h2 class="cmp-teaser__title"> in source
  const heading = element.querySelector('.cmp-teaser__title, h1, h2, [class*="title"]');
  // Subheading/description — validated: <div class="cmp-teaser__description"><p>
  const description = element.querySelector('.cmp-teaser__description, .cmp-teaser__content p, p');
  // Optional CTA — not present in this source, but supported by the block
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, a.cmp-teaser__action-link, .cmp-teaser__action-container a'));
  // Background image — validated: <img class="cmp-image__image"> inside .cmp-teaser__image
  const bgImage = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');

  // Empty-block guard
  if (!heading && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional) — its own 1-column row
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: title + subheading + CTA(s) in a single cell (1-column block)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  if (contentCell.length) {
    cells.push([contentCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-experience', cells });
  element.replaceWith(block);
}
