// 文章列表页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 渲染所有文章
    renderAllPosts();
    
    // 渲染筛选标签
    renderFilterTags();
});

// 渲染所有文章
function renderAllPosts() {
    const container = document.getElementById('all-posts-container');
    if (!container) return;
    
    filterPosts();
}

// 渲染筛选标签
function renderFilterTags() {
    const container = document.getElementById('filter-container');
    if (!container) return;
    
    const tags = getAllTags(posts);
    
    let html = `<button class="filter-tag active" data-tag="all">全部</button>`;
    
    tags.forEach(tag => {
        html += `<button class="filter-tag" data-tag="${tag}">${tag}</button>`;
    });
    
    container.innerHTML = html;
    
    // 绑定点击事件
    container.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', function() {
            container.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.dataset.tag;
            filterPosts();
        });
    });
}

// 重写筛选文章函数
function filterPosts() {
    const container = document.getElementById('all-posts-container');
    if (!container) return;
    
    let filteredPosts = posts;
    
    // 标签筛选
    if (activeFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
            post.tags.includes(activeFilter)
        );
    }
    
    // 搜索筛选
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchQuery) ||
            post.excerpt.toLowerCase().includes(searchQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    // 按日期排序（最新在前）
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 渲染结果
    container.innerHTML = '';
    
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <p>没有找到匹配的文章</p>
            </div>
        `;
        return;
    }
    
    filteredPosts.forEach(post => {
        container.appendChild(createPostCard(post));
    });
}