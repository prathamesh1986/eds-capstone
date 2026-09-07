/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-articles. Base: cards.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-05
 *
 * Block library (Cards): 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one card: cell 1 = image (mandatory),
 * cell 2 = text content (title heading, description, optional CTA).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-image-list__item, li'));

  const cells = [];

  items.forEach((item) => {
    // Image cell
    const image = item.querySelector('.cmp-image-list__item-image img, .cmp-image img, img');

    // Text content cell
    const contentCell = [];

    // Title — source wraps the title text in a link (<a><span>title</span></a>).
    const titleLink = item.querySelector('.cmp-image-list__item-title-link');
    const titleSpan = item.querySelector('.cmp-image-list__item-title, [class*="item-title"]:not(a)');
    if (titleLink) {
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.href = titleLink.getAttribute('href');
      link.textContent = (titleSpan ? titleSpan.textContent : titleLink.textContent).trim();
      heading.appendChild(link);
      contentCell.push(heading);
    } else if (titleSpan) {
      const heading = document.createElement('h3');
      heading.textContent = titleSpan.textContent.trim();
      contentCell.push(heading);
    }

    // Description
    const description = item.querySelector('.cmp-image-list__item-description, [class*="description"], p');
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      contentCell.push(p);
    }

    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
