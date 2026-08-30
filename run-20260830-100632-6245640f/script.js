const products = [
  {id:1,name:'کرم آبرسان روزانه',category:'پوست',price:189000,oldPrice:239000,discount:21,emoji:'🧴',visual:'visual-skin'},
  {id:2,name:'شامپو تقویت‌کننده مو',category:'مو',price:156000,oldPrice:195000,discount:20,emoji:'🫧',visual:'visual-hair'},
  {id:3,name:'خمیردندان سفیدکننده',category:'دهان و دندان',price:98000,oldPrice:125000,discount:22,emoji:'🪥',visual:'visual-oral'},
  {id:4,name:'صابون گیاهی اسطوخودوس',category:'بدن',price:72000,oldPrice:85000,discount:15,emoji:'🧼',visual:'visual-body'},
  {id:5,name:'ضدآفتاب بی‌رنگ SPF50',category:'پوست',price:265000,oldPrice:315000,discount:16,emoji:'☀️',visual:'visual-skin'},
  {id:6,name:'ماسک موی مغذی',category:'مو',price:178000,oldPrice:220000,discount:19,emoji:'🥥',visual:'visual-hair'},
  {id:7,name:'دهان‌شویه بدون الکل',category:'دهان و دندان',price:119000,oldPrice:145000,discount:18,emoji:'💧',visual:'visual-oral'},
  {id:8,name:'لوسیون بدن وانیل',category:'بدن',price:142000,oldPrice:175000,discount:19,emoji:'🌸',visual:'visual-body'}
];
let activeFilter = 'همه';
let searchTerm = '';

function readCart() {
  try {
    const stored = localStorage.getItem('pakizeh-cart');
    const parsed = stored ? JSON.parse(stored) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([id, quantity]) => {
      return products.some(product => product.id === Number(id)) && Number.isInteger(quantity) && quantity > 0;
    }));
  } catch (error) {
    return {};
  }
}

let cart = readCart();
const $ = selector => document.querySelector(selector);
const formatPrice = value => new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
const formatNumber = value => new Intl.NumberFormat('fa-IR').format(value);

function renderProducts() {
  const sort = $('#sortSelect').value;
  let visible = products.filter(product => {
    const matchesCategory = activeFilter === 'همه' || product.category === activeFilter;
    const matchesSearch = product.name.includes(searchTerm) || product.category.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });
  if (sort === 'price-low') visible.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') visible.sort((a, b) => b.price - a.price);
  if (sort === 'discount') visible.sort((a, b) => b.discount - a.discount);
  $('#productGrid').innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-visual ${product.visual}"><span class="discount">${product.discount}٪ تخفیف</span><span class="product-emoji" role="img" aria-label="${product.name}">${product.emoji}</span></div>
      <div class="product-info"><span class="product-category">${product.category}</span><h3 class="product-name">${product.name}</h3><div class="price-row"><div class="price"><strong>${formatPrice(product.price)}</strong><s>${formatPrice(product.oldPrice)}</s></div><button class="add-button" type="button" data-add="${product.id}" aria-label="افزودن ${product.name} به سبد خرید">+</button></div></div>
    </article>`).join('');
  $('#emptyState').hidden = visible.length !== 0;
}

function saveCart() {
  try {
    localStorage.setItem('pakizeh-cart', JSON.stringify(cart));
  } catch (error) {
    // سبد خرید در حافظه فعال می‌ماند؛ ذخیره‌سازی محلی ممکن است در حالت خصوصی مسدود باشد.
  }
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  renderCart();
  showToast('محصول به سبد خرید اضافه شد');
}

function changeQuantity(id, amount) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const nextQuantity = (cart[id] || 0) + amount;
  if (nextQuantity > 0) cart[id] = nextQuantity;
  else delete cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(cart).map(([id, quantity]) => ({
    ...products.find(product => product.id === Number(id)),
    quantity
  })).filter(item => item.id);
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $('#cartCount').textContent = formatNumber(count);
  $('#cartItems').innerHTML = entries.map(item => `<div class="cart-item"><div class="cart-item-visual ${item.visual}">${item.emoji}</div><div class="cart-item-info"><strong>${item.name}</strong><small>${formatPrice(item.price)}</small><div class="quantity"><button type="button" data-minus="${item.id}" aria-label="کاهش تعداد ${item.name}">−</button><span>${formatNumber(item.quantity)}</span><button type="button" data-plus="${item.id}" aria-label="افزایش تعداد ${item.name}">+</button></div></div><button class="remove-item" type="button" data-remove="${item.id}" aria-label="حذف ${item.name}">×</button></div>`).join('');
  $('#cartTotal').textContent = formatPrice(total);
  $('#cartEmpty').style.display = entries.length ? 'none' : 'block';
  $('#cartFooter').style.display = entries.length ? 'block' : 'none';
}

function toggleCart(open) {
  $('#cartPanel').classList.toggle('open', open);
  $('#overlay').classList.toggle('show', open);
  $('#cartPanel').setAttribute('aria-hidden', String(!open));
}

let toastTimer;
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

document.addEventListener('click', event => {
  const add = event.target.closest('[data-add]');
  if (add) addToCart(Number(add.dataset.add));

  const plus = event.target.closest('[data-plus]');
  if (plus) changeQuantity(Number(plus.dataset.plus), 1);

  const minus = event.target.closest('[data-minus]');
  if (minus) changeQuantity(Number(minus.dataset.minus), -1);

  const remove = event.target.closest('[data-remove]');
  if (remove) {
    delete cart[remove.dataset.remove];
    saveCart();
    renderCart();
    showToast('محصول از سبد حذف شد');
  }

  const category = event.target.closest('[data-category]');
  if (category) {
    activeFilter = category.dataset.category;
    document.querySelectorAll('.filter-button').forEach(button => button.classList.toggle('active', button.dataset.filter === activeFilter));
    document.querySelector('#products').scrollIntoView({behavior:'smooth'});
    renderProducts();
  }
});

$('.filter-row').addEventListener('click', event => {
  const button = event.target.closest('.filter-button');
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter-button').forEach(item => item.classList.toggle('active', item === button));
  renderProducts();
});

$('#searchInput').addEventListener('input', event => {
  searchTerm = event.target.value.trim();
  renderProducts();
});
$('#sortSelect').addEventListener('change', renderProducts);
$('#focusSearch').addEventListener('click', () => {
  $('#products').scrollIntoView({behavior:'smooth'});
  $('#searchInput').focus();
});
$('#openCart').addEventListener('click', () => toggleCart(true));
$('#closeCart').addEventListener('click', () => toggleCart(false));
$('#overlay').addEventListener('click', () => toggleCart(false));
$('#clearFilters').addEventListener('click', () => {
  activeFilter = 'همه';
  searchTerm = '';
  $('#searchInput').value = '';
  document.querySelectorAll('.filter-button').forEach(button => button.classList.toggle('active', button.dataset.filter === 'همه'));
  renderProducts();
});
$('#checkoutButton').addEventListener('click', () => showToast('سفارش نمایشی شما با موفقیت ثبت شد؛ پرداختی انجام نشد.'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') toggleCart(false);
});

renderProducts();
renderCart();