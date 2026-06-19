/**
 * 文章添加辅助工具
 * 
 * 使用说明：
 * 1. 在浏览器控制台运行此脚本
 * 2. 或在项目根目录创建一个 HTML 页面引入此脚本
 * 
 * 这个工具会生成：
 * - posts.js 中需要添加的文章对象代码
 * - 提示创建 Markdown 文件
 */

// 文章数据模板
const postTemplate = {
    id: null,           // 自动生成
    title: '',
    excerpt: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    file: ''
};

/**
 * 生成新文章
 * @param {Object} options - 文章选项
 */
function generateNewPost(options) {
    // 获取当前最大ID
    const maxId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0;
    const newId = maxId + 1;
    
    // 生成文件名（基于标题）
    const fileName = options.title
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '.md';
    
    const newPost = {
        id: newId,
        title: options.title,
        excerpt: options.excerpt || options.title,
        date: options.date || postTemplate.date,
        tags: options.tags || [],
        file: '../articles/' + fileName
    };
    
    console.log('=== 新文章数据 ===');
    console.log('请将以下代码添加到 js/posts.js 的 posts 数组末尾：');
    console.log('');
    console.log(JSON.stringify(newPost, null, 4) + ',');
    console.log('');
    console.log('=== Markdown 文件 ===');
    console.log(`请创建文件: articles/${fileName}`);
    console.log('');
    console.log('Markdown 内容示例：');
    console.log(`# ${options.title}`);
    console.log('');
    console.log('在这里写你的文章内容...');
    
    return newPost;
}

/**
 * 交互式添加文章（浏览器控制台使用）
 */
function interactiveAddPost() {
    const title = prompt('请输入文章标题：');
    if (!title) {
        console.log('已取消');
        return;
    }
    
    const excerpt = prompt('请输入文章摘要（可选）：', title);
    const tagsInput = prompt('请输入标签（多个标签用逗号分隔）：');
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    const date = prompt('请输入日期（可选，格式：YYYY-MM-DD）：', postTemplate.date);
    
    generateNewPost({
        title,
        excerpt: excerpt || title,
        tags,
        date: date || postTemplate.date
    });
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.generateNewPost = generateNewPost;
    window.interactiveAddPost = interactiveAddPost;
    
    console.log('=== 文章添加工具已加载 ===');
    console.log('使用方法：');
    console.log('1. interactiveAddPost() - 交互式添加文章');
    console.log('2. generateNewPost({ title: "标题", tags: ["标签1", "标签2"] }) - 程序化添加');
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateNewPost,
        postTemplate
    };
}
