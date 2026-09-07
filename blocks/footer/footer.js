/**
 * loads and decorates the WKND footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Resolve relative image paths (from footer.plain.html) to the content root
  footer.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/')) {
      img.setAttribute('src', `/content/${src}`);
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
