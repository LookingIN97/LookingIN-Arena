(() => {
  'use strict';
  const panel = document.querySelector('[data-arena-filters]');
  const list = document.querySelector('.ranking-list[data-ranking-layout="build-gallery"]');
  if (!panel || !list) return;

  const rows = Array.from(list.querySelectorAll(':scope > .ranking-row'));
  const heroGroup = panel.querySelector('[data-filter-group="hero"]');
  const dayGroup = panel.querySelector('[data-filter-group="day"]');
  const reset = panel.querySelector('[data-filter-reset]');
  const count = panel.querySelector('[data-visible-count]');
  const empty = panel.querySelector('[data-filter-empty]');
  if (!heroGroup || !dayGroup || !reset || !count || !empty || rows.length === 0) return;

  const rowData = rows.map(row => {
    const hero = row.dataset.hero || row.querySelector('.build-hero')?.textContent?.trim() || '';
    const dayText = row.dataset.day || row.querySelector('.build-day')?.textContent || '';
    const match = String(dayText).match(new RegExp('[0-9]+'));
    const day = match ? match[0] : '';
    return { row, hero, day };
  });
  const heroes = Array.from(new Set(rowData.map(value => value.hero).filter(Boolean)));
  const days = Array.from(new Set(rowData.map(value => value.day).filter(Boolean)))
    .sort((left, right) => Number(left) - Number(right));
  const selectedHeroes = new Set(heroes);
  const selectedDays = new Set(days);

  function toggleButton(label, value, selected, onToggle) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'arena-filter-toggle';
    button.textContent = label;
    button.dataset.filterValue = value;
    button.setAttribute('aria-pressed', selected.has(value) ? 'true' : 'false');
    button.addEventListener('click', () => {
      if (selected.has(value)) selected.delete(value);
      else selected.add(value);
      button.setAttribute('aria-pressed', selected.has(value) ? 'true' : 'false');
      onToggle();
    });
    return button;
  }

  function render() {
    let visible = 0;
    for (const value of rowData) {
      const show = selectedHeroes.has(value.hero) && selectedDays.has(value.day);
      value.row.hidden = !show;
      if (show) visible += 1;
    }
    count.textContent = String(visible);
    empty.hidden = visible !== 0;
  }

  for (const hero of heroes)
    heroGroup.append(toggleButton(hero, hero, selectedHeroes, render));
  for (const day of days)
    dayGroup.append(toggleButton(`Day ${day}`, day, selectedDays, render));
  reset.addEventListener('click', () => {
    heroes.forEach(value => selectedHeroes.add(value));
    days.forEach(value => selectedDays.add(value));
    panel.querySelectorAll('.arena-filter-toggle').forEach(button =>
      button.setAttribute('aria-pressed', 'true'));
    render();
  });

  panel.hidden = false;
  render();
})();
