/**
 * loads and decorates the WKND footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let base = '/content/';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    base = '/';
    resp = await fetch('/footer.plain.html');
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Resolve footer image sources. DA's asset pipeline can rewrite a relative
  // fragment image (images/x.svg) to a broken "about:error" src at ingest, so
  // repair by alt text against the known image files, then fall back to
  // resolving genuine relative paths against the fetch base.
  const FOOTER_IMAGES = {
    'wknd logo': 'wknd-logo.svg',
    'facebook wknd': 'social-facebook.svg',
    'twitter wknd': 'social-twitter.svg',
    'instagram wknd': 'social-instagram.svg',
  };
  footer.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    const alt = (img.getAttribute('alt') || '').trim().toLowerCase();
    const known = FOOTER_IMAGES[alt];
    if ((!src || src.startsWith('about:') || src === '') && known) {
      img.setAttribute('src', `${base}images/${known}`);
      img.removeAttribute('width');
      img.removeAttribute('height');
    } else if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('about:')) {
      img.setAttribute('src', `${base}${src}`);
    }
  });

  // Assign section classes in source order: brand, social, legal
  const classes = ['brand', 'social', 'legal'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });

  block.append(footer);
}
