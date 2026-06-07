// AgentAtlas — 前端逻辑（零依赖）

const DATA_URL = './data/agents.json';
let allAgents = [];
let filters = { search: '', category: 'all', origin: 'all', lang: 'all' };

// 工具函数
function escapeHtml(s) {
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function formatStars(n) {
  if (n == null) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function getOriginLabel(origin) {
  return origin === 'china' ? '🇨🇳 国内' : '🌍 国际';
}

// 加载数据
async function loadData() {
  const res = await fetch(DATA_URL);
  const data = await res.json();
  allAgents = data.agents;
  return data;
}

// 过滤
function applyFilters() {
  const q = filters.search.toLowerCase().trim();
  return allAgents.filter(a => {
    if (filters.category !== 'all' && a.category !== filters.category) return false;
    if (filters.origin !== 'all' && a.origin !== filters.origin) return false;
    if (filters.lang !== 'all' && a.language !== filters.lang) return false;
    if (q) {
      const blob = (a.name + ' ' + a.tagline + ' ' + a.description + ' ' + (a.tags || []).join(' ')).toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}

// 首页渲染
function renderIndex() {
  const grid = document.getElementById('agents-grid');
  const stat = document.getElementById('stat-count');
  if (!grid) return;

  const filtered = applyFilters();
  if (stat) stat.textContent = filtered.length;

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty">没找到匹配的 agent。试试别的关键词？</div>';
    return;
  }

  // 排序:featured 优先 + star 数降序
  filtered.sort((a, b) => {
    if (a.featured !== b.featured) return b.featured ? 1 : -1;
    return (b.stars || 0) - (a.stars || 0);
  });

  grid.innerHTML = filtered.map(a => `
    <a class="agent-card" href="./agent.html?id=${a.id}">
      <div class="agent-header">
        <div class="agent-emoji">${escapeHtml(a.emoji)}</div>
        <div style="flex:1; min-width:0;">
          <div class="agent-name">
            ${escapeHtml(a.name)}
            ${a.featured ? '<span class="badge-featured">Featured</span>' : ''}
          </div>
          <div class="agent-tagline">${escapeHtml(a.tagline)}</div>
        </div>
      </div>
      <div class="agent-meta">
        <span class="tag cat">${escapeHtml(a.category)}</span>
        <span class="tag lang">${escapeHtml(a.language)}</span>
        <span class="tag ${a.origin === 'china' ? 'origin-cn' : ''}">${getOriginLabel(a.origin)}</span>
        ${(a.tags || []).slice(0, 3).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="agent-stats">
        ${a.stars != null ? `<span>⭐ ${formatStars(a.stars)}</span>` : ''}
        ${a.license ? `<span>📜 ${escapeHtml(a.license)}</span>` : ''}
      </div>
    </a>
  `).join('');
}

// 详情页渲染
function renderDetail() {
  const root = document.getElementById('detail-root');
  if (!root) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const a = allAgents.find(x => x.id === id);

  if (!a) {
    root.innerHTML = '<div class="empty">找不到该 agent。<a href="./index.html">回首页</a></div>';
    return;
  }

  document.title = `${a.name} — AgentAtlas`;

  root.innerHTML = `
    <a class="back-link" href="./index.html">← 返回列表</a>
    <div class="detail-header">
      <div class="detail-emoji">${escapeHtml(a.emoji)}</div>
      <div>
        <h1 class="detail-name">
          ${escapeHtml(a.name)}
          ${a.featured ? '<span class="badge-featured">Featured</span>' : ''}
        </h1>
        <div class="detail-tagline">${escapeHtml(a.tagline)}</div>
      </div>
    </div>

    <div class="detail-section">
      <h2>简介</h2>
      <p>${escapeHtml(a.description)}</p>
    </div>

    <div class="detail-section">
      <h2>标签</h2>
      <ul>${(a.tags || []).map(t => `<li class="tag">${escapeHtml(t)}</li>`).join('')}</ul>
    </div>

    <div class="detail-section">
      <h2>基本信息</h2>
      <dl class="detail-grid">
        <div><dt>分类</dt><dd>${escapeHtml(a.category)}</dd></div>
        <div><dt>主语言</dt><dd>${escapeHtml(a.language)}</dd></div>
        <div><dt>协议</dt><dd>${escapeHtml(a.license || '—')}</dd></div>
        <div><dt>来源</dt><dd>${getOriginLabel(a.origin)}</dd></div>
        <div><dt>GitHub Stars</dt><dd>${a.stars != null ? formatStars(a.stars) : '—'}</dd></div>
        <div><dt>收录时间</dt><dd>${escapeHtml(a.added)}</dd></div>
      </dl>
    </div>

    <div class="detail-section">
      <h2>链接</h2>
      ${a.homepage ? `<a class="detail-link" href="${escapeHtml(a.homepage)}" target="_blank" rel="noopener">🌐 官网</a>` : ''}
      ${a.github ? `<a class="detail-link" href="https://github.com/${escapeHtml(a.github)}" target="_blank" rel="noopener">⭐ GitHub 仓库</a>` : ''}
    </div>
  `;
}

// 绑定过滤栏
function bindFilters() {
  const search = document.getElementById('filter-search');
  const cat = document.getElementById('filter-category');
  const origin = document.getElementById('filter-origin');
  const lang = document.getElementById('filter-language');

  if (search) {
    search.addEventListener('input', e => {
      filters.search = e.target.value;
      renderIndex();
    });
  }
  if (cat) {
    cat.addEventListener('change', e => {
      filters.category = e.target.value;
      renderIndex();
    });
  }
  if (origin) {
    origin.addEventListener('change', e => {
      filters.origin = e.target.value;
      renderIndex();
    });
  }
  if (lang) {
    lang.addEventListener('change', e => {
      filters.lang = e.target.value;
      renderIndex();
    });
  }
}

// 入口
(async function () {
  await loadData();

  // 填充 filter 选框
  const langSel = document.getElementById('filter-language');
  if (langSel) {
    const langs = [...new Set(allAgents.map(a => a.language))].sort();
    langSel.innerHTML = '<option value="all">所有语言</option>' +
      langs.map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`).join('');
  }

  bindFilters();
  renderIndex();
  renderDetail();
})();
