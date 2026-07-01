/* ===========================================================
   ui.js — helpers compartilhados entre páginas
   =========================================================== */

function buildHeader(activePage) {
  const pages = [
    { href: 'index.html',       label: 'Início' },
    { href: 'campeonatos.html', label: 'Campeonatos' },
    { href: 'admin.html',       label: 'Admin' }
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}" class="${activePage === p.href ? 'active' : ''}">${p.label}</a></li>`
  ).join('');
  return `
<header class="site-header">
  <div class="wrap">
    <a href="index.html" class="brand">
      Futsal<span class="dot">·</span>Canguçu
      <small>2026</small>
    </a>
    <nav class="main-nav" aria-label="Principal">
      <ul>${links}</ul>
    </nav>
  </div>
</header>`;
}

function buildFooter() {
  return `
<footer class="site-footer">
  <div class="wrap">
    <span>Futsal Canguçu 2026</span>
    <span>Canguçu · RS</span>
  </div>
</footer>`;
}

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

window.UI = { buildHeader, buildFooter, getParam };