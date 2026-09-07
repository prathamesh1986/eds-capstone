/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-featured. Base: columns.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-05
 *
 * Block library: multiple columns/rows. First row = block name.
 * Content is grouped side-by-side into columns. This featured teaser has two
 * natural columns: text content (pretitle, title, description, CTA) and image.
 */
export default function parse(element, { document }) {
  // Text content column
  const contentCell = [];
  const pretitle = element.querySelector('.cmp-teaser__pretitle, [class*="pretitle"]');
  const title = element.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
  const description = element.querySelector('.cmp-teaser__description, [class*="description"], p:not([class*="pretitle"])');
  const ctaLinks = Array.from(element.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));

  if (pretitle) contentCell.push(pretitle);
  if (title) contentCell.push(title);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  // Image column
  const image = element.querySelector('.cmp-teaser__image img, .cmp-image img, img');

  // Empty-block guard
  if (!contentCell.length && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [
    [contentCell.length ? contentCell : '', image || ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-featured', cells });
  element.replaceWith(block);
}
