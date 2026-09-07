/* eslint-disable */
/* global WebImporter */

// TRANSFORMER IMPORTS
import wkndCleanupTransformer from './transformers/wknd-cleanup.js';

// TRANSFORMER REGISTRY
const transformers = [
  wkndCleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION - embedded from page-templates.json
// Magazine articles are default content (no blocks).
const PAGE_TEMPLATE = {
  name: 'magazine',
  description: 'WKND magazine editorial article: default-content layout (title, byline, intro, pull-quote, subheaded passages with inline images, author bio, related links).',
  urls: [
    'https://wknd.site/us/en/magazine/western-australia.html',
  ],
  blocks: [],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);
    // No blocks on this template — content is authored as default content.
    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: [],
      },
    }];
  },
};
