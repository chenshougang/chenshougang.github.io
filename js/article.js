async function loadMarkdownContent(filePath) {
  try {
    console.log('Original file path:', filePath); // 记录原始文件路径
    
    // 获取当前页面的URL
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    
    // 创建一个基础URL对象
    const baseUrl = new URL(currentUrl);
    console.log('Base URL origin:', baseUrl.origin);
    
    // 构建绝对路径
    let absolutePath;
    
    if (filePath.startsWith('../')) {
      // 如果我们在pages目录下，并且文件路径以../开头
      // 这意味着文件位于网站根目录下
      const pathWithoutPrefix = filePath.replace(/^\.\.\//, '');
      absolutePath = new URL(pathWithoutPrefix, baseUrl.origin).href;
    } else if (filePath.startsWith('/')) {
      // 如果路径以/开头，则它是相对于网站根目录的绝对路径
      absolutePath = new URL(filePath, baseUrl.origin).href;
    } else {
      // 其他情况，假设它是相对于当前页面的路径
      const currentPath = baseUrl.pathname;
      const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
      absolutePath = new URL(filePath, baseUrl.origin + currentDir).href;
    }
    
    console.log('Calculated absolute path:', absolutePath);
    console.log('Final request URL:', absolutePath);
    console.log('Server base origin:', window.location.origin);
    
    // 尝试直接使用相对于服务器根目录的路径
    if (filePath.startsWith('../articles/')) {
      const simplePath = '/articles/' + filePath.replace('../articles/', '');
      console.log('Trying simplified path:', simplePath);
      
      try {
        const simpleResponse = await fetch(simplePath, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (simpleResponse.ok) {
          const markdown = await simpleResponse.text();
          console.log('Markdown loaded successfully using simplified path');
          console.log('Content preview:', markdown.substring(0, 100));
          return markdown;
        }
      } catch (simpleError) {
        console.log('Failed to load with simplified path, trying absolute path');
      }
    }
    
    // 如果简化路径失败或不适用，使用计算出的绝对路径
    console.log('Final fetch URL:', absolutePath);
    const response = await fetch(absolutePath, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    const markdown = await response.text();
    console.log('Markdown content loaded successfully with absolute path');
    console.log('Content preview:', markdown.substring(0, 100));
    return markdown;
  } catch (error) {
    console.error('Error loading markdown file:', error);
    
    // 尝试最后的备用方法 - 直接使用相对于当前URL的路径
    try {
      console.log('Trying fallback method...');
      const fallbackPath = filePath.replace(/^\.\.\//, '');
      const fallbackUrl = new URL(fallbackPath, window.location.origin).href;
      console.log('Fallback constructed URL:', fallbackUrl);
      console.log('Fallback URL:', fallbackUrl);
      
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (fallbackResponse.ok) {
        const markdown = await fallbackResponse.text();
        console.log('Markdown loaded successfully using fallback method');
        return markdown;
      }
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
    }
    
    alert(`无法加载文章内容: ${error.message}\n请检查控制台获取详细错误信息`);
    return '';
  }
}

function renderMarkdown(content) {
  const container = document.getElementById('article-content');
  if (container) {
    container.innerHTML = marked.parse(content);
    hljs.highlightAll();
  }
}

async function initArticle() {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');
  const post = posts.find(p => p.id === parseInt(postId));
  if (post) {
    // 设置文章标题
    const titleElement = document.getElementById('article-title');
    if (titleElement) {
      titleElement.textContent = post.title;
    }

    // 设置发布日期
    const dateElement = document.getElementById('article-date');
    if (dateElement) {
      dateElement.textContent = post.date;
    }

    // 设置标签
    const tagsElement = document.getElementById('article-tags');
    if (tagsElement) {
      tagsElement.innerHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }

    // 加载并渲染文章内容
    if (post.file) {
      const content = await loadMarkdownContent(post.file);
      renderMarkdown(content);
    } else if (post.content) {
      renderMarkdown(post.content);
    }
  }
}

window.addEventListener('load', initArticle);