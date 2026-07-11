const mobileFix=document.createElement('link');
mobileFix.rel='stylesheet';
mobileFix.href='mobile-fixes.css?v=10';
document.head.appendChild(mobileFix);

document.querySelectorAll('.brand').forEach((brand)=>{
  brand.innerHTML='<img class="combined-header-logo" src="assets/logo-header.svg?v=10" alt="아둘빠 책방 — 아들 둘 아빠가 시작한 우리 아이 이야기">';
  brand.setAttribute('aria-label','아둘빠 책방 홈');
});

const homeCover=document.querySelector('.book-cover');
if(homeCover){
  const image=document.createElement('img');
  image.className='book-cover real-book-cover';
  image.src='assets/rubiya-cover-final.svg?v=10';
  image.alt='루비야, 동화 속으로 데려다줘 책 표지';
  homeCover.replaceWith(image);
}

const storyCover=document.querySelector('.case .case-art');
if(storyCover){
  storyCover.classList.add('story-cover-art');
  storyCover.innerHTML='<img class="story-cover-image" src="assets/rubiya-cover-final.svg?v=10" alt="루비야, 동화 속으로 데려다줘 실제 표지">';
}

const menu=document.querySelector('.menu');
const nav=document.querySelector('.navlinks');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.navlinks a').forEach((a)=>a.addEventListener('click',()=>nav.classList.remove('open')));
const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
document.querySelectorAll('.navlinks a').forEach((a)=>{
  const target=(a.getAttribute('href')||'').split('#')[0].toLowerCase();
  if(target===current||(current===''&&target==='index.html')) a.classList.add('active');
});
document.querySelectorAll('[data-year]').forEach((el)=>el.textContent=new Date().getFullYear());
const form=document.getElementById('bookForm');
form?.addEventListener('submit',(event)=>{
  event.preventDefault();
  const result=document.getElementById('result');
  result?.classList.add('show');
  result?.scrollIntoView({behavior:'smooth',block:'center'});
});
