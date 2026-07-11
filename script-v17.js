const mobileFix=document.createElement('link');
mobileFix.rel='stylesheet';
mobileFix.href='mobile-fixes.css?v=17';
document.head.appendChild(mobileFix);

const RAW_BASE='https://raw.githubusercontent.com/KimJungHyun1004/adulpba-bookshop/main/';

async function extractEmbeddedImage(paths){
  let lastError;
  for(const path of paths){
    try{
      const response=await fetch(path,{cache:'no-store'});
      if(!response.ok) throw new Error(`${path}: ${response.status}`);
      const source=await response.text();
      const match=source.match(/(?:href|xlink:href)=["'](data:image\/(?:jpeg|jpg|png|webp);base64,[^"']+)["']/i);
      if(!match) throw new Error(`embedded image not found: ${path}`);
      return match[1];
    }catch(error){
      lastError=error;
    }
  }
  throw lastError||new Error('image source unavailable');
}

async function setBrandLogo(){
  const brands=document.querySelectorAll('.brand');
  if(!brands.length) return;
  try{
    const imageUrl=await extractEmbeddedImage([
      'assets/logo-header.svg?v=17',
      `${RAW_BASE}assets/logo-header.svg?v=17`,
      `${RAW_BASE}assets/logo-base.svg?v=17`
    ]);
    brands.forEach((brand)=>{
      const image=document.createElement('img');
      image.className='official-header-logo';
      image.src=imageUrl;
      image.alt='아둘빠 책방 — 아들 둘 아빠가 시작한 우리 아이 이야기';
      brand.replaceChildren(image);
      brand.setAttribute('aria-label','아둘빠 책방 홈');
    });
  }catch(error){
    console.error('Logo load failed',error);
  }
}

async function setRubiyaCover(){
  try{
    const imageUrl=await extractEmbeddedImage([
      'assets/sample-book-rubiya-cover.svg?v=17',
      `${RAW_BASE}assets/sample-book-rubiya-cover.svg?v=17`,
      `${RAW_BASE}assets/rubiya-cover-final.svg?v=17`
    ]);
    const homeCover=document.querySelector('.book-cover');
    if(homeCover){
      const image=document.createElement('img');
      image.className='book-cover real-book-cover';
      image.src=imageUrl;
      image.alt='루비야, 동화 속으로 데려다줘 책 표지';
      homeCover.replaceWith(image);
    }
    const storyCover=document.querySelector('.case .case-art');
    if(storyCover){
      const image=document.createElement('img');
      image.className='story-cover-image';
      image.src=imageUrl;
      image.alt='루비야, 동화 속으로 데려다줘 실제 표지';
      storyCover.classList.add('story-cover-art');
      storyCover.replaceChildren(image);
    }
  }catch(error){
    console.error('Rubiya cover load failed',error);
  }
}

setBrandLogo();
setRubiyaCover();

const menu=document.querySelector('.menu');
const nav=document.querySelector('.navlinks');
menu?.addEventListener('click',()=>nav?.classList.toggle('open'));
document.querySelectorAll('.navlinks a').forEach((a)=>a.addEventListener('click',()=>nav?.classList.remove('open')));
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
