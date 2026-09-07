import { createOptimizedPicture } from '../../scripts/aem.js';

const SOCIAL = [
  { key: 'facebook', match: ['facebook', 'fb'] },
  { key: 'twitter', match: ['twitter', 'tweet'] },
  { key: 'instagram', match: ['instagram', 'insta', 'ig'] },
];

function classifySocial(text, href) {
  const hay = `${text} ${href}`.toLowerCase();
  const found = SOCIAL.find((s) => s.match.some((m) => hay.includes(m)));
  return found ? found.key : null;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-team-card-image';
      else div.className = 'cards-team-card-body';
    });

    // group the standalone social links into a single icon row
    const body = li.querySelector('.cards-team-card-body');
    if (body) {
      const links = [...body.querySelectorAll('a')].filter((a) => {
        const p = a.closest('p');
        return p && p.parentElement === body && p.textContent.trim() === a.textContent.trim();
      });
      if (links.length) {
        const social = document.createElement('div');
        social.className = 'cards-team-social';
        links.forEach((a) => {
          const label = a.textContent.trim();
          const key = classifySocial(label, a.getAttribute('href') || '');
          a.classList.add('cards-team-social-link');
          if (key) a.classList.add(`cards-team-social-${key}`);
          a.setAttribute('aria-label', label || key || 'social link');
          a.textContent = '';
          const p = a.closest('p');
          social.append(a);
          if (p && !p.textContent.trim() && !p.querySelector('a')) p.remove();
        });
        body.append(social);
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
