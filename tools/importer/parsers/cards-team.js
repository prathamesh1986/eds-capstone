/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-team
 * Base block: cards
 * Source: https://wknd.site/us/en/about-us.html
 * Generated: 2026-09-05
 *
 * Model: block-per-instance. The import selector
 *   `.experiencefragment.cmp-experience-fragment--contributor`
 * matches every contributor/guide card (7 on the about-us page). The framework
 * calls this parser ONCE per matched element and replaces that element in place,
 * so each card becomes its own single-row `cards-team` block. Consecutive blocks
 * plus the intervening <h2> headings ("Our Contributors" / "WKND Guides") and
 * intro text render as the two visual card grids. No sibling grouping is done
 * (that would double-emit); each element is replaced exactly once.
 *
 * Cards convention (from library-description.txt): 2-column table. Row 1 is the
 * block name. Each subsequent row is one card: cell 1 = image, cell 2 = text
 * content (title/heading, description, optional CTAs). Here we emit a single card
 * row: [portrait image] | [name (h3), role (h5), social links].
 */
export default function parse(element, { document }) {
  // Portrait image (circular contributor photo)
  const image = element.querySelector('img.cmp-image__image, .cmp-image img, img');

  // Name is the h3 title; role is the h5 title (validated against source.html)
  const name = element.querySelector('h3.cmp-title__text, .cmp-title h3, h3');
  const role = element.querySelector('h5.cmp-title__text, .cmp-title h5, h5');

  // Social icon links (Facebook / Twitter / Instagram). These are "#" placeholder
  // anchors in the source but are preserved for completeness. Each anchor carries
  // its label text in a nested span, so the element converts to a labeled link.
  const socialLinks = Array.from(
    element.querySelectorAll('.cmp-buildingblock--btn-list a.cmp-button, a.cmp-button'),
  );

  // Empty-block guard: without an image or a name there is no meaningful card.
  if (!image && !name) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Second cell: text content (name, role, social links) stacked vertically.
  const textCell = [];
  if (name) textCell.push(name);
  if (role) textCell.push(role);
  textCell.push(...socialLinks);

  // 2-column card row: [image cell, text cell]. Pad image cell if missing so the
  // row keeps a consistent column count.
  const cells = [[image || '', textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-team', cells });
  element.replaceWith(block);
}
