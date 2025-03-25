// 在文章详情页面加载特定文章
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    if (!articleId) {
        console.error('未找到文章ID');
        return;
    }
    
    // 查找对应ID的文章
    const article = posts.find(post => post.id === articleId);
    
    if (!article) {
        console.error('未找到ID为', articleId, '的文章');
        return;
    }
    
    // 更新页面标题
    document.title = `${article.title} - 我的博客`;
    
    // 填充文章内容
    const articleTitle = document.getElementById('article-title');
    const articleDate = document.getElementById('article-date');
    const articleTags = document.getElementById('article-tags');
    const articleContent = document.getElementById('article-content');
    
    if (articleTitle) articleTitle.textContent = article.title;
    if (articleDate) articleDate.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formatDate(article.date)}`;
    
    if (articleTags) {
        articleTags.innerHTML = article.tags.map(tag => 
            `<span class="article-tag">${tag}</span>`
        ).join('');
    }
    
    if (articleContent && window.marked) {
        articleContent.innerHTML = marked.parse(article.content);
        
        // 应用代码高亮
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }
    }
});