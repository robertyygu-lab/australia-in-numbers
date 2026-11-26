// Australia in Numbers — view helpers shared by the page renderer.

export function statCard(value, label, note) {
  return `<div class="stat"><div class="stat-value">${value}</div><div class="stat-label">${label}</div>${note ? `<div class="stat-note">${note}</div>` : ""}</div>`;
}

export function sectionHeading(number, title) {
  return `<h2><span class="section-number">${number}</span> ${title}</h2>`;
}

export function hint(text) {
  return `<p class="hint">${text}</p>`;
}
