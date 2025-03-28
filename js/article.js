// 异步加载Markdown文件内容
async function loadMarkdownContent(filePath) {
  try {
    // 记录原始文件路径用于调试
    console.log('Original file path:', filePath);
    
    // 获取当前页面URL用于路径计算
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    
    // 创建基础URL对象解析协议和域名
    const baseUrl = new URL(currentUrl);
    console.log('Base URL origin:', baseUrl.origin);
    
    // 多级路径处理逻辑开始
    let absolutePath;
    
    // 处理以../开头的相对路径（指向根目录）
    if (filePath.startsWith('../')) {
      // 移除路径前缀并构建绝对路径
      const pathWithoutPrefix = filePath.replace(/^\.\.\//, '');
      absolutePath = new URL(pathWithoutPrefix, baseUrl.origin).href;
    } 
    // 处理绝对路径（以/开头）
    else if (filePath.startsWith('/')) {
      absolutePath = new URL(filePath, baseUrl.origin).href;
    } 
    // 处理相对当前页面的路径
    else {
      // 获取当前目录路径
      const currentPath = baseUrl.pathname;
      const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      // 组合新的绝对路径
      absolutePath = new URL(filePath, baseUrl.origin + currentDir).href;
    }
    
    // 调试输出最终计算路径
    console.log('Calculated absolute path:', absolutePath);
    
    // 优先尝试简化路径加载（针对/articles/目录的特殊处理）
    if (filePath.startsWith('../articles/')) {
      // 构建直接访问路径
      const simplePath = '/articles/' + filePath.replace('../articles/', '');
      console.log('Trying simplified path:', simplePath);
      
      try {
        // 带缓存控制的fetch请求
        const simpleResponse = await fetch(simplePath, {
          headers: {
            'Cache-Control': 'no-cache',  // 禁用缓存获取最新内容
            'Pragma': 'no-cache'
          }
        });
        
        if (simpleResponse.ok) {
          // 成功加载Markdown内容
          const markdown = await simpleResponse.text();
          console.log('Markdown loaded successfully using simplified path');
          return markdown;
        }
      } catch (simpleError) {
        console.log('Failed to load with simplified path, trying absolute path');
      }
    }
    
    // 主加载路径（使用计算出的绝对路径）
    const response = await fetch(absolutePath, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    // 处理HTTP错误状态
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    // 返回解析的Markdown文本
    const markdown = await response.text();
    return markdown;
  } catch (error) {
    // 错误处理流程开始
    console.error('Error loading markdown file:', error);
    
    // 备用加载方案（直接使用根路径）
    try {
      const fallbackPath = filePath.replace(/^\.\.\//, '');
      const fallbackUrl = new URL(fallbackPath, window.location.origin).href;
      
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (fallbackResponse.ok) {
        return await fallbackResponse.text();
      }
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
    }
    
    // 最终错误提示
    alert(`无法加载文章内容: ${error.message}\n请检查控制台获取详细错误信息`);
    return '';
  }
}

// 渲染Markdown内容并启用代码高亮
function renderMarkdown(content) {
  const container = document.getElementById('article-content');
  if (container) {
    // 使用marked库解析Markdown
    container.innerHTML = marked.parse(content);
    // 启用highlight.js代码高亮
    hljs.highlightAll();
  }
}

// 初始化文章页面
async function initArticle() {
  // 从URL参数获取文章ID
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  
  // 在posts数组中查找对应文章
  const post = posts.find(p => p.id === parseInt(postId));
  if (post) {
    // 绑定文章元数据到页面元素
    document.getElementById('article-title').textContent = post.title;
    document.getElementById('article-date').textContent = post.date;
    document.getElementById('article-tags').innerHTML = 
      post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    // 加载并渲染内容
    const content = post.file ? 
      await loadMarkdownContent(post.file) : 
      post.content;
    renderMarkdown(content);
  }
}

// 页面加载完成后初始化
window.addEventListener('load', initArticle);