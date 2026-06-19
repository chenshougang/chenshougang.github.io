// 异步加载 Markdown 文件内容
async function loadMarkdownContent(filePath) {
    try {
        console.log('Loading file:', filePath);
        
        const currentUrl = window.location.href;
        const baseUrl = new URL(currentUrl);
        
        let absolutePath;
        if (filePath.startsWith('../')) {
            const pathWithoutPrefix = filePath.replace(/^\.\.\//, '');
            absolutePath = new URL(pathWithoutPrefix, baseUrl.origin).href;
        } else if (filePath.startsWith('/')) {
            absolutePath = new URL(filePath, baseUrl.origin).href;
        } else {
            const currentPath = baseUrl.pathname;
            const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            absolutePath = new URL(filePath, baseUrl.origin + currentDir).href;
        }
        
        if (filePath.startsWith('../articles/')) {
            const simplePath = '/articles/' + filePath.replace('../articles/', '');
            try {
                const simpleResponse = await fetch(simplePath, {
                    headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
                });
                if (simpleResponse.ok) {
                    return await simpleResponse.text();
                }
            } catch (e) {
                console.log('Simple path failed, trying absolute');
            }
        }
        
        const response = await fetch(absolutePath, {
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error('Error loading markdown:', error);
        
        try {
            const fallbackPath = filePath.replace(/^\.\.\//, '');
            const fallbackUrl = new URL(fallbackPath, window.location.origin).href;
            const fallbackResponse = await fetch(fallbackUrl, {
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });
            if (fallbackResponse.ok) {
                return await fallbackResponse.text();
            }
        } catch (e) {
            console.error('Fallback also failed:', e);
        }
        
        alert('无法加载文章内容，请检查网络或文件路径');
        return '';
    }
}

// 从 Markdown 中提取目录
function extractTOC(markdown) {
    const headings = [];
    const lines = markdown.split('\n');
    
    lines.forEach(line => {
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            
            headings.push({ level, text, id });
        }
    });
    
    return headings;
}

// 渲染目录
function renderTOC(toc) {
    const container = document.getElementById('toc-container');
    if (!container || toc.length === 0) {
        if (container) container.style.display = 'none';
        return;
    }
    
    let html = '<h3><i class="fas fa-list"></i> 目录</h3><nav class="toc-nav">';
    
    toc.forEach(heading => {
        const indent = (heading.level - 1) * 16;
        html += `<a href="#${heading.id}" class="toc-link" style="padding-left: ${indent}px;">${heading.text}</a>`;
    });
    
    html += '</nav>';
    container.innerHTML = html;
    container.style.display = 'block';
    
    container.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// 渲染 Markdown 内容并启用代码高亮
function renderMarkdown(content) {
    const container = document.getElementById('article-content');
    if (!container) return;
    
    container.innerHTML = marked.parse(content);
    hljs.highlightAll();
    
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        const id = heading.textContent.toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        heading.id = id;
    });
}

// 初始化文章页面
async function initArticle() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    
    const post = posts.find(p => p.id === parseInt(postId));
    if (!post) {
        document.querySelector('.article-container').innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-exclamation-circle" style="font-size: 4rem; margin-bottom: 16px; opacity: 0.5; color: var(--text-muted);"></i>
                <p style="color: var(--text-muted);">文章不存在</p>
                <a href="../index.html" class="btn" style="margin-top: 20px; display: inline-block;">返回首页</a>
            </div>
        `;
        return;
    }
    
    document.getElementById('article-title').textContent = post.title;
    document.getElementById('article-date').textContent = formatDate(post.date);
    document.getElementById('article-tags').innerHTML = 
        post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    const content = post.file ? await loadMarkdownContent(post.file) : post.content;
    
    const toc = extractTOC(content);
    renderTOC(toc);
    
    renderMarkdown(content);
}

window.addEventListener('load', initArticle);
