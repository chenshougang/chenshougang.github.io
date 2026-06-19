// 全局变量
let activeFilter = 'all';
let searchQuery = '';

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置页脚年份
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        } else {
            document.body.setAttribute('data-theme', 'light');
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 配置Marked和Highlight.js
    if (window.marked) {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
    }

    // 初始化阅读进度条
    initReadingProgress();
    
    // 初始化回到顶部按钮
    initBackToTop();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化标签筛选
    initFilter();
});

// 工具函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 创建文章卡片元素
function createPostCard(post) {
    const postCard = document.createElement('article');
    postCard.className = 'post-card';
    postCard.dataset.id = post.id;
    
    const hasCover = post.cover && post.cover.trim() !== '';
    
    let html = '';
    if (hasCover) {
        html += `<div class="post-card-image" style="background-image: url('${post.cover}')"></div>`;
    }
    
    const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    
    html += `
        <div class="post-card-content">
            <h2 class="post-card-title">
                <a href="${pathPrefix}article.html?id=${post.id}">${post.title}</a>
            </h2>
            <p class="post-card-excerpt">${post.excerpt}</p>
            <div class="post-card-meta">
                <span class="post-card-date"><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
            </div>
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    postCard.innerHTML = html;
    return postCard;
}

// 阅读进度条
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', updateReadingProgress);
}

function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = progress + '%';
}

// 回到顶部按钮
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
    
    window.addEventListener('scroll', toggleBackToTop);
}

function toggleBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    if (window.scrollY > 300) {
        button.classList.add('visible');
    } else {
        button.classList.remove('visible');
    }
}

// 搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterPosts();
    });
}

// 标签筛选功能
function initFilter() {
    // 筛选标签由 articles.js 或 index.html 动态生成
}

// 筛选文章
function filterPosts() {
    // 这个函数会在具体页面中被重写
}

// 获取所有唯一标签
function getAllTags(posts) {
    const tags = new Set();
    posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
}