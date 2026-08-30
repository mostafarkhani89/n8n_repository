const products = [
  {id:1,name:'کوله‌پشتی کوهنوردی آریا ۴۵ لیتر',category:'کوله‌پشتی',price:2850000,oldPrice:3200000,discount:'۱۲٪',visual:'🎒'},
  {id:2,name:'کفش کوهنوردی آلپاین پرو',category:'پوشاک',price:3980000,oldPrice:4500000,discount:'۱۰٪',visual:'🥾'},
  {id:3,name:'چادر دو نفره کمپینگ',category:'کمپینگ',price:4750000,oldPrice:null,discount:null,visual:'⛺'},
  {id:4,name:'باتوم کوهنوردی تلسکوپی',category:'ابزار',price:1250000,oldPrice:1500000,discount:'۱۶٪',visual:'🏕️'},
  {id:5,name:'کیسه‌خواب چهارفصل',category:'کمپینگ',price:3650000,oldPrice:4100000,discount:'۱۱٪',visual:'🛌'},
  {id:6,name:'کاپشن ضدآب گورتکس',category:'پوشاک',price:2950000,oldPrice:null,discount:null,visual:'🧥'},
  {id:7,name:'چراغ پیشانی شارژی',category:'ابزار',price:780000,oldPrice:950000,discount:'۱۸٪',visual:'🔦'},
  {id:8,name:'کوله سبک صعود ۲۵ لیتر',category:'کوله‌پشتی',price:1890000,oldPrice:null,discount:null,visual:'🎒'}
];
let cart = [];
let selectedCategory = 'همه';
let selectedSort = 'default';
const grid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#search');
const sortSelect = document.querySelector('#sort-products');
const faDigits = value => new Intl.NumberFormat('fa-IR').format(value);
const money = value => `${faDigits(value)} تومان`;

function sortProducts(list) {
  const sorted = [...list];
  if (selectedSort === 'name-asc') sorted.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fa'));
  if (selectedSort === 'price-asc') sorted.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  if (selectedSort === 'price-desc') sorted.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  return sorted;
}

function renderProducts(list = products) {
  const sortedList = sortProducts(list);
  grid.innerHTML = sortedList.map(product => `<article class="product-card"><div class="product-image"><span class="product-visual" role="img" aria-label="${product.name}">${product.visual || '🏔️'}</span>${product.discount ? `<span class="discount">${product.discount} تخفیف</span>` : ''}</div><div class="product-info"><span class="product-category">${product.category || 'سایر'}</span><h3>${product.name || 'محصول بدون نام'}</h3><div class="price-row"><div>${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ''}<span class="price">${money(Number(product.price) || 0)}</span></div><button class="add-product" type="button" data-id="${product.id}" aria-label="افزودن ${product.name} به سبد خرید">+</button></div></div></article>`).join('');
  emptyState.hidden = sortedList.length > 0;
}
function showToast(message) { const toast = document.querySelector('.toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600); }
function addToCart(id) { const item = cart.find(entry => entry.id === id); if (item) item.quantity += 1; else cart.push({id, quantity:1}); renderCart(); showToast('محصول به سبد خرید اضافه شد'); }
function changeQuantity(id, amount) { const item = cart.find(entry => entry.id === id); if (!item) return; item.quantity += amount; if (item.quantity < 1) cart = cart.filter(entry => entry.id !== id); renderCart(); }
function renderCart() { const box = document.querySelector('.cart-items'); const count = cart.reduce((sum,item) => sum + item.quantity, 0); const total = cart.reduce((sum,item) => { const product = products.find(p => p.id === item.id); return sum + (product ? product.price * item.quantity : 0); }, 0); document.querySelector('.cart-count').textContent = faDigits(count); document.querySelector('.cart-total').textContent = money(total); box.innerHTML = cart.length ? cart.map(item => { const product = products.find(p => p.id === item.id); if (!product) return ''; return `<div class="cart-item"><div class="cart-item-image">${product.visual}</div><div class="cart-item-info"><strong>${product.name}</strong><small>${money(product.price)}</small><div class="quantity"><button type="button" data-action="decrease" data-id="${product.id}" aria-label="کاهش تعداد">−</button><span>${faDigits(item.quantity)}</span><button type="button" data-action="increase" data-id="${product.id}" aria-label="افزایش تعداد">+</button></div></div><button class="remove-item" type="button" data-action="remove" data-id="${product.id}" aria-label="حذف ${product.name}">×</button></div>`; }).join('') : '<div class="empty-cart"><p>سبد خرید شما خالی است.</p><p>محصولات مورد علاقه‌تان را به سبد اضافه کنید.</p></div>'; }
function toggleCart(open) { const drawer = document.querySelector('.cart-drawer'); drawer.classList.toggle('open', open); drawer.setAttribute('aria-hidden', String(!open)); document.querySelector('.overlay').classList.toggle('show', open); document.querySelector('.cart-button').setAttribute('aria-expanded', String(open)); }
function filterProducts(category = selectedCategory) { selectedCategory = category; const term = searchInput.value.trim().toLowerCase(); const list = products.filter(product => (category === 'همه' || product.category === category) && String(product.name || '').toLowerCase().includes(term)); renderProducts(list); }

document.addEventListener('click', event => { const add = event.target.closest('.add-product'); if (add) addToCart(Number(add.dataset.id)); const filter = event.target.closest('.filter'); if (filter) { document.querySelectorAll('.filter').forEach(button => button.classList.remove('active')); filter.classList.add('active'); filterProducts(filter.dataset.filter); } const category = event.target.closest('.category-card'); if (category) { document.querySelectorAll('.filter').forEach(button => button.classList.toggle('active', button.dataset.filter === category.dataset.category)); filterProducts(category.dataset.category); document.querySelector('#products').scrollIntoView({behavior:'smooth'}); } const action = event.target.closest('[data-action]'); if (action) { const id = Number(action.dataset.id); if (action.dataset.action === 'increase') changeQuantity(id,1); if (action.dataset.action === 'decrease') changeQuantity(id,-1); if (action.dataset.action === 'remove') { cart = cart.filter(item => item.id !== id); renderCart(); showToast('محصول از سبد حذف شد'); } } });
searchInput.addEventListener('input', () => filterProducts(selectedCategory));
sortSelect.addEventListener('change', event => { selectedSort = event.target.value; filterProducts(selectedCategory); });
document.querySelector('.cart-button').addEventListener('click', () => toggleCart(true));
document.querySelector('.close-cart').addEventListener('click', () => toggleCart(false));
document.querySelector('.overlay').addEventListener('click', () => toggleCart(false));
document.querySelector('.checkout').addEventListener('click', () => showToast(cart.length ? 'پرداخت آنلاین به‌زودی فعال می‌شود' : 'سبد خرید شما خالی است'));
document.querySelector('.menu-toggle').addEventListener('click', event => { const nav = document.querySelector('.main-nav'); const open = nav.classList.toggle('open'); event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.querySelector('.newsletter-form').addEventListener('submit', event => { event.preventDefault(); showToast('عضویت شما با موفقیت انجام شد'); event.currentTarget.reset(); });
renderProducts();
renderCart();