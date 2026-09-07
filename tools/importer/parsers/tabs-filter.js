/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-filter. Base: tabs.
 * Source: https://wknd.site/us/en/adventures.html
 * Block library: Tabs — 2 columns; each row after the block name is one tab:
 *   cell 1 = tab label, cell 2 = tab content (media/details for that tab).
 * Generated: 2026-09-05
 */
export default function parse(element, { document }) {
  // Tab labels — validated: <li class="cmp-tabs__tab"> inside <ol class="cmp-tabs__tablist">
  const tabs = Array.from(element.querySelectorAll('.cmp-tabs__tablist > .cmp-tabs__tab, .cmp-tabs__tab'));
  // Tab panels — validated: <div class="cmp-tabs__tabpanel"> (content for each tab)
  const panels = Array.from(element.querySelectorAll(':scope > .cmp-tabs > .cmp-tabs__tabpanel, .cmp-tabs__tabpanel'));

  // Empty-block guard
  if (!tabs.length || !panels.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Pair each tab label with its panel by index (tabs and panels are 1:1 in DOM order)
  const rowCount = Math.min(tabs.length, panels.length);
  for (let i = 0; i < rowCount; i += 1) {
    const label = tabs[i];
    const panel = panels[i];
    // Label cell: the tab's text; panel cell: the panel content (image list etc.)
    const labelText = (label.textContent || '').trim();
    cells.push([labelText, panel]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-filter', cells });
  element.replaceWith(block);
}
