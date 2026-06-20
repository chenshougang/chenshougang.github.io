/**
 * 文章列表页脚本
 * 功能：渲染文章列表、标签筛选、搜索功能
 */

/**
 * 页面加载完成后的初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('文章列表页初始化...');
    
    // 1. 渲染所有文章
    renderAllPosts();
    
    // 2. 渲染标签筛选按钮
    renderFilterTags();
});

/**
 * 渲染所有文章到页面
 */
function renderAllPosts() {
    const container = document.getElementById('all-posts-container');
    if (!container) {
        console.error('找不到文章容器元素');
        return;
    }
    
    console.log('开始渲染文章列表...');
    filterPosts();  // 通过 filterPosts 函数来渲染
}

/**
 * 渲染标签筛选按钮
 */
function renderFilterTags() {
    const container = document.getElementById('filter-container');
    if (!container) {
        console.log('没有筛选容器，跳过渲染标签');
        return;
    }
    
    // 获取所有文章的标签（去重）
    const tags = getAllTags(posts);
    console.log('获取到的标签:', tags);
    
    // 生成 HTML：首先添加"全部"按钮
    let html = `<button class="filter-tag active" data-tag="all">全部</button>`;
    
    // 然后添加各个标签按钮
    tags.forEach(tag => {
        html += `<button class="filter-tag" data-tag="${tag}">${tag}</button>`;
    });
    
    // 将 HTML 插入到页面
    container.innerHTML = html;
    
    // 为所有筛选按钮添加点击事件
    container.querySelectorAll('.filter-tag').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的 active 状态
            container.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
            // 给当前点击的按钮添加 active 状态
            this.classList.add('active');
            // 更新当前筛选标签
            activeFilter = this.dataset.tag;
            console.log('筛选标签已切换为:', activeFilter);
            // 重新筛选文章
            filterPosts();
        });
    });
    
    console.log('标签筛选按钮渲染完成');
}

/**
 * 筛选并渲染文章
 * 根据 activeFilter 和 searchQuery 进行筛选
 */
function filterPosts() {
    const container = document.getElementById('all-posts-container');
    if (!container) return;
    
    console.log('开始筛选文章...');
    console.log('当前筛选标签:', activeFilter);
    console.log('当前搜索关键词:', searchQuery);
    
    // 从所有文章开始筛选
    let filteredPosts = [...posts];  // 复制数组，避免修改原数据
    
    // 1. 按标签筛选
    if (activeFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
            post.tags.includes(activeFilter)
        );
        console.log('按标签筛选后剩余:', filteredPosts.length, '篇');
    }
    
    // 2. 按搜索关键词筛选
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
            // 在标题中搜索
            post.title.toLowerCase().includes(searchQuery) ||
            // 在摘要中搜索
            post.excerpt.toLowerCase().includes(searchQuery) ||
            // 在标签中搜索
            post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
        console.log('按搜索筛选后剩余:', filteredPosts.length, '篇');
    }
    
    // 3. 按日期排序（最新的在前）
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 清空容器
    container.innerHTML = '';
    
    // 如果没有匹配的文章，显示空状态
    if (filteredPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <p>没有找到匹配的文章</p>
            </div>
        `;
        console.log('没有找到匹配的文章');
        return;
    }
    
    // 渲染筛选后的文章
    console.log('渲染文章数量:', filteredPosts.length);
    filteredPosts.forEach(post => {
        container.appendChild(createPostCard(post));
    });
    
    console.log('文章筛选和渲染完成');
}
