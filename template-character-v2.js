(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const stage = $('characterLiveStage');
  const nameLabel = $('characterLiveName');
  const summary = $('characterSummary');
  if (!stage || !nameLabel || !summary) return;

  const skinColors = { light:'#f7caa4', warm:'#eab180', deep:'#a86f4e' };
  const shirtColors = { blue:'#6eb7d5', yellow:'#efbd43', green:'#70b68b', pink:'#e992a7' };
  const labels = {
    hair:{short:'짧은 머리',bowl:'동그란 머리',wave:'웨이브 머리'},
    skin:{light:'밝은 피부톤',warm:'따뜻한 피부톤',deep:'짙은 피부톤'},
    shirt:{blue:'하늘색 옷',yellow:'노란색 옷',green:'초록색 옷',pink:'분홍색 옷'}
  };

  function safe(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function render(){
    const name = $('childName')?.value.trim() || '아이';
    const hair = $('hair')?.value || 'bowl';
    const skin = $('skin')?.value || 'warm';
    const shirt = $('shirt')?.value || 'blue';
    const glasses = Boolean($('glasses')?.checked);
    stage.innerHTML = `<div class="avatar hair-${safe(hair)} ${glasses?'has-glasses':''} pose-wave" style="--skin:${skinColors[skin]};--shirt:${shirtColors[shirt]}"><span class="hair"></span><span class="head"></span><span class="eyes"></span><span class="smile"></span><span class="glasses"></span><span class="body"></span><span class="arm a1"></span><span class="arm a2"></span><span class="leg l1"></span><span class="leg l2"></span></div><div class="character-live-name" id="characterLiveName">${safe(name)} 캐릭터 미리보기</div>`;
    summary.innerHTML = `<span>${labels.hair[hair]}</span><span>${labels.skin[skin]}</span><span>${labels.shirt[shirt]}</span><span>${glasses?'안경 있음':'안경 없음'}</span>`;
  }
  ['childName','hair','skin','shirt','glasses'].forEach(id=>{
    $(id)?.addEventListener('input',render);
    $(id)?.addEventListener('change',render);
  });
  $('resetTemplate')?.addEventListener('click',()=>setTimeout(render,0));
  render();
})();