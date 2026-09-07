/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-gallery. Base: carousel.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-05
 *
 * Block library (Carousel): 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one slide: cell 1 = image (mandatory),
 * cell 2 = optional text content (title, description, CTA).
 *
 * This variant is image-only (no captions/CTA), so each slide row carries only
 * the image cell.
 */
export default function parse(element, { document }) {
  // Each carousel item is a slide.
  const slides = Array.from(element.querySelectorAll('.cmp-carousel__item'));

  const cells = [];

  slides.forEach((slide) => {
    // Image cell (mandatory) — image-only slides have no text/CTA.
    const image = slide.querySelector('.cmp-image img, .image img, img');
    if (image) {
      cells.push([image]);
    }
  });

  // Empty-block guard
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery', cells });
  element.replaceWith(block);
}
