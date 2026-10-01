// Contract: image | details | displayed price | link. No product-specific branches.
export default function decorate(block) {
  const list = document.createElement('ul');
  const errors = [];
  [...block.children].forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length !== 4 || !cells[0].querySelector('img')
      || !cells[1].querySelector('h3') || !cells[2].textContent.trim()
      || !cells[3].querySelector('a[href]')
      || (cells[2].querySelector('del, em') && !cells[2].querySelector('strong')?.textContent.trim())) {
      const message = `Product row ${index + 1}: expected image, heading/details, price, and link; a sale price also needs a current price.`;
      // eslint-disable-next-line no-console
      console.warn(message);
      row.classList.add('product-cards-invalid');
      errors.push(message);
      return;
    }
    const [media, details, price, destination] = cells;
    const item = document.createElement('li');
    media.className = 'product-cards-media';
    details.className = 'product-cards-details';
    const amount = document.createElement('p');
    amount.className = 'product-cards-price';
    const previous = price.querySelector('del, em');
    const current = price.querySelector('strong');
    if (previous && current) {
      const oldLabel = document.createElement('span');
      oldLabel.className = 'product-cards-price-label';
      oldLabel.textContent = 'Was ';
      const newLabel = document.createElement('span');
      newLabel.className = 'product-cards-price-label';
      newLabel.textContent = 'Now ';
      // Preserve semantic markup and authored values; do not calculate a discount.
      const previousValue = document.createElement('del');
      previousValue.textContent = previous.textContent;
      amount.append(oldLabel, previousValue, document.createTextNode(' '), newLabel, current);
      amount.classList.add('product-cards-price-sale');
    } else {
      amount.textContent = price.textContent.trim();
    }
    destination.className = 'product-cards-link';
    const link = destination.querySelector('a[href]');
    link.setAttribute('aria-label', `${link.textContent.trim()}: ${details.querySelector('h3').textContent.trim()}`);
    item.append(media, details, amount, destination);
    list.append(item);
    row.remove();
  });
  if (list.children.length) block.prepend(list);
  if (errors.length) {
    const notice = document.createElement('p');
    notice.className = 'product-cards-error';
    notice.setAttribute('role', 'alert');
    notice.textContent = `Content needs review. ${errors.join(' ')}`;
    block.prepend(notice);
  }
}
