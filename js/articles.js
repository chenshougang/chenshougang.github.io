// 在文章列表页面加载所有文章
document.addEventListener('DOMContentLoaded', function() {
    const allPostsContainer = document.getElementById('all-posts-container');
    if (allPostsContainer) {
        // 显示所有文章
        posts.forEach(post => {
            const postCard = createPostCard(post);
            allPostsContainer.appendChild(postCard);
        });
    }
});