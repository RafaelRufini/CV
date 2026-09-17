document.getElementById('year').textContent = new Date().getFullYear();

const canvas = document.getElementById('mapCanvas');
const svg = document.getElementById('connectorSvg');
const nodes = document.querySelectorAll('.map-node');

const detailPanel = document.getElementById('detailPanel');
const detailTag = document.getElementById('detailTag');
const detailTitle = document.getElementById('detailTitle');
const detailOrg = document.getElementById('detailOrg');
const detailDesc = document.getElementById('detailDesc');
const detailClose = document.getElementById('detailClose');

const connections = [
  ['ti-apps', 'bridge-ti-gestao'],
  ['bridge-ti-gestao', 'gestao-pos'],
  ['edu-grad', 'ti-eng', 150],
];

function center(el) {
  const dot = el.querySelector('.node-dot');
  if (!dot) {
    return { x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 };
  }
  return {
    x: el.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2,
    y: el.offsetTop + dot.offsetTop + dot.offsetHeight / 2,
  };
}

function drawConnectors() {
  svg.setAttribute('width', canvas.offsetWidth);
  svg.setAttribute('height', canvas.offsetHeight);
  svg.innerHTML = '';

  connections.forEach(([fromId, toId, perp = 0]) => {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    if (!fromEl || !toEl) return;
    const a = center(fromEl);
    const b = center(toEl);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const c1x = a.x + dx * 0.33 + nx * perp;
    const c1y = a.y + dy * 0.33 + ny * perp;
    const c2x = a.x + dx * 0.66 + nx * perp;
    const c2y = a.y + dy * 0.66 + ny * perp;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'connector-path');
    path.setAttribute('d', `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`);
    svg.appendChild(path);
  });
}

function openDetail(node) {
  nodes.forEach((n) => n.classList.remove('is-active'));
  node.classList.add('is-active');

  detailTag.textContent = `${node.dataset.tag} — ${node.dataset.year}`;
  detailTitle.textContent = node.dataset.title;
  detailOrg.textContent = node.dataset.org;
  detailDesc.textContent = node.dataset.desc || '';

  detailPanel.hidden = false;
  detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDetail() {
  detailPanel.hidden = true;
  nodes.forEach((n) => n.classList.remove('is-active'));
}

nodes.forEach((node) => {
  node.addEventListener('click', () => {
    if (node.classList.contains('is-active')) {
      closeDetail();
    } else {
      openDetail(node);
    }
  });
});

detailClose.addEventListener('click', closeDetail);

window.addEventListener('resize', drawConnectors);
window.addEventListener('load', drawConnectors);
drawConnectors();
