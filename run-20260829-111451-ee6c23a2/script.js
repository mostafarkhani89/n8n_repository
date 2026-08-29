const products = Array.from(document.querySelectorAll('.product-card')).reduce((map, card) => {
  map[card.dataset.id] = {
    id: card.dataset.id,
    name: card.dataset.name,
    price: Number(card.dataset.price),
    image: card.dataset.image
  };
  return map;
}, {});

let cart = JSON.parse(localStorage.getItem('miladWoodCart') || '[]');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');

const formatPrice = (number) => `${number.toLocaleString('fa-IR')} تومان`;

function saveCart() {
  localStorage.setItem('miladWoodCart', JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...products[id], quantity: 1 });
  saveCart();
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function changeQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) removeFromCart(id);
  else saveCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = count.toLocaleString('fa-IR');
  cartTotal.textContent = total ? formatPrice(total) : '۰ تومان';

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart"><strong>سبد خرید شما خالی است</strong>هنوز محصولی به سبد اضافه نکرده‌اید.<br>یک انتخاب چوبی زیبا منتظر شماست ✦</div>';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatPrice(item.price)}</p>
        <div class="quantity">
          <button type="button" data-action="increase" data-id="${item.id}" aria-label="افزایش تعداد">+</button>
          <span>${item.quantity.toLocaleString('fa-IR')}</span>
          <button type="button" data-action="decrease" data-id="${item.id}" aria-label="کاهش تعداد">−</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-action="remove" data-id="${item.id}" aria-label="حذف ${item.name}">×</button>
    </div>
  `).join('');
}

function toggleCart(open) {
  cartModal.classList.toggle('open', open);
  cartModal.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

document.querySelectorAll('[data-add]').forEach(button => {
  button.addEventListener('click', () => addToCart(button.dataset.add));
});

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    button.classList.add('active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
    });
  });
});

cartItems.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === 'remove') removeFromCart(id);
  if (action === 'increase') changeQuantity(id, 1);
  if (action === 'decrease') changeQuantity(id, -1);
});

document.getElementById('openCart').addEventListener('click', () => toggleCart(true));
document.getElementById('closeCart').addEventListener('click', () => toggleCart(false));
cartModal.addEventListener('click', event => {
  if (event.target === cartModal) toggleCart(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') toggleCart(false);
});

document.querySelector('.checkout-button').addEventListener('click', () => {
  if (cart.length) alert('این فروشگاه نمایشی است؛ ثبت سفارش واقعی در نسخه بعدی فعال می‌شود.');
});

renderCart();