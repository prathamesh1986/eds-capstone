import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Detect dynamic mode: a `dynamic` variant whose cells hold a query-index
 * path (optionally a second cell with a max card count).
 * @param {Element} block
 * @returns {{ source: string, limit: number } | null}
 */
function getDynamicConfig(block) {
  if (!block.classList.contains('dynamic')) return null;
  const rows = [...block.querySelectorAll(':scope > div')];
  let source = '';
  let limit = 0;
  rows.forEach((row) => {
    const text = row.textContent.trim();
    const link = row.querySelector('a');
    const href = link ? link.getAttribute('href') : '';
    if (/query-index\.json/.test(href)) source = href;
    else if (/query-index\.json/.test(text)) source = text;
    else if (/^\d+$/.test(text)) limit = parseInt(text, 10);
  });
  return source ? { source, limit: limit || 4 } : null;
}

/**
 * Build the row structure the decorator expects from query-index rows.
 * @param {Array} items index rows ({ path, title, description, image })
 * @returns {DocumentFragment}
 */
function buildCardRows(items) {
  const frag = document.createDocumentFragment();
  items.forEach((item) => {
    const row = document.createElement('div');
    const imgCell = document.createElement('div');
    if (item.image) {
      const pic = document.createElement('picture');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title || '';
      pic.append(img);
      imgCell.append(pic);
    }
    const bodyCell = document.createElement('div');
    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = item.path;
    a.textContent = item.title || item.path;
    h3.append(a);
    bodyCell.append(h3);
    if (item.description) {
      const p = document.createElement('p');
      p.textContent = item.description;
      bodyCell.append(p);
    }
    row.append(imgCell, bodyCell);
    frag.append(row);
  });
  return frag;
}

/**
 * Convert the block's rows into the cards UL structure and optimize images.
 * @param {Element} block
 */
function decorateCards(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-articles-card-image';
      else div.className = 'cards-articles-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}

export default async function decorate(block) {
  const dynamic = getDynamicConfig(block);
  if (dynamic) {
    try {
      const resp = await fetch(dynamic.source);
      if (resp.ok) {
        const json = await resp.json();
        const rows = (json.data || [])
          // newest first when a lastModified value is present
          .sort((a, b) => Number(b.lastModified || 0) - Number(a.lastModified || 0))
          .slice(0, dynamic.limit);
        block.textContent = '';
        block.append(buildCardRows(rows));
      } else {
        block.textContent = '';
      }
    } catch (e) {
      block.textContent = '';
    }
  }
  decorateCards(block);
}
