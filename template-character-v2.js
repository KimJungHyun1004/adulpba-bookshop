(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const stage = $('characterLiveStage');
  const summary = $('characterSummary');
  const selectionSummary = $('selectionSummary');
  const teaserTitle = $('teaserTitle');
  const teaserSubtitle = $('teaserSubtitle');
  if (!stage || !summary) return;

  const skinColors = { light:'#f7caa4', warm:'#eab180', deep:'#a86f4e' };
  const shirtColors = { blue:'#6eb7d5', yellow:'#efbd43', green:'#70b68b', pink:'#e992a7' };
  const labels = {
    hair:{short:'짧은 머리',bowl:'동그란 머리',wave:'웨이브 머리'},
    skin:{light:'밝은 피부톤',warm:'따뜻한 피부톤',deep:'짙은 피부톤'},
    shirt:{blue:'하늘색 옷',yellow:'노란색 옷',green:'초록색 옷',pink:'분홍색 옷'},
    world:{dino:'공룡 협곡',car:'자동차 도시',space:'우주 정거장'},
    gift:{dinosaur:'공룡 장난감',car:'기차와 자동차',rocket:'우주선 장난감',animal:'동물 인형',block:'블록 성',wand:'마법 지팡이'}
  };

  function safe(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

  function render(){
    const name = $('childName')?.value.trim() || '아이';
    const birthday = $('birthdayText')?.value || '특별한';
    const hair = $('hair')?.value || 'bowl';
    const skin = $('skin')?.value || 'warm';
    const shirt = $('shirt')?.value || 'blue';
    const world = $('worldTheme')?.value || 'space';
    const gift = $('gift')?.value || 'car';
    const waiting = $('waiting')?.value || '가족';
    const sender = $('sender')?.value.trim() || '사랑하는 가족';
    const glasses = Boolean($('glasses')?.checked);

    stage.innerHTML = `<div class="avatar hair-${safe(hair)} ${glasses?'has-glasses':''} pose-wave" style="--skin:${skinColors[skin]};--shirt:${shirtColors[shirt]}"><span class="hair"></span><span class="head"></span><span class="eyes"></span><span class="smile"></span><span class="glasses"></span><span class="body"></span><span class="arm a1"></span><span class="arm a2"></span><span class="leg l1"></span><span class="leg l2"></span></div><div class="character-live-name">${safe(name)} 캐릭터 미리보기</div>`;
    summary.innerHTML = `<span>${labels.hair[hair]}</span><span>${labels.skin[skin]}</span><span>${labels.shirt[shirt]}</span><span>${glasses?'안경 있음':'안경 없음'}</span>`;

    if (teaserTitle) teaserTitle.innerHTML = `${safe(name)}에게 도착한<br>생일열차`;
    if (teaserSubtitle) teaserSubtitle.textContent = `${birthday} 생일에 떠나는 반짝이는 여행`;

    if (selectionSummary) {
      selectionSummary.innerHTML = `
        <div><b>책 제목</b><span>${safe(name)}에게 도착한 생일열차</span></div>
        <div><b>생일·테마</b><span>${safe(birthday)} · ${labels.world[world]}</span></div>
        <div><b>캐릭터</b><span>${labels.hair[hair]} · ${labels.shirt[shirt]} · ${glasses?'안경 있음':'안경 없음'}</span></div>
        <div><b>마지막 장면</b><span>${safe(waiting)} · ${labels.gift[gift]} · ${safe(sender)}</span></div>`;
    }
  }

  ['childName','birthdayText','worldTheme','gift','waiting','hair','skin','shirt','glasses','sender','message'].forEach(id=>{
    $(id)?.addEventListener('input',render);
    $(id)?.addEventListener('change',render);
  });
  $('resetTemplate')?.addEventListener('click',()=>setTimeout(render,0));
  render();
})();
