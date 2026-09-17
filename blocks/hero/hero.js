/**
 * Hero block. Adds a `no-image` modifier when the first cell has no picture,
 * so variants (promo, experience) can render their content box on a plain
 * surface instead of over an image.
 * @param {Element} block
 */
export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
}
