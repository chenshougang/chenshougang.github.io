// 主题切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 设置页脚年份
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // 检查本地存储中的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.setAttribute('data-theme', savedTheme);
        } else {
            // 默认使用浅色主题
            document.body.setAttribute('data-theme', 'light');
        }

        // 切换主题
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
});

// 工具函数
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
    
    const hasCover = post.cover && post.cover.trim() !== '';
    
    let html = '';
    if (hasCover) {
        html += `<div class="post-card-image" style="background-image: url('${post.cover}')"></div>`;
    }
    
    html += `
        <div class="post-card-content">
            <h2 class="post-card-title">
                <a href="${window.location.pathname.includes('/pages/') ? '' : 'pages/'}article.html?id=${post.id}">${post.title}</a>
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