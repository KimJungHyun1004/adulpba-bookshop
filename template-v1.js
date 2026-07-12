(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const form = $('templateForm');
  const viewer = $('bookSpread');
  const dots = $('spreadDots');
  const allPagesGrid = $('allPagesGrid');
  const allPagesSection = $('allPagesSection');
  const printBook = $('printBook');
  const previewLabel = $('previewLabel');
  const previewCounter = $('previewCounter');
  const prevButton = $('prevSpread');
  const nextButton = $('nextSpread');
  const messageCount = $('messageCount');

  let spreadIndex = 0;
  let pages = [];

  const defaults = {
    childName: '다훈',
    birthdayText: '일곱 번째',
    worldTheme: 'space',
    gift: 'car',
    waiting: '엄마와 아빠',
    hair: 'bowl',
    skin: 'warm',
    shirt: 'blue',
    glasses: false,
    sender: '엄마와 아빠',
    message: '언제나 씩씩하고 다정한 다훈이로 자라렴. 사랑해!'
  };

  const worldLabels = {
    dino: '공룡들이 뛰어노는 초록 협곡',
    car: '자동차가 쌩쌩 달리는 반짝 도시',
    space: '별과 행성이 떠다니는 우주 정거장'
  };

  const giftLabels = {
    dinosaur: '공룡 장난감',
    car: '멋진 기차와 자동차',
    rocket: '우주선 장난감',
    animal: '포근한 동물 인형',
    block: '알록달록 블록 성',
    wand: '반짝이는 마법 지팡이'
  };

  const skinColors = {
    light: '#f7caa4',
    warm: '#eab180',
    deep: '#a86f4e'
  };

  const shirtColors = {
    blue: '#6eb7d5',
    yellow: '#efbd43',
    green: '#70b68b',
    pink: '#e992a7'
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[char]));
  }

  function getState() {
    return {
      childName: $('childName').value.trim() || '아이',
      birthdayText: $('birthdayText').value,
      worldTheme: $('worldTheme').value,
      gift: $('gift').value,
      waiting: $('waiting').value,
      hair: $('hair').value,
      skin: $('skin').value,
      shirt: $('shirt').value,
      glasses: $('glasses').checked,
      sender: $('sender').value.trim() || '사랑하는 가족',
      message: $('message').value.trim() || '언제나 너답게 반짝이길 바라. 사랑해!'
    };
  }

  function saveState(state) {
    try { localStorage.setItem('adulpbaBirthdayTemplateV1', JSON.stringify(state)); } catch (_) {}
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('adulpbaBirthdayTemplateV1') || 'null');
      return saved && typeof saved === 'object' ? { ...defaults, ...saved } : defaults;
    } catch (_) {
      return defaults;
    }
  }

  function applyState(state) {
    Object.entries(state).forEach(([key, value]) => {
      const el = $(key);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = Boolean(value);
      else el.value = value;
    });
    updateMessageCount();
  }

  function avatar(state, pose = '', position = 'avatar-pos-center') {
    return `<div class="avatar hair-${escapeHtml(state.hair)} ${state.glasses ? 'has-glasses' : ''} ${pose} ${position}" style="--skin:${skinColors[state.skin]};--shirt:${shirtColors[state.shirt]}">
      <span class="hair"></span><span class="head"></span><span class="eyes"></span><span class="smile"></span><span class="glasses"></span>
      <span class="body"></span><span class="arm a1"></span><span class="arm a2"></span><span class="leg l1"></span><span class="leg l2"></span>
    </div>`;
  }

  function worldArt(theme) {
    if (theme === 'dino') return `<div class="page-art scene-dino"><div class="art-ground"></div><div class="theme-icon">🦕</div><div class="rabbit-emoji">🐰</div><div class="balloon">🎈</div></div>`;
    if (theme === 'car') return `<div class="page-art scene-car"><div class="theme-icon">🏎️</div><div class="rabbit-emoji">🐰</div><div class="balloon">🎈</div></div>`;
    return `<div class="page-art scene-space"><div class="art-stars"></div><div class="theme-icon">🚀</div><div class="rabbit-emoji">🐰</div><div class="balloon">🎈</div></div>`;
  }

  function page(number, title, text, art, quote = '', extraClass = '') {
    return {
      number,
      title,
      text,
      quote,
      extraClass,
      html: `<article class="book-page-card ${extraClass}"><div class="book-page-inner">${art}<div class="page-copy"><h3>${title}</h3><p>${text}</p>${quote ? `<span class="quote">${quote}</span>` : ''}</div></div>${number ? `<span class="book-page-number">${number}</span>` : ''}</article>`
    };
  }

  function buildPages(state) {
    const name = escapeHtml(state.childName);
    const birthday = escapeHtml(state.birthdayText);
    const waiting = escapeHtml(state.waiting);
    const sender = escapeHtml(state.sender);
    const message = escapeHtml(state.message);
    const world = escapeHtml(worldLabels[state.worldTheme]);
    const gift = escapeHtml(giftLabels[state.gift]);

    const cover = {
      number: '', title: `${name}에게 도착한 생일열차`, text: '', extraClass: 'cover',
      html: `<article class="book-page-card cover"><div class="cover-layout"><span class="cover-kicker">아둘빠 책방 기본형 1호</span><h2>${name}에게 도착한<br>생일열차</h2><p>${birthday} 생일에 떠나는 반짝이는 여행</p><div class="cover-scene"><span class="star-spark s1">✦</span><span class="star-spark s2">✧</span><span class="star-spark s3">✦</span><span class="cover-train">🚂</span><span class="cover-animals">🐰🐻🦊</span>${avatar(state, 'pose-wave', 'cover-avatar')}</div></div></article>`
    };

    return [
      cover,
      page(1, `${name}에게 도착한 생일열차`, `${birthday} 생일에 떠난 반짝이는 여행`, `<div class="page-art scene-night"><div class="art-moon"></div><div class="art-stars"></div><div class="ending-train">🚂</div></div>`, '이 책의 주인공은 바로, ' + name, 'light-watermark'),
      page(2, '아주 특별한 아침', `오늘은 ${name}의 ${birthday} 생일이에요. 눈을 뜬 ${name}은 두근두근 창밖을 바라보았어요.`, `<div class="page-art scene-sky"><div class="art-ground"></div><div class="art-house"></div><div class="art-window"></div>${avatar(state, '', 'avatar-pos-right')}</div>`),
      page(3, '반짝이는 봉투', `그런데 창문 아래에 반짝이는 봉투 하나가 놓여 있었어요. 봉투에는 ${name}에게라고 적혀 있었지요.`, `<div class="page-art scene-warm"><div class="art-envelope"><span>${name}에게</span></div></div>`, '이건 누구에게 온 편지일까요?', 'light-watermark'),
      page(4, '황금빛 승차권', '봉투 안에는 세상에 하나뿐인 황금빛 열차표가 들어 있었어요.', `<div class="page-art scene-warm"><div class="art-ticket"><b>생일열차 특별 승차권</b><small>승객: ${name}<br>목적지: 별빛 생일역</small></div></div>`, '', 'light-watermark'),
      page(5, '생일열차 도착', '그때 창밖에서 소리가 들렸어요. 별빛을 가르며 알록달록한 생일열차가 달려왔어요.', `<div class="page-art scene-sky"><div class="train-css"><span class="engine"></span><span class="carriage c1"></span><span class="carriage c2"></span><span class="wheel w1"></span><span class="wheel w2"></span><span class="wheel w3"></span><span class="wheel w4"></span><span class="track"></span></div></div>`, '칙칙폭폭! 칙칙폭폭!'),
      page(6, '별콩 차장의 인사', `열차 문이 열리자 별 모자를 쓴 별콩 차장이 인사했어요. “안녕, ${name}!”`, `<div class="page-art scene-space"><div class="star-hat"></div><div class="conductor-star"></div>${avatar(state, 'pose-wave', 'avatar-pos-right')}</div>`, '별빛 생일역으로 함께 떠나자!'),
      page(7, '세 가지 생일빛', '별빛 생일역의 문을 열려면 웃음빛, 다정빛, 용기빛이 모두 필요했어요.', `<div class="page-art scene-warm"><div class="light-jars"><div class="light-jar laugh"><span>웃음빛</span></div><div class="light-jar kind"><span>다정빛</span></div><div class="light-jar courage"><span>용기빛</span></div></div></div>`, '세 가지 빛을 모두 찾아보자!', 'light-watermark'),
      page(8, '첫 번째 역', `첫 번째 역의 문이 열렸어요. 그곳은 ${name}이 가장 좋아하는 ${world}이었어요.`, worldArt(state.worldTheme)),
      page(9, '웃음빛', `포롱이 풍선 속으로 쏙 들어가자 ${name}과 포롱은 한참을 깔깔 웃었어요.`, `${worldArt(state.worldTheme).replace('</div>', `${avatar(state, 'pose-cheer', 'avatar-pos-left')}</div>`)}`, `반짝, ${name}의 마음에서 웃음빛이 피어났어요.`),
      page(10, '별빛 터널', '다시 출발한 열차가 깊은 별빛 터널로 들어선 순간, 갑자기 덜컹하고 멈춰버렸어요.', `<div class="page-art scene-night"><div class="tunnel"></div><div class="train-css" style="transform:scale(.67);transform-origin:bottom left"><span class="engine"></span><span class="carriage c1"></span><span class="carriage c2"></span><span class="wheel w1"></span><span class="wheel w2"></span><span class="wheel w3"></span><span class="wheel w4"></span><span class="track"></span></div></div>`, '덜컹!'),
      page(11, '길을 잃은 몽글', '어두운 터널 한쪽에서는 길을 잃은 몽글이 훌쩍이고 있었어요.', `<div class="page-art scene-night"><div class="tunnel"></div><div class="bear-emoji">🐻</div><div class="tear">💧</div>${avatar(state, '', 'avatar-pos-right')}</div>`, '집으로 가는 길을 모르겠어…'),
      page(12, '다정한 손', `${name}은 몽글에게 손을 내밀었어요. “괜찮아. 같이 길을 찾아보자.”`, `<div class="page-art scene-warm"><div class="kind-glow"></div><div class="bear-emoji">🐻</div>${avatar(state, '', 'avatar-pos-right')}</div>`),
      page(13, '다정빛', '두 손이 맞닿자 따뜻한 빛이 두 번째 유리병으로 날아들었어요.', `<div class="page-art scene-warm"><div class="light-jars"><div class="light-jar kind"><span>다정빛</span></div></div></div>`, `반짝, ${name}의 마음에서 다정빛이 피어났어요.`, 'light-watermark'),
      page(14, '높은 별빛 스위치', '하지만 열차는 아직 움직이지 않았어요. 터널 높은 곳의 별빛 스위치를 눌러야 했거든요.', `<div class="page-art scene-night"><div class="ladder"></div><div class="switch"></div><div class="fox-emoji">🦊</div>${avatar(state, '', 'avatar-pos-left')}</div>`),
      page(15, '한 걸음씩', `조금 무서웠지만 해루가 힘차게 응원했어요. “${name}, 천천히 한 걸음씩 올라가면 돼!”`, `<div class="page-art scene-night"><div class="ladder"></div><div class="switch"></div><div class="fox-emoji">🦊</div>${avatar(state, 'pose-climb', 'avatar-pos-right')}</div>`, '무서워도 한 걸음씩.'),
      page(16, '용기의 순간', `${name}은 마지막 계단에 올라 힘껏 별빛 스위치를 눌렀어요.`, `<div class="page-art scene-night"><div class="ladder"></div><div class="switch"></div>${avatar(state, 'pose-climb', 'avatar-pos-right')}</div>`, '딸깍!'),
      page(17, '용기빛', '터널의 별들이 한꺼번에 켜지고 마지막 유리병도 눈부시게 빛났어요.', `<div class="page-art scene-space"><div class="light-burst"></div><div class="light-jars"><div class="light-jar courage"><span>용기빛</span></div></div></div>`, `반짝, ${name}의 마음에서 용기빛이 피어났어요.`),
      page(18, '세 빛이 하나로', '웃음빛, 다정빛, 용기빛이 하나가 되자 별빛 생일역의 문이 활짝 열렸어요.', `<div class="page-art scene-space"><div class="light-burst"></div>${avatar(state, 'pose-cheer', 'avatar-pos-center')}</div>`, '반짝, 반짝, 반짝!'),
      page(19, '별빛 생일역', '생일열차가 반짝이는 역에 멈췄어요. 문이 열리자 포롱과 몽글, 해루가 먼저 달려 나갔어요.', `<div class="page-art scene-station"><div class="station-sign">별빛 생일역</div><div class="station-platform"></div><div class="station-balloons">🎈🎈</div><div class="animal-line">🐰🐻🦊</div></div>`),
      page(20, '기다리고 있던 사람들', `별빛 생일역에는 ${waiting}도 기다리고 있었어요. 모두의 얼굴에 환한 웃음이 피어났지요.`, `<div class="page-art scene-station"><div class="station-platform"></div><div class="family-silhouette"><span class="family-person"></span><span class="family-person"></span><span class="family-person small"></span></div></div>`),
      page(21, '생일 축하해!', `포롱과 몽글, 해루는 풍선을 흔들고 별콩 차장은 작은 종을 울렸어요. 케이크 옆에는 ${gift}도 놓여 있었지요.`, `<div class="page-art scene-warm"><div class="gift-box">🎁</div><div class="cake"></div><div class="animal-line">🐰🐻🦊</div></div>`, `${name}, 생일 축하해!`),
      page(22, '마음속의 세 가지 빛', `별콩 차장은 ${name}에게 별 모양 배지를 달아주며 말했어요.`, `<div class="page-art scene-space"><div class="conductor-star" style="transform:translate(-70%,-50%) scale(.72)"></div>${avatar(state, '', 'avatar-pos-right')}</div>`, `웃음과 다정함, 용기는 처음부터 ${name}의 마음속에 있었어.`),
      page(23, `${sender}의 메시지`, '', `<div class="page-art scene-warm"><div class="message-card"><b>${sender}이 전하는 말</b><p>${message}</p></div></div>`, '', 'light-watermark'),
      page(24, '언제나 특별한 주인공', `오늘도, 내일도, 앞으로 펼쳐질 모든 날에도 ${name}은 언제나 자기 이야기의 특별한 주인공이랍니다.`, `<div class="page-art scene-night"><div class="art-moon"></div><div class="art-stars"></div><div class="ending-track"></div><div class="ending-train">🚂</div>${avatar(state, 'pose-wave', 'avatar-pos-right')}</div>`, '생일을 진심으로 축하해!')
    ];
  }

  function spreadsFromPages(bookPages) {
    const spreads = [[bookPages[0]]];
    for (let index = 1; index < bookPages.length; index += 2) {
      spreads.push(bookPages.slice(index, index + 2));
    }
    return spreads;
  }

  function renderCurrent() {
    const spreads = spreadsFromPages(pages);
    spreadIndex = Math.max(0, Math.min(spreadIndex, spreads.length - 1));
    const current = spreads[spreadIndex];
    viewer.classList.toggle('single', current.length === 1);
    viewer.innerHTML = current.map((item, idx) => item.html.replace('book-page-card ', `book-page-card ${idx === 0 ? 'left ' : 'right '}`)).join('');

    previewLabel.textContent = spreadIndex === 0 ? '표지' : `${current[0].number}${current[1] ? `–${current[1].number}` : ''}페이지`;
    previewCounter.textContent = `장면 ${spreadIndex + 1} / ${spreads.length}`;
    prevButton.disabled = spreadIndex === 0;
    nextButton.disabled = spreadIndex === spreads.length - 1;

    dots.innerHTML = spreads.map((_, idx) => `<button type="button" data-index="${idx}" class="${idx === spreadIndex ? 'active' : ''}">${idx === 0 ? '표지' : idx}</button>`).join('');
    dots.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
      spreadIndex = Number(button.dataset.index);
      renderCurrent();
    }));
  }

  function renderAllPages() {
    allPagesGrid.innerHTML = pages.map((item, index) => `${index === 0 ? '<div class="page-label">표지</div>' : ''}<div>${item.html}</div>`).join('');
    printBook.innerHTML = pages.map((item) => `<section class="print-page">${item.html}</section>`).join('');
  }

  function rebuild(resetSpread = false) {
    const state = getState();
    saveState(state);
    pages = buildPages(state);
    if (resetSpread) spreadIndex = 0;
    renderCurrent();
    renderAllPages();
    updateMessageCount();
  }

  function updateMessageCount() {
    const length = $('message').value.length;
    messageCount.textContent = `${length}/60`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    rebuild(true);
    $('bookViewer').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  form.addEventListener('input', () => rebuild(false));
  form.addEventListener('change', () => rebuild(false));
  $('message').addEventListener('input', updateMessageCount);

  prevButton.addEventListener('click', () => { spreadIndex -= 1; renderCurrent(); });
  nextButton.addEventListener('click', () => { spreadIndex += 1; renderCurrent(); });

  $('resetTemplate').addEventListener('click', () => {
    try { localStorage.removeItem('adulpbaBirthdayTemplateV1'); } catch (_) {}
    applyState(defaults);
    rebuild(true);
  });

  $('toggleAllPages').addEventListener('click', () => {
    const isHidden = allPagesSection.hasAttribute('hidden');
    if (isHidden) {
      allPagesSection.removeAttribute('hidden');
      $('toggleAllPages').textContent = '전체 페이지 접기';
      allPagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      allPagesSection.setAttribute('hidden', '');
      $('toggleAllPages').textContent = '전체 24페이지 펼쳐보기';
    }
  });

  $('printTemplate').addEventListener('click', () => {
    renderAllPages();
    window.setTimeout(() => window.print(), 100);
  });

  document.addEventListener('keydown', (event) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (event.key === 'ArrowLeft' && !prevButton.disabled) { spreadIndex -= 1; renderCurrent(); }
    if (event.key === 'ArrowRight' && !nextButton.disabled) { spreadIndex += 1; renderCurrent(); }
  });

  applyState(loadState());
  rebuild(true);
})();
