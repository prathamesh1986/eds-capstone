// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Toggles the mobile nav open/closed.
 * @param {Element} nav
 * @param {*} forceExpanded Optional param to force expand/collapse state
 */
function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  }
}

function closeOnEscape(nav) {
  return (e) => {
    if (e.code === 'Escape' && !isDesktop.matches) {
      toggleMenu(nav, true);
    }
  };
}

/**
 * Builds a search form from the search section content.
 * The copy (placeholder label) lives in nav.plain.html; the control is built here.
 * @param {Element} section
 */
function decorateSearch(section) {
  const label = (section.textContent || 'Search').trim();
  section.textContent = '';
  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = '/us/en/search';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = label || 'Search';
  input.setAttribute('aria-label', label || 'Search');
  form.append(input);
  section.append(form);
}

/**
 * loads and decorates the WKND header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Metadata-independent dual-fetch: /content first (localhost/aem up), then root (DA/EDS prod)
  let base = '/content/';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    base = '/';
    resp = await fetch('/nav.plain.html');
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Resolve relative image paths (from nav.plain.html) against the same base the
  // fragment was fetched from (/content on localhost, / on DA/EDS production).
  nav.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/')) {
      img.setAttribute('src', `${base}${src}`);
    }
  });

  // Assign section classes in source order: utility, brand, sections, search
  const classes = ['utility', 'brand', 'sections', 'search'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Hoist the nav list to be a direct child of <nav> so nav items are top-level
  // (matches source markup where nav links are direct nav > ul > li > a).
  const sectionsWrapper = nav.querySelector('.nav-sections');
  if (sectionsWrapper) {
    const list = sectionsWrapper.querySelector('ul');
    if (list) {
      list.classList.add('nav-sections');
      sectionsWrapper.classList.remove('nav-sections');
      nav.replaceChild(list, sectionsWrapper);
    }
  }

  // Brand link: strip button styling if present
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) brandLink.className = '';
  }

  // Mark the "Home" nav item so CSS can hide it on desktop (the logo is the home link).
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    const homeItem = [...navSections.querySelectorAll('li')]
      .find((li) => li.textContent.trim().toLowerCase() === 'home');
    if (homeItem) homeItem.classList.add('nav-home-item');
  }

  // Search form
  const navSearch = nav.querySelector('.nav-search');
  if (navSearch) decorateSearch(navSearch);

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Reset to closed on desktop; keep collapsed baseline on mobile
  toggleMenu(nav, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, isDesktop.matches));
  window.addEventListener('keydown', closeOnEscape(nav));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
