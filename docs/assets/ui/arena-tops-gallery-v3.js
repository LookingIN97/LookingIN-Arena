(() => {
  'use strict';
  const controls = document.querySelector('[data-tops-controls]');
  const list = document.querySelector('.ranking-list[data-ranking-layout="tops-browser"]');
  if (!controls || !list) return;

  const rows = Array.from(list.querySelectorAll(':scope > .ranking-row'));
  const groups = Object.fromEntries(['scope', 'hero', 'day'].map(name => [
    name, controls.querySelector(`[data-filter-group="${name}"]`),
  ]));
  const reset = controls.querySelector('[data-filter-reset]');
  const count = controls.querySelector('[data-visible-count]');
  const empty = controls.querySelector('[data-filter-empty]');
  const copyStatus = controls.querySelector('[data-copy-status]');
  if (!groups.scope || !groups.hero || !groups.day || !reset || !count || !empty || !copyStatus || rows.length === 0) return;

  const data = rows.map(row => ({
    row,
    rank: Number(row.dataset.rank),
    hero: row.dataset.hero || '',
    day: row.dataset.day || '',
    scopes: new Set((row.dataset.scopes || '').split(' ').filter(Boolean)),
    share: row.querySelector('.share-value')?.textContent || '',
  }));
  const heroes = Array.from(new Set(data.map(value => value.hero).filter(Boolean)));
  const days = Array.from(new Set(data.map(value => value.day).filter(Boolean)))
    .sort((left, right) => Number(left) - Number(right));
  const state = { scope: 'all', hero: 'all', day: 'all' };

  function choice(label, value, groupName) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.dataset.filterValue = value;
    button.setAttribute('aria-pressed', state[groupName] === value ? 'true' : 'false');
    button.addEventListener('click', () => {
      state[groupName] = value;
      updatePressed(groupName);
      render(true);
    });
    return button;
  }

  function updatePressed(groupName) {
    groups[groupName].querySelectorAll('button').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.filterValue === state[groupName] || button.dataset.scope === state[groupName])));
  }

  function restoreQuery() {
    const query = new URLSearchParams(location.search);
    const scope = query.get('scope');
    const hero = query.get('hero');
    const day = query.get('day');
    if (['overall', 'hero', 'day'].includes(scope)) state.scope = scope;
    if (hero && heroes.includes(hero)) state.hero = hero;
    if (day && days.includes(day)) state.day = day;
  }

  function syncQuery() {
    if (location.protocol === 'file:') return;
    const query = new URLSearchParams();
    if (state.scope !== 'all') query.set('scope', state.scope);
    if (state.hero !== 'all') query.set('hero', state.hero);
    if (state.day !== 'all') query.set('day', state.day);
    const next = `${location.pathname}${query.size ? `?${query}` : ''}${location.hash}`;
    history.replaceState(null, '', next);
  }

  function render(updateUrl) {
    let visible = 0;
    for (const value of data) {
      const show = (state.scope === 'all' || value.scopes.has(state.scope)) &&
        (state.hero === 'all' || value.hero === state.hero) &&
        (state.day === 'all' || value.day === state.day);
      value.row.hidden = !show;
      if (show) visible += 1;
    }
    count.textContent = String(visible);
    empty.hidden = visible !== 0;
    if (updateUrl) syncQuery();
  }

  async function copyShare(button, share, rank) {
    let copied = false;
    try {
      await navigator.clipboard.writeText(share);
      copied = true;
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = share;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      copied = document.execCommand('copy');
      textarea.remove();
    }
    copyStatus.textContent = copied ? `已复制原始总排名第 ${rank} 名的分享字符串。` : '复制失败，请选中该行中的分享字符串后手工复制。';
    button.dataset.copied = String(copied);
    const label = button.querySelector('[data-copy-label]');
    if (label) label.textContent = copied ? '已复制分享字符串' : '复制失败，请手工复制该行字符串';
    window.setTimeout(() => {
      button.dataset.copied = 'false';
      if (label) label.textContent = '复制分享字符串';
    }, 1600);
  }

  groups.scope.querySelectorAll('[data-scope]').forEach(button => {
    button.dataset.filterValue = button.dataset.scope;
    button.addEventListener('click', () => {
      state.scope = button.dataset.scope;
      updatePressed('scope');
      render(true);
    });
  });
  groups.hero.append(choice('全部角色', 'all', 'hero'));
  heroes.forEach(hero => groups.hero.append(choice(hero, hero, 'hero')));
  groups.day.append(choice('全部 Day', 'all', 'day'));
  days.forEach(day => groups.day.append(choice(`Day ${day}`, day, 'day')));
  restoreQuery();
  ['scope', 'hero', 'day'].forEach(updatePressed);

  list.addEventListener('click', event => {
    const button = event.target.closest('[data-copy-share]');
    if (!button) return;
    const row = button.closest('.ranking-row');
    const value = data.find(item => item.row === row);
    if (value) copyShare(button, value.share, value.rank);
  });
  reset.addEventListener('click', () => {
    state.scope = state.hero = state.day = 'all';
    ['scope', 'hero', 'day'].forEach(updatePressed);
    render(true);
  });

  controls.hidden = false;
  render(false);
})();
