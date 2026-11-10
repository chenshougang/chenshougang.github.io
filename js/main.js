/**
 * 主脚本
 * 功能：主题切换、文章卡片渲染、阅读进度、回到顶部、搜索
 */

// 全局筛选状态（供文章列表页使用）
let activeFilter = 'all';
let searchQuery = '';

/* ============ 工具函数 ============ */

/**
 * 转义 HTML，避免文章数据中的特殊字符破坏结构
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * 格式化日期
 * @param {string} dateString - 如 "2024-01-15"
 * @returns {string} - 如 "2024年1月15日"
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * 从文章数组中获取所有唯一标签
 * @param {Array} posts
 * @returns {Array}
 */
function getAllTags(posts) {
    const tags = new Set();
    posts.forEach(post => {
        (post.tags || []).forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
}

/**
 * 创建文章卡片
 * @param {Object} post
 * @returns {HTMLElement}
 */
function createPostCard(post) {
    const postCard = document.createElement('article');
    postCard.className = 'post-card';
    postCard.dataset.id = post.id;

    const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const tags = Array.isArray(post.tags) ? post.tags : [];
    const primaryTag = tags[0] || 'NOTE';
    const hasCover = typeof post.cover === 'string' && post.cover.trim() !== '';
    const linkKey = post.slug || post.id;

    const visualStyle = hasCover
        ? ` style="background-image: url('${escapeHtml(post.cover)}')"`
        : '';

    postCard.innerHTML = `
        <div class="${hasCover ? 'post-card-image' : 'post-card-visual'}"${visualStyle}>
            <span class="post-card-idx">POST_${String(post.id).padStart(2, '0')}</span>
            <span class="post-card-visual-tag">${escapeHtml(primaryTag)}</span>
        </div>
        <div class="post-card-content">
            <h2 class="post-card-title">
                <a href="${pathPrefix}article.html?post=${encodeURIComponent(linkKey)}">${escapeHtml(post.title)}</a>
            </h2>
            <p class="post-card-excerpt">${escapeHtml(post.excerpt)}</p>
            <div class="post-card-meta">
                <span class="post-card-date">
                    <i class="fas fa-calendar-alt"></i> ${escapeHtml(formatDate(post.date))}
                </span>
            </div>
            <div class="post-tags">
                ${tags.map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        </div>
    `;

    return postCard;
}

/* ============ 主题 ============ */

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute('content', theme === 'light' ? '#f4f7fb' : '#05070d');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ============ 阅读进度 ============ */

function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
}

function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
}

/* ============ 回到顶部 ============ */

function initBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.id = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
}

function toggleBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    button.classList.toggle('visible', window.scrollY > 300);
}

/* ============ 搜索 ============ */

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        filterPosts();
    });
}

/* ============ 占位（具体实现见 articles.js） ============ */

function initFilter() {
    // 文章列表页会覆盖此函数
}

function filterPosts() {
    // 文章列表页会覆盖此函数
}

/* ============ 初始化 ============ */

document.addEventListener('DOMContentLoaded', function () {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    initTheme();

    if (window.marked) {
        marked.setOptions({
            breaks: true,
            gfm: true
        });
    }

    initReadingProgress();
    initBackToTop();
    initSearch();
    initFilter();
});
