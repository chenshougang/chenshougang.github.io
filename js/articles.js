/**
 * 文章列表页脚本
 * 功能：渲染文章列表、标签筛选、搜索
 */

document.addEventListener('DOMContentLoaded', function () {
    renderFilterTags();
    filterPosts();
});

/**
 * 渲染标签筛选按钮
 */
function renderFilterTags() {
    const container = document.getElementById('filter-container');
    if (!container) return;

    const tags = getAllTags(posts);

    let html = `<button class="filter-tag active" data-tag="all">全部</button>`;
    tags.forEach(tag => {
        html += `<button class="filter-tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`;
    });
    container.innerHTML = html;

    container.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', function () {
            container.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.dataset.tag;
            filterPosts();
        });
    });
}

/**
 * 根据当前标签与关键词筛选并渲染文章
 */
function filterPosts() {
    const container = document.getElementById('all-posts-container');
    if (!container) return;

    let filteredPosts = [...posts];

    if (activeFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => (post.tags || []).includes(activeFilter));
    }

    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => {
            const tags = post.tags || [];
            return (
                String(post.title).toLowerCase().includes(searchQuery) ||
                String(post.excerpt).toLowerCase().includes(searchQuery) ||
                tags.some(tag => String(tag).toLowerCase().includes(searchQuery))
            );
        });
    }

    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    updateResultCount(filteredPosts.length);

    container.innerHTML = '';

    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-satellite-dish"></i>
                <p>没有找到匹配的文章</p>
            </div>
        `;
        return;
    }

    filteredPosts.forEach(post => {
        container.appendChild(createPostCard(post));
    });
}

/**
 * 更新结果数量提示
 * @param {number} count
 */
function updateResultCount(count) {
    const el = document.getElementById('result-count');
    if (!el) return;
    el.textContent = `// 共 ${count} 篇 / TOTAL ${count}`;
}
