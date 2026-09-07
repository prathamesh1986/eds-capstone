/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup.
 * Removes non-authorable site chrome and malformed markup so the import
 * contains only page-level authorable content.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Tracking / ID-syncing iframe (cleaned.html line 566) and mobile nav
    // overlay + toggle (cleaned.html lines 568, 574) — removed before parsing
    // so they cannot interfere with block matching.
    WebImporter.DOMUtils.remove(element, [
      '#destination_publishing_iframe_wkndsite_0',
      '#toggleNav',
      '#mobileNav',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome: header + footer experience fragments
    // (cleaned.html lines 5 and 471).
    WebImporter.DOMUtils.remove(element, [
      'header.cmp-experiencefragment--header',
      'footer.cmp-experiencefragment--footer',
    ]);

    // Stray empty <meta> tags left inside cmp-image wrappers
    // (cleaned.html lines 183, 204, 227, 271, 334, 378) and other
    // non-authorable leftover elements.
    WebImporter.DOMUtils.remove(element, [
      'meta',
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
