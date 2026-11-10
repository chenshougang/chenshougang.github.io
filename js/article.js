/**
 * 文章详情页脚本
 * 功能：加载 Markdown、生成目录、代码高亮与复制、阅读时长
 */

/**
 * 加载 Markdown 文件
 * @param {string} filePath
 * @returns {Promise<string>}
 */
async function loadMarkdownContent(filePath) {
    const candidates = [];

    if (filePath.indexOf('../articles/') === 0) {
        candidates.push('/articles/' + filePath.slice('../articles/'.length));
    }
    candidates.push(new URL(filePath, window.location.href).href);

    let lastError = null;

    for (let i = 0; i < candidates.length; i++) {
        try {
            const response = await fetch(candidates[i], { cache: 'no-cache' });
            if (response.ok) {
                return await response.text();
            }
            lastError = new Error(`HTTP ${response.status}`);
        } catch (error) {
            lastError = error;
        }
    }

    console.error('加载 Markdown 失败:', filePath, lastError);
    return null;
}

/**
 * 去除 Markdown 文件头部的 front matter
 * @param {string} markdown
 * @returns {string}
 */
function stripFrontMatter(markdown) {
    return String(markdown || '')
        .replace(/^\uFEFF/, '')
        .replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n)?/, '');
}

/**
 * 生成锚点 ID
 * @param {string} text
 * @returns {string}
 */
function slugify(text) {
    return String(text)
        .trim()
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || 'section';
}

/**
 * 渲染 Markdown 并返回标题列表
 * @param {string} content
 * @param {string} [articleTitle] - 文章标题，用于避免目录重复
 * @returns {Array} [{level, text, id}]
 */
function renderMarkdown(content, articleTitle) {
    const container = document.getElementById('article-content');
    if (!container) return [];

    container.innerHTML = marked.parse(content);

    if (window.hljs) {
        container.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    }

    // 标题锚点（自动去重）
    const usedIds = new Set();
    const headings = [];
    container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        let id = slugify(heading.textContent);
        let uniqueId = id;
        let suffix = 2;
        while (usedIds.has(uniqueId)) {
            uniqueId = `${id}-${suffix++}`;
        }
        usedIds.add(uniqueId);
        heading.id = uniqueId;

        const duplicatesTitle = heading.tagName === 'H1' &&
            articleTitle &&
            heading.textContent.trim() === articleTitle.trim();

        if (!duplicatesTitle) {
            headings.push({
                level: parseInt(heading.tagName.substring(1), 10),
                text: heading.textContent,
                id: uniqueId
            });
        }
    });

    // 外部链接新窗口打开
    container.querySelectorAll('a[href^="http"]').forEach(link => {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
    });

    // 代码复制按钮
    container.querySelectorAll('pre').forEach(pre => {
        if (pre.querySelector('.code-copy')) return;
        const button = document.createElement('button');
        button.className = 'code-copy';
        button.type = 'button';
        button.innerHTML = '<i class="fas fa-copy"></i><span>复制</span>';

        button.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            const ok = await copyText(text);
            if (ok) {
                button.classList.add('copied');
                button.innerHTML = '<i class="fas fa-check"></i><span>已复制</span>';
                showToast('代码已复制到剪贴板');
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = '<i class="fas fa-copy"></i><span>复制</span>';
                }, 1800);
            } else {
                showToast('复制失败，请手动选择代码');
            }
        });

        pre.appendChild(button);
    });

    return headings;
}

/**
 * 复制文本
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // 继续尝试兜底方案
        }
    }

    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
    } catch (error) {
        return false;
    }
}

let toastTimer = null;

/**
 * 显示提示
 * @param {string} message
 */
function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

/**
 * 渲染目录
 * @param {Array} toc
 */
function renderTOC(toc) {
    const container = document.getElementById('toc-container');
    if (!container) return;

    const items = toc.filter(item => item.level <= 3);
    if (items.length === 0) {
        container.style.display = 'none';
        return;
    }

    let html = '<h3><i class="fas fa-list-ul"></i> 目录</h3><nav class="toc-nav">';
    items.forEach(heading => {
        const indent = (heading.level - 1) * 12;
        html += `<a href="#${heading.id}" class="toc-link" data-target="${heading.id}" style="padding-left: ${12 + indent}px;">${escapeHtml(heading.text)}</a>`;
    });
    html += '</nav>';

    container.innerHTML = html;
    container.style.display = 'block';

    container.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.dataset.target);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', '#' + link.dataset.target);
            }
        });
    });

    initTOCScrollSpy(items);
}

/**
 * 目录滚动高亮
 * @param {Array} items
 */
function initTOCScrollSpy(items) {
    const links = Array.prototype.slice.call(document.querySelectorAll('.toc-link'));
    if (!links.length) return;

    const update = () => {
        let activeId = null;
        const offset = 140;

        items.forEach(item => {
            const el = document.getElementById(item.id);
            if (el && el.getBoundingClientRect().top <= offset) {
                activeId = item.id;
            }
        });

        links.forEach(link => {
            link.classList.toggle('active', link.dataset.target === activeId);
        });
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/**
 * 计算阅读时长
 * @param {string} content
 * @returns {number}
 */
function estimateReadingMinutes(content) {
    const text = content.replace(/```[\s\S]*?```/g, ' ');
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9_]+/g) || []).length;
    return Math.max(1, Math.round(chineseChars / 350 + words / 200));
}

/**
 * 初始化文章页
 */
async function initArticle() {
    const params = new URLSearchParams(window.location.search);
    const postKey = params.get('post');
    const legacyId = parseInt(params.get('id'), 10);

    let post = null;
    if (postKey) {
        post = posts.find(p => p.slug === postKey) || null;
        if (!post && /^\d+$/.test(postKey)) {
            post = posts.find(p => p.id === parseInt(postKey, 10)) || null;
        }
    }
    if (!post && !isNaN(legacyId)) {
        post = posts.find(p => p.id === legacyId) || null;
    }

    const articleContainer = document.querySelector('.article-container');

    if (!post) {
        if (articleContainer) {
            articleContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>文章不存在</p>
                    <a href="../index.html" class="btn" style="margin-top: 20px;">返回首页</a>
                </div>
            `;
        }
        return;
    }

    document.title = `${post.title} - CSG.DEV`;

    document.getElementById('article-title').textContent = post.title;
    document.getElementById('article-date-text').textContent = formatDate(post.date);
    document.getElementById('article-tags').innerHTML =
        (post.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');

    const rawContent = post.file ? await loadMarkdownContent(post.file) : post.content;

    if (rawContent === null) {
        if (articleContainer) {
            articleContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plug-circle-xmark"></i>
                    <p>文章内容加载失败</p>
                    <a href="../index.html" class="btn" style="margin-top: 20px;">返回首页</a>
                </div>
            `;
        }
        return;
    }

    const content = stripFrontMatter(rawContent);

    const readTimeEl = document.getElementById('article-readtime-text');
    if (readTimeEl) {
        readTimeEl.textContent = `约 ${estimateReadingMinutes(content)} 分钟`;
    }

    const toc = renderMarkdown(content, post.title);
    renderTOC(toc);
}

window.addEventListener('load', initArticle);
