/**
 * 主脚本文件
 * 功能：主题切换、阅读进度、回到顶部、工具函数等
 */

// 全局变量：用于搜索和筛选功能
let activeFilter = 'all';  // 当前激活的标签筛选
let searchQuery = '';       // 当前搜索关键词

/**
 * 页面加载完成后的初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 1. 设置页脚的年份（自动更新）
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
        console.log('年份已设置:', new Date().getFullYear());
    }

    // 2. 初始化主题切换功能
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // 从本地存储中读取之前保存的主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            // 如果有保存的主题，使用它
            document.body.setAttribute('data-theme', savedTheme);
            console.log('使用保存的主题:', savedTheme);
        } else {
            // 默认使用浅色主题
            document.body.setAttribute('data-theme', 'light');
            console.log('使用默认主题: light');
        }

        // 为主题切换按钮添加点击事件
        themeToggle.addEventListener('click', function() {
            // 获取当前主题
            const currentTheme = document.body.getAttribute('data-theme');
            // 切换到另一个主题
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            // 应用新主题
            document.body.setAttribute('data-theme', newTheme);
            // 保存到本地存储
            localStorage.setItem('theme', newTheme);
            console.log('主题已切换为:', newTheme);
        });
    }

    // 3. 配置 Marked 库（用于解析 Markdown）
    if (window.marked) {
        marked.setOptions({
            // 代码高亮配置
            highlight: function(code, lang) {
                // 如果指定了语言且该语言有对应的高亮器
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                // 否则自动检测语言
                return hljs.highlightAuto(code).value;
            },
            breaks: true,  // 支持换行符
            gfm: true       // 支持 GitHub 风格的 Markdown
        });
        console.log('Marked 库已配置');
    }

    // 4. 初始化阅读进度条
    initReadingProgress();
    
    // 5. 初始化回到顶部按钮
    initBackToTop();
    
    // 6. 初始化搜索功能
    initSearch();
    
    // 7. 初始化标签筛选（具体功能在 articles.js 中）
    initFilter();
    
    console.log('初始化完成！');
});

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串（如 "2024-01-15"）
 * @returns {string} - 格式化后的日期（如 "2024年1月15日"）
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * 创建文章卡片 HTML 元素
 * @param {Object} post - 文章对象
 * @returns {HTMLElement} - 文章卡片 DOM 元素
 */
function createPostCard(post) {
    // 创建 article 元素作为卡片容器
    const postCard = document.createElement('article');
    postCard.className = 'post-card';
    postCard.dataset.id = post.id;  // 保存文章 ID 到 data 属性
    
    // 判断是否有封面图
    const hasCover = post.cover && post.cover.trim() !== '';
    
    let html = '';
    
    // 如果有封面图，添加封面图部分
    if (hasCover) {
        html += `<div class="post-card-image" style="background-image: url('${post.cover}')"></div>`;
    }
    
    // 生成路径前缀（处理首页和文章列表页的路径差异）
    const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    
    // 拼接卡片内容 HTML
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
    
    // 将 HTML 插入到卡片中
    postCard.innerHTML = html;
    return postCard;
}

/**
 * 初始化阅读进度条
 * 在页面顶部显示当前阅读进度
 */
function initReadingProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.id = 'reading-progress';
    document.body.appendChild(progressBar);
    
    // 监听滚动事件，更新进度条
    window.addEventListener('scroll', updateReadingProgress);
    console.log('阅读进度条已初始化');
}

/**
 * 更新阅读进度条
 */
function updateReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;
    
    // 计算滚动进度（0-100）
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    // 更新进度条宽度
    progressBar.style.width = progress + '%';
}

/**
 * 初始化回到顶部按钮
 */
function initBackToTop() {
    // 创建按钮元素
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.id = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', '回到顶部');
    document.body.appendChild(button);
    
    // 添加点击事件：滚动到顶部
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // 监听滚动事件：显示/隐藏按钮
    window.addEventListener('scroll', toggleBackToTop);
    console.log('回到顶部按钮已初始化');
}

/**
 * 切换回到顶部按钮的显示状态
 */
function toggleBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;
    
    // 如果滚动超过 300px，显示按钮
    if (window.scrollY > 300) {
        button.classList.add('visible');
    } else {
        button.classList.remove('visible');
    }
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    // 监听输入事件，实时搜索
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        console.log('搜索关键词:', searchQuery);
        filterPosts();  // 执行筛选（函数在 articles.js 或 index.html 中定义）
    });
    
    console.log('搜索功能已初始化');
}

/**
 * 初始化标签筛选（基础函数）
 * 具体实现在 articles.js 中
 */
function initFilter() {
    // 这个函数会在 articles.js 中被重写
    console.log('标签筛选已初始化（占位函数）');
}

/**
 * 筛选文章（基础函数）
 * 具体实现在 articles.js 或 index.html 中
 */
function filterPosts() {
    // 这个函数会在具体页面中被重写
    console.log('执行筛选（占位函数）');
}

/**
 * 从文章数组中获取所有唯一的标签
 * @param {Array} posts - 文章数组
 * @returns {Array} - 去重后的标签数组
 */
function getAllTags(posts) {
    const tags = new Set();  // 使用 Set 自动去重
    posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);  // 将 Set 转为数组
}
