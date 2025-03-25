async function loadMarkdownContent(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const markdown = await response.text();
    return markdown;
  } catch (error) {
    console.error('Error loading markdown file:', error);
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