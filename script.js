const mobileFix=document.createElement('link');
mobileFix.rel='stylesheet';
mobileFix.href='mobile-fixes.css?v=15';
document.head.appendChild(mobileFix);

async function loadInlineSvg(url,className,label){
  const response=await fetch(url,{cache:'no-store'});
  if(!response.ok) throw new Error(`asset ${response.status}`);
  const source=await response.text();
  const documentSvg=new DOMParser().parseFromString(source,'image/svg+xml');
  const svg=documentSvg.documentElement;
  if(!svg||svg.nodeName.toLowerCase()!=='svg') throw new Error('invalid svg');
  svg.classList.add(className);
  svg.setAttribute('role','img');
  svg.setAttribute('aria-label',label);
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  return document.importNode(svg,true);
}

async function restoreBrand(){
  const brands=document.querySelectorAll('.brand');
  if(!brands.length) return;
  try{
    const logo=await loadInlineSvg('assets/logo-base.svg?v=15','official-header-logo','아둘빠 책방 — 아들 둘 아빠가 시작한 우리 아이 이야기');
    brands.forEach((brand)=>{
      brand.replaceChildren(logo.cloneNode(true));
      brand.setAttribute('aria-label','아둘빠 책방 홈');
    });
  }catch(error){
    console.error('Logo load failed',error);
  }
}

async function restoreRubiyaCover(){
  try{
    const cover=await loadInlineSvg('assets/sample-book-rubiya-cover.svg?v=15','rubiya-cover-svg','루비야, 동화 속으로 데려다줘 책 표지');
    const homeCover=document.querySelector('.book-cover');
    if(homeCover){
      const homeImage=cover.cloneNode(true);
      homeImage.classList.add('book-cover','real-book-cover');
      homeCover.replaceWith(homeImage);
    }
    const storyCover=document.querySelector('.case .case-art');
    if(storyCover){
      storyCover.classList.add('story-cover-art');
      const storyImage=cover.cloneNode(true);
      storyImage.classList.add('story-cover-image');
      storyCover.replaceChildren(storyImage);
    }
  }catch(error){
    console.error('Rubiya cover load failed',error);
  }
}

restoreBrand();
restoreRubiyaCover();

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
