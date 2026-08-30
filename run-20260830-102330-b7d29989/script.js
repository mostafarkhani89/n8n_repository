const products = [
  {id:1,name:'شامپو تقویت‌کننده موهای خشک',category:'مو',price:285000,oldPrice:340000,discount:'۱۶٪',rating:'۴.۸',reviews:36,icon:'🧴',image:'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=500&q=80'},
  {id:2,name:'کرم مرطوب‌کننده آبرسان پوست',category:'پوست',price:198000,oldPrice:245000,discount:'۱۹٪',rating:'۴.۹',reviews:52,icon:'🌿',image:'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=500&q=80'},
  {id:3,name:'خمیردندان سفیدکننده نعنایی',category:'دهان و دندان',price:119000,oldPrice:null,discount:null,rating:'۴.۷',reviews:28,icon:'✨',image:'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=500&q=80'},
  {id:4,name:'ضدآفتاب بی‌رنگ SPF ۵۰',category:'پوست',price:349000,oldPrice:410000,discount:'۱۵٪',rating:'۴.۹',reviews:74,icon:'☀️',image:'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=500&q=80'},
  {id:5,name:'ژل شست‌وشوی صورت پوست چرب',category:'پوست',price:225000,oldPrice:null,discount:null,rating:'۴.۶',reviews:19,icon:'💧',image:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=500&q=80'},
  {id:6,name:'ماسک مو مغذی و ترمیم‌کننده',category:'مو',price:275000,oldPrice:320000,discount:'۱۴٪',rating:'۴.۸',reviews:41,icon:'🍃',image:'https://images.unsplash.com/photo-1527799820374-dcf8d2d7d6c0?auto=format&fit=crop&w=500&q=80'},
  {id:7,name:'مایع دستشویی کرمی آلوئه‌ورا',category:'بهداشت شخصی',price:89000,oldPrice:null,discount:null,rating:'۴.۵',reviews:17,icon:'🫧',image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80'},
  {id:8,name:'نخ دندان مدل کلاسیک',category:'دهان و دندان',price:75000,oldPrice:90000,discount:'۱۷٪',rating:'۴.۷',reviews:23,icon:'🦷',image:'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&q=80'}
];
let cart = JSON.parse(localStorage.getItem('nika-cart') || '[]');
let activeCategory = 'همه';
const grid = document.getElementById('productGrid');
const empty = document.getElementById('emptyProducts');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');
const faNumber = value => Number(value).toLocaleString('fa-IR');
const money = value => `${faNumber(value)} تومان`;

function renderProducts(){
  const query = searchInput.value.trim().toLowerCase();
  let list = products.filter(p => (activeCategory === 'همه' || p.category === activeCategory) && `${p.name} ${p.category}`.toLowerCase().includes(query));
  if(sortSelect.value === 'low') list.sort((a,b)=>a.price-b.price);
  if(sortSelect.value === 'high') list.sort((a,b)=>b.price-a.price);
  grid.innerHTML = list.map(p => `<article class="product-card"><div class="product-image">${p.discount ? `<span class="discount">${p.discount} تخفیف</span>` : ''}<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-fallback" style="display:none">${p.icon}</span></div><div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-name" title="${p.name}">${p.name}</h3><div class="rating">★★★★★ <span>${p.rating} (${faNumber(p.reviews)} نظر)</span></div><div class="price-row"><div class="price"><strong>${money(p.price)}</strong>${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ''}</div><button class="add-button" data-add="${p.id}" aria-label="افزودن ${p.name} به سبد خرید">+</button></div></div></article>`).join('');
  empty.hidden = list.length !== 0;
}
function saveCart(){localStorage.setItem('nika-cart',JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();showToast('محصول به سبد خرید اضافه شد');}
function changeQty(id, amount){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=amount;if(item.qty<1)cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
  const count=cart.reduce((sum,x)=>sum+x.qty,0);document.getElementById('cartCount').textContent=faNumber(count);
  const items=document.getElementById('cartItems');
  if(!cart.length){items.innerHTML='<div class="cart-empty"><span>🛒</span><b>سبد خرید شما خالی است</b><p>محصولات مورد علاقه‌تان را به سبد اضافه کنید.</p></div>';document.getElementById('cartTotal').textContent='۰ تومان';return;}
  let total=0;items.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);total+=p.price*item.qty;return `<div class="cart-line"><div class="cart-thumb">${p.icon}</div><div class="cart-line-info"><b>${p.name}</b><small>${money(p.price)}</small><div class="quantity"><button data-minus="${p.id}">−</button><span>${faNumber(item.qty)}</span><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">حذف</button></div></div></div>`}).join('');document.getElementById('cartTotal').textContent=money(total);
}
function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
function openCart(){cartDrawer.classList.add('open');overlay.classList.add('show');cartDrawer.setAttribute('aria-hidden','false')}
function closeCart(){cartDrawer.classList.remove('open');overlay.classList.remove('show');cartDrawer.setAttribute('aria-hidden','true')}

grid.addEventListener('click',e=>{const button=e.target.closest('[data-add]');if(button)addToCart(Number(button.dataset.add))});
searchInput.addEventListener('input',renderProducts);sortSelect.addEventListener('change',renderProducts);
document.querySelectorAll('.filter-tab').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;document.querySelectorAll('.filter-tab').forEach(b=>b.classList.toggle('active',b===button));renderProducts()}));
document.querySelectorAll('[data-category-link]').forEach(link=>link.addEventListener('click',()=>{activeCategory=link.dataset.categoryLink;document.querySelectorAll('.filter-tab').forEach(b=>b.classList.toggle('active',b.dataset.category===activeCategory));renderProducts()}));
document.getElementById('clearFilters').addEventListener('click',e=>{e.preventDefault();activeCategory='همه';searchInput.value='';document.querySelectorAll('.filter-tab').forEach(b=>b.classList.toggle('active',b.dataset.category==='همه'));renderProducts()});
document.getElementById('cartButton').addEventListener('click',openCart);document.getElementById('closeCart').addEventListener('click',closeCart);overlay.addEventListener('click',closeCart);
document.getElementById('cartItems').addEventListener('click',e=>{if(e.target.dataset.plus)changeQty(Number(e.target.dataset.plus),1);if(e.target.dataset.minus)changeQty(Number(e.target.dataset.minus),-1);if(e.target.dataset.remove){cart=cart.filter(x=>x.id!==Number(e.target.dataset.remove));saveCart()}});
document.getElementById('checkoutButton').addEventListener('click',()=>showToast(cart.length?'این بخش در نسخه نمایشی فعال نیست.':'سبد خرید شما خالی است'));
renderProducts();renderCart();