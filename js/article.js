/**
 * 文章详情页脚本
 * 功能：加载 Markdown 文件、提取目录、渲染文章内容
 */

/**
 * 异步加载 Markdown 文件内容
 * @param {string} filePath - Markdown 文件路径
 * @returns {Promise<string>} - 返回文件内容
 */
async function loadMarkdownContent(filePath) {
    try {
        // 在控制台输出调试信息，方便排查问题
        console.log('开始加载文件:', filePath);
        
        // 获取当前页面的完整 URL
        const currentUrl = window.location.href;
        // 创建 URL 对象用于解析路径
        const baseUrl = new URL(currentUrl);
        
        let absolutePath;
        
        // 处理不同格式的文件路径
        if (filePath.startsWith('../')) {
            // 路径以 ../ 开头：表示相对于上一级目录
            // 移除前面的 ../，构建相对于网站根目录的路径
            const pathWithoutPrefix = filePath.replace(/^\.\.\//, '');
            absolutePath = new URL(pathWithoutPrefix, baseUrl.origin).href;
        } else if (filePath.startsWith('/')) {
            // 路径以 / 开头：表示相对于网站根目录的绝对路径
            absolutePath = new URL(filePath, baseUrl.origin).href;
        } else {
            // 其他情况：相对于当前页面的路径
            const currentPath = baseUrl.pathname;
            const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            absolutePath = new URL(filePath, baseUrl.origin + currentDir).href;
        }
        
        console.log('计算后的路径:', absolutePath);
        
        // 尝试第一种加载方式：直接访问 /articles/ 目录
        if (filePath.startsWith('../articles/')) {
            // 构建简化路径：直接从根目录访问 articles
            const simplePath = '/articles/' + filePath.replace('../articles/', '');
            console.log('尝试简化路径:', simplePath);
            
            try {
                // 使用 fetch 请求获取文件，添加缓存控制头确保获取最新内容
                const simpleResponse = await fetch(simplePath, {
                    headers: { 
                        'Cache-Control': 'no-cache',  // 不使用缓存
                        'Pragma': 'no-cache' 
                    }
                });
                
                // 如果响应成功，返回文件内容
                if (simpleResponse.ok) {
                    console.log('文件加载成功（简化路径）');
                    return await simpleResponse.text();
                }
            } catch (e) {
                console.log('简化路径失败，尝试绝对路径:', e);
            }
        }
        
        // 第二种加载方式：使用计算出的绝对路径
        const response = await fetch(absolutePath, {
            headers: { 
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache' 
            }
        });
        
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('文件加载成功');
        return await response.text();
        
    } catch (error) {
        // 捕获并输出错误信息
        console.error('加载 Markdown 文件出错:', error);
        
        // 尝试备用加载方案
        try {
            const fallbackPath = filePath.replace(/^\.\.\//, '');
            const fallbackUrl = new URL(fallbackPath, window.location.origin).href;
            console.log('尝试备用路径:', fallbackUrl);
            
            const fallbackResponse = await fetch(fallbackUrl, {
                headers: { 
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache' 
                }
            });
            
            if (fallbackResponse.ok) {
                return await fallbackResponse.text();
            }
        } catch (e) {
            console.error('备用路径也失败了:', e);
        }
        
        // 向用户显示错误提示
        alert('无法加载文章内容，请检查网络或文件路径。\n详细信息请查看浏览器控制台。');
        return '';
    }
}

/**
 * 从 Markdown 文本中提取标题，生成目录数据
 * @param {string} markdown - Markdown 文本内容
 * @returns {Array} - 标题数组 [{level, text, id}, ...]
 */
function extractTOC(markdown) {
    const headings = [];  // 存储提取的标题
    const lines = markdown.split('\n');  // 将文本按行分割
    
    // 遍历每一行，查找标题
    lines.forEach(line => {
        // 正则匹配：1-6个 # 号开头，后跟空格和标题文本
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        
        if (match) {
            const level = match[1].length;  // 标题级别（1-6）
            const text = match[2].trim();   // 标题文本
            
            // 生成唯一的 ID（用于锚点跳转）
            const id = text.toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]/g, '-')  // 替换非文字字符为连字符
                .replace(/-+/g, '-')                   // 多个连字符合并为一个
                .replace(/^-|-$/g, '');                // 去掉首尾的连字符
            
            // 将标题信息添加到数组
            headings.push({ level, text, id });
        }
    });
    
    return headings;
}

/**
 * 渲染目录到页面
 * @param {Array} toc - 目录数据数组
 */
function renderTOC(toc) {
    // 获取目录容器元素
    const container = document.getElementById('toc-container');
    
    // 如果没有容器或目录为空，隐藏侧边栏
    if (!container || toc.length === 0) {
        if (container) container.style.display = 'none';
        return;
    }
    
    // 生成目录 HTML
    let html = '<h3><i class="fas fa-list"></i> 目录</h3><nav class="toc-nav">';
    
    // 遍历所有标题，生成目录链接
    toc.forEach(heading => {
        // 根据标题级别设置缩进（一级标题不缩进，二级缩进16px，以此类推）
        const indent = (heading.level - 1) * 16;
        html += `<a href="#${heading.id}" class="toc-link" style="padding-left: ${indent}px;">${heading.text}</a>`;
    });
    
    html += '</nav>';
    
    // 将生成的 HTML 插入到页面
    container.innerHTML = html;
    container.style.display = 'block';  // 显示侧边栏
    
    // 为目录链接添加点击事件
    container.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();  // 阻止默认的锚点跳转行为
            
            // 获取目标元素的 ID
            const targetId = link.getAttribute('href').substring(1);
            // 查找目标元素
            const target = document.getElementById(targetId);
            
            if (target) {
                // 平滑滚动到目标位置
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'  // 元素顶部对齐视口顶部
                });
            }
        });
    });
}

/**
 * 渲染 Markdown 内容到页面，并启用代码高亮
 * @param {string} content - Markdown 文本内容
 */
function renderMarkdown(content) {
    // 获取文章内容容器
    const container = document.getElementById('article-content');
    if (!container) return;
    
    // 使用 Marked 库将 Markdown 解析为 HTML
    container.innerHTML = marked.parse(content);
    
    // 使用 Highlight.js 对代码块进行高亮
    hljs.highlightAll();
    
    // 为所有标题添加 ID（用于目录跳转）
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        // 生成与 extractTOC 相同格式的 ID
        const id = heading.textContent.toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        heading.id = id;
    });
}

/**
 * 初始化文章页面
 */
async function initArticle() {
    console.log('正在初始化文章页面...');
    
    // 1. 从 URL 参数中获取文章 ID
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    
    console.log('文章 ID:', postId);
    
    // 2. 在文章数据中查找对应的文章
    const post = posts.find(p => p.id === parseInt(postId));
    
    // 3. 如果找不到文章，显示错误信息
    if (!post) {
        console.error('找不到文章，ID:', postId);
        document.querySelector('.article-container').innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 4rem; margin-bottom: 16px; opacity: 0.5; color: var(--text-muted);"></i>
                <p style="color: var(--text-muted);">文章不存在</p>
                <a href="../index.html" class="btn" style="margin-top: 20px; display: inline-block;">返回首页</a>
            </div>
        `;
        return;
    }
    
    console.log('找到文章:', post.title);
    
    // 4. 填充文章基本信息
    document.getElementById('article-title').textContent = post.title;
    document.getElementById('article-date-text').textContent = formatDate(post.date);
    document.getElementById('article-tags').innerHTML = 
        post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // 5. 加载文章内容
    console.log('正在加载文章内容...');
    const content = post.file ? await loadMarkdownContent(post.file) : post.content;
    
    // 6. 提取并渲染目录
    const toc = extractTOC(content);
    console.log('提取到的目录:', toc);
    renderTOC(toc);
    
    // 7. 渲染文章内容
    renderMarkdown(content);
    
    console.log('文章页面初始化完成！');
}

// 当页面加载完成后，执行初始化函数
window.addEventListener('load', initArticle);
