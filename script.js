const products = [
  {id:1,title:'اسنیکر وِیو',brand:'نایک‌استایل',category:'اسپرت',price:1850000,oldPrice:2200000,discount:'۱۵٪',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80'},
  {id:2,title:'کلاسیک سفید',brand:'کفشینو',category:'روزمره',price:1290000,image:'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80'},
  {id:3,title:'لوفر چرم آریا',brand:'چرم آریا',category:'رسمی',price:2450000,image:'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=80'},
  {id:4,title:'نیم‌بوت کوهستان',brand:'اورست',category:'بوت',price:2980000,oldPrice:3400000,discount:'۱۲٪',image:'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=700&q=80'},
  {id:5,title:'رانینگ فلکس',brand:'فِلِکس',category:'اسپرت',price:1690000,image:'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=700&q=80'},
  {id:6,title:'کفش راحتی سبز',brand:'کفشینو',category:'روزمره',price:980000,image:'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80'},
  {id:7,title:'آکسفورد مشکی',brand:'وینتیج',category:'رسمی',price:2190000,image:'https://images.unsplash.com/photo-1616406432452-07bc5938759d?auto=format&fit=crop&w=700&q=80'},
  {id:8,title:'بوت شهری',brand:'نورث',category:'بوت',price:2750000,image:'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=700&q=80'}
];

let cart = loadCart();
const $ = selector => document.querySelector(selector);
const toman = value => `${new Intl.NumberFormat('fa-IR').format(value)} تومان`;
const number = value => new Intl.NumberFormat('fa-IR').format(value);

function loadCart(){
  try{
    const saved=JSON.parse(localStorage.getItem('kafshino-cart')||'[]');
    if(!Array.isArray(saved)) return [];
    return saved.map(item=>{const product=products.find(p=>p.id===Number(item.id));return product&&item.quantity>0?{...product,quantity:Number(item.quantity)}:null}).filter(Boolean);
  }catch(error){return []}
}

function imageFallback(img){
  img.onerror=()=>{img.onerror=null;img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500"><rect width="100%" height="100%" fill="#e8f2e9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#166534" font-size="28" font-family="Arial">KAFSHINO</text></svg>`)};
}
function renderProducts(){
  const query=$('#searchInput').value.trim().toLowerCase(), category=$('#categoryFilter').value, sort=$('#sortFilter').value;
  let list=products.filter(p=>(category==='همه'||p.category===category)&&(!query||`${p.title} ${p.brand} ${p.category}`.toLowerCase().includes(query)));
  if(sort==='low') list.sort((a,b)=>a.price-b.price); if(sort==='high') list.sort((a,b)=>b.price-a.price);
  $('#productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="product-image">${p.discount?`<span class="discount">${p.discount} تخفیف</span>`:''}<img src="${p.image}" alt="${p.title}" loading="lazy"><button class="favorite" aria-label="افزودن ${p.title} به علاقه‌مندی‌ها">♡</button></div><div class="product-info"><h3>${p.title}</h3><span class="artist">${p.brand} · ${p.category}</span><div class="product-bottom"><span class="price">${toman(p.price)} ${p.oldPrice?`<del class="old-price">${number(p.oldPrice)}</del>`:''}</span><button class="add-button" data-add="${p.id}">+ افزودن</button></div></div></article>`).join('');
  $('#productGrid').querySelectorAll('img').forEach(imageFallback); $('#emptyResults').hidden=list.length>0;
}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.quantity,0), total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
  $('#cartCount').textContent=number(count); $('#cartTotal').textContent=toman(total);
  $('#cartItems').innerHTML=cart.map(i=>`<div class="cart-item"><img src="${i.image}" alt="${i.title}"><div><h4>${i.title}</h4><p>${toman(i.price)}</p><div class="quantity"><button data-minus="${i.id}" aria-label="کم کردن تعداد ${i.title}">−</button><span>${number(i.quantity)}</span><button data-plus="${i.id}" aria-label="زیاد کردن تعداد ${i.title}">+</button><button class="remove" data-remove="${i.id}">حذف</button></div></div></div>`).join('');
  $('#cartItems').querySelectorAll('img').forEach(imageFallback); $('#cartEmpty').hidden=cart.length>0; $('#cartFooter').hidden=cart.length===0;
}
function saveCart(){try{localStorage.setItem('kafshino-cart',JSON.stringify(cart))}catch(error){}renderCart()}
function addToCart(id){const p=products.find(item=>item.id===id), found=cart.find(item=>item.id===id); if(!p)return; found?found.quantity++:cart.push({...p,quantity:1});saveCart();showToast('کفش به سبد خرید اضافه شد')}
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
function toggleCart(open){$('#cartDrawer').classList.toggle('open',open);$('#overlay').classList.toggle('show',open);$('#cartDrawer').setAttribute('aria-hidden',String(!open));if(open)$('#cartClose').focus()}

$('#productGrid').addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add)addToCart(Number(add.dataset.add));const fav=e.target.closest('.favorite');if(fav){fav.classList.toggle('active');fav.textContent=fav.classList.contains('active')?'♥':'♡'}});
$('#cartItems').addEventListener('click',e=>{const control=e.target.closest('[data-minus],[data-plus],[data-remove]');if(!control)return;const id=Number(control.dataset.minus||control.dataset.plus||control.dataset.remove),item=cart.find(i=>i.id===id);if(!item)return;if(control.dataset.minus){item.quantity--;if(item.quantity<1)cart=cart.filter(i=>i.id!==id)}else if(control.dataset.plus)item.quantity++;else cart=cart.filter(i=>i.id!==id);saveCart()});
$('#categoryFilter').addEventListener('change',renderProducts);$('#sortFilter').addEventListener('change',renderProducts);$('#searchInput').addEventListener('input',renderProducts);
document.querySelectorAll('.category-card').forEach(button=>button.addEventListener('click',()=>{$('#categoryFilter').value=button.dataset.category;renderProducts();$('#products').scrollIntoView({behavior:'smooth'})}));
$('#cartOpen').addEventListener('click',()=>toggleCart(true));$('#cartClose').addEventListener('click',()=>toggleCart(false));$('#overlay').addEventListener('click',()=>toggleCart(false));$('.checkout').addEventListener('click',()=>showToast('ثبت سفارش در نسخه آزمایشی فعال نیست'));
$('#searchToggle').addEventListener('click',()=>{$('#searchRow').hidden=!$('#searchRow').hidden;if(!$('#searchRow').hidden)$('#searchInput').focus()});$('#searchClose').addEventListener('click',()=>{$('#searchRow').hidden=true;$('#searchInput').value='';renderProducts()});
$('#menuToggle').addEventListener('click',()=>{const nav=$('#mainNav'),open=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#cartDrawer').classList.contains('open'))toggleCart(false);else if(!$('#searchRow').hidden)$('#searchRow').hidden=true;$('#mainNav').classList.remove('open')}});
renderProducts();renderCart();