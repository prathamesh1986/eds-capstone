/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-content. Base: tabs.
 * Source: https://wknd.site/us/en/adventures/bali-surf-camp.html
 * Generated: 2026-09-05
 *
 * Block library (Tabs): 2 columns, multiple rows. First row = block name.
 * Each subsequent row = one tab: cell 1 = tab label, cell 2 = tab content.
 *
 * This variant has three tabs (Overview, Itinerary, What to Bring), each panel
 * holding freeform rich text inside a content fragment.
 */
export default function parse(element, { document }) {
  // Tab labels — <li class="cmp-tabs__tab"> inside <ol class="cmp-tabs__tablist">.
  const tabs = Array.from(element.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab, .cmp-tabs__tab'));
  // Tab panels — <div class="cmp-tabs__tabpanel"> (rich text content for each tab).
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel'));

  // Empty-block guard
  if (!tabs.length || !panels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  const rowCount = Math.min(tabs.length, panels.length);
  for (let i = 0; i < rowCount; i += 1) {
    const label = (tabs[i].textContent || '').trim();
    const panel = panels[i];

    // Content cell: prefer the rich-text elements of the content fragment; the
    // fragment's repeated title (h3) is layout chrome, not tab content, so use
    // the elements wrapper when present.
    const contentSource = panel.querySelector('.cmp-contentfragment__elements') || panel;

    cells.push([label, contentSource]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-content', cells });
  element.replaceWith(block);
}
