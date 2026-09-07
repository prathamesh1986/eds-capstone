/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://wknd.site/us/en.html
 * Generated: 2026-09-05
 *
 * Block library: 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one slide: cell 1 = image (mandatory),
 * cell 2 = text content (title heading, description, CTA link).
 */
export default function parse(element, { document }) {
  // Each carousel item is a slide. Fallback to teaser if item wrapper absent.
  let slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.cmp-teaser, [class*="teaser"]'));
  }

  const cells = [];

  slides.forEach((slide) => {
    // Image cell (mandatory)
    const image = slide.querySelector('.cmp-teaser__image img, .cmp-image img, img');

    // Text content cell (optional pieces)
    const contentCell = [];
    const title = slide.querySelector('.cmp-teaser__title, h1, h2, h3, [class*="title"]');
    const description = slide.querySelector('.cmp-teaser__description, [class*="description"], p');
    const ctaLinks = Array.from(slide.querySelectorAll('.cmp-teaser__action-link, .cmp-teaser__action-container a, a.button'));

    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);

    // Only add a slide row if there is at least an image or some content
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
