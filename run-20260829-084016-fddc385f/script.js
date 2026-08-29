const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const productCards = document.querySelectorAll('.product-card');
const emptyState = document.querySelector('#empty-state');

function filterProducts(category) {
  let visibleCount = 0;
  productCards.forEach((card) => {
    const shouldShow = category === 'all' || card.dataset.category === category;
    card.hidden = !shouldShow;
    if (shouldShow) visibleCount += 1;
  });
  if (emptyState) emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    filterProducts(button.dataset.filter);
  });
});

document.querySelectorAll('[data-filter-link]').forEach((link) => {
  link.addEventListener('click', () => {
    const category = link.dataset.filterLink;
    const matchingButton = document.querySelector(`[data-filter="${category}"]`);
    if (matchingButton) matchingButton.click();
  });
});