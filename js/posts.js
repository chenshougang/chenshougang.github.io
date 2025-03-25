// 模拟文章数据
const posts = [
    {
        id: 3,
        title: '如何添加文章到博客',
        date: '2023-10-17',
        tags: ['博客', '教程'],
        excerpt: '本文将介绍如何在这个博客系统中添加新的文章，包括文章格式、Markdown语法等内容。',
        content: `
# 如何添加文章到博客

*发布于 2023-10-17*

本文将介绍如何在这个博客系统中添加新的文章。通过阅读本文，你将了解到添加文章的具体步骤和注意事项。

## 文章结构

每篇文章都需要包含以下基本信息：

- **标题**：文章的主标题
- **日期**：发布日期
- **标签**：文章的分类标签
- **摘要**：简短的文章介绍
- **正文内容**：使用Markdown格式编写

## 添加步骤

1. 打开 posts.js 文件
2. 在文章数组中添加新的文章对象
3. 设置文章的基本信息（ID、标题、日期等）
4. 使用Markdown编写文章内容

## Markdown语法示例

### 标题

使用 # 号表示标题级别：

\# 一级标题
\## 二级标题
\### 三级标题

### 文本格式

- *斜体* 使用 \*文本\*
- **粗体** 使用 \*\*文本\*\*
- ***粗斜体*** 使用 \*\*\*文本\*\*\*

### 列表

无序列表：
- 项目1
- 项目2
- 项目3

有序列表：
1. 第一步
2. 第二步
3. 第三步

### 代码

行内代码使用反引号：\`code\`

代码块使用三个反引号：

\```javascript
const article = {
    title: "文章标题",
    content: "文章内容"
};
\```

## 注意事项

1. 确保文章ID是唯一的
2. 日期格式统一使用 YYYY-MM-DD
3. 标签应该简洁明确
4. 摘要长度适中，突出文章重点
5. 正文内容结构清晰，层次分明

## 预览和发布

添加文章后，你可以：

1. 在本地预览文章效果
2. 检查文章格式是否正确
3. 确认无误后提交更新

## 结语

通过以上步骤，你现在应该已经掌握了如何添加新文章。记住，一篇好的文章不仅需要内容充实，还要注意格式规范和结构清晰。

祝你写作愉快！
`
    },
    {
        id: 1,
        title: '如何使用Markdown写作',
        date: '2023-10-15',
        excerpt: 'Markdown是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的HTML文档。',
        content: `
# 如何使用Markdown写作

*发布于 2023-10-15*

Markdown是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的HTML文档。本文将介绍Markdown的基本语法和使用技巧。

## Markdown的优势

- **简洁**：语法简单，易于学习
- **高效**：专注于内容而非格式
- **可移植**：几乎可以在任何地方使用
- **兼容性**：可以轻松转换为HTML或其他格式

## 基本语法

### 标题

使用 # 符号表示标题，# 的数量表示标题的级别：

\# 一级标题  
\## 二级标题  
\### 三级标题  

### 强调

*斜体* 或 _斜体_  
**粗体** 或 __粗体__  
***粗斜体*** 或 ___粗斜体___  

### 列表

无序列表使用 - 或 * 或 + 作为列表标记：

- 项目1
- 项目2
- 项目3

有序列表使用数字加点：

1. 第一项
2. 第二项
3. 第三项

### 链接

[链接文本](链接地址 "可选标题")

例如：[Google](https://www.google.com "谷歌")

### 图片

![替代文本](图片地址 "可选标题")

### 代码

行内代码使用反引号包裹：\`code\`

代码块使用三个反引号包裹，并可以指定语言：

\```javascript
function hello() {
  console.log("Hello, world!");
}
\```

## 高级技巧

### 表格

| 表头1 | 表头2 | 表头3 |
| ----- | ----- | ----- |
| 单元格1 | 单元格2 | 单元格3 |
| 单元格4 | 单元格5 | 单元格6 |

### 引用

> 这是一段引用文本。
> 
> 这是引用的第二段。

### 水平线

三个或更多的 - 或 * 或 _：

---

## 结论

Markdown是一种非常实用的写作工具，特别适合技术文档、博客文章和笔记。通过本文的介绍，相信你已经掌握了Markdown的基本用法，可以开始使用它来提高你的写作效率了。

祝你写作愉快！
`,
        tags: ['Markdown', '写作', '教程'],
        cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        title: 'JavaScript异步编程详解',
        date: '2023-10-20',
        excerpt: '异步编程是JavaScript中的重要概念，本文将详细介绍Promise、async/await等异步编程技术。',
        content: `
# JavaScript异步编程详解

*发布于 2023-10-20*

异步编程是JavaScript中的重要概念，特别是在处理网络请求、文件操作等耗时操作时尤为重要。本文将详细介绍JavaScript中的异步编程技术。

## 为什么需要异步编程？

JavaScript是单线程语言，这意味着它一次只能执行一个任务。如果某个任务需要很长时间，就会阻塞后续任务的执行，导致页面卡顿。异步编程允许在等待耗时操作完成的同时继续执行其他代码，从而提高程序的效率和响应性。

## 回调函数

回调函数是最早的异步编程方式，通过将函数作为参数传递给异步操作，在操作完成时调用该函数。

\```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'John', age: 30 };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data); // 1秒后输出: { name: 'John', age: 30 }
});
\```

然而，当需要处理多个连续的异步操作时，回调函数会导致"回调地狱"（Callback Hell）：

\```javascript
fetchData((data) => {
  processData(data, (processedData) => {
    saveData(processedData, (result) => {
      console.log(result);
      // 更多嵌套...
    });
  });
});
\```

## Promise

Promise是ES6引入的一种处理异步操作的对象，它代表一个异步操作的最终完成（或失败）及其结果值。Promise有三种状态：

- **pending**：初始状态，既不是成功也不是失败
- **fulfilled**：操作成功完成
- **rejected**：操作失败

使用Promise重写上面的例子：

\```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { name: 'John', age: 30 };
      resolve(data);
      // 如果出错，可以调用reject(error)
    }, 1000);
  });
}

fetchData()
  .then(data => {
    console.log(data);
    return processData(data);
  })
  .then(processedData => {
    return saveData(processedData);
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
\```

## Async/Await

Async/Await是ES2017引入的语法糖，它建立在Promise之上，使异步代码看起来更像同步代码，更易于理解和维护。

\```javascript
async function handleData() {
  try {
    const data = await fetchData();
    console.log(data);
    
    const processedData = await processData(data);
    const result = await saveData(processedData);
    
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

handleData();
\```

## 实际应用示例

### 使用Fetch API获取数据

\```javascript
async function fetchUsers() {
  try {
    const response = await fetch('https://api.example.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Fetching users failed:', error);
  }
}
\```

### 并行执行多个异步操作

\```javascript
async function fetchMultipleResources() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('https://api.example.com/users').then(res => res.json()),
      fetch('https://api.example.com/posts').then(res => res.json()),
      fetch('https://api.example.com/comments').then(res => res.json())
    ]);
    
    console.log('Users:', users);
    console.log('Posts:', posts);
    console.log('Comments:', comments);
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
}
\```

## 最佳实践

1. **始终处理错误**：无论是使用Promise的catch方法还是try/catch块，都要确保处理可能发生的错误。

2. **避免嵌套Promise**：利用Promise链或async/await来避免嵌套，提高代码可读性。

3. **合理使用Promise.all**：当多个异步操作之间没有依赖关系时，使用Promise.all并行执行它们。

4. **注意async函数总是返回Promise**：即使函数体内没有await表达式，async函数也会返回一个Promise。

## 结论

异步编程是JavaScript中的核心概念，掌握它对于构建高性能、响应式的Web应用至关重要。从回调函数到Promise再到Async/Await，JavaScript的异步编程模式不断演进，为开发者提供了更强大、更易用的工具。

希望本文能帮助你更好地理解JavaScript中的异步编程！
`,
        tags: ['JavaScript', '异步编程', 'Promise', 'Async/Await'],
        cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        title: 'CSS Grid布局完全指南',
        date: '2023-10-25',
        excerpt: 'CSS Grid是一种强大的二维布局系统，本文将详细介绍Grid布局的基本概念和实际应用。',
        content: `
# CSS Grid布局完全指南

*发布于 2023-10-25*

CSS Grid布局是一种二维布局系统，专为解决复杂的网页布局问题而设计。与Flexbox（主要是一维布局工具）不同，Grid可以同时处理行和列，使得创建复杂的布局变得更加简单和直观。

## 基本概念

### 网格容器和网格项

要创建一个网格布局，首先需要将一个元素设置为网格容器：

\```css
.container {
  display: grid;
}
\```

容器内的直接子元素自动成为网格项（Grid Items）。

### 行和列

使用\`grid-template-columns\`和\`grid-template-rows\`定义网格的列和行：

\```css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 100px 100px;
}
\```

这将创建一个3列2行的网格，每列宽200px，每行高100px。

### fr单位

fr单位表示网格容器中可用空间的一部分：

\```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
\```

这将创建三列，中间列占用两倍于两侧列的空间。

### 网格间距

使用\`grid-column-gap\`和\`grid-row-gap\`（或简写\`grid-gap\`）设置网格线的宽度：

\```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
}
\```

## 放置网格项

### 使用行和列编号

可以使用\`grid-column\`和\`grid-row\`属性指定网格项的位置：

\```css
.item {
  grid-column: 1 / 3; /* 从第1条列线到第3条列线 */
  grid-row: 2 / 3; /* 从第2条行线到第3条行线 */
}
\```

### 使用grid-area

\`grid-area\`属性是\`grid-row-start\`、\`grid-column-start\`、\`grid-row-end\`和\`grid-column-end\`的简写：

\```css
.item {
  grid-area: 2 / 1 / 3 / 3; /* 行开始 / 列开始 / 行结束 / 列结束 */
}
\```

### 使用命名的网格区域

可以使用\`grid-template-areas\`属性命名网格区域：

\```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas: 
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
\```

## 响应式网格布局

### minmax()函数

\`minmax()\`函数定义了一个大小范围，不小于min，不大于max：

\```css
.container {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 2fr 1fr;
}
\```

### auto-fill和auto-fit

\`repeat()\`函数结合\`auto-fill\`或\`auto-fit\`可以创建响应式布局：

\```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
\```

这将创建尽可能多的200px列，并且这些列会随着容器宽度的变化而自动增减。

## 实际应用示例

### 经典的三栏布局

\```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-areas: 
    "header header header"
    "nav content sidebar"
    "footer footer footer";
  min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.content { grid-area: content; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }
\```

### 照片画廊

\```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 10px;
}

.gallery-item:nth-child(3n) {
  grid-column: span 2;
}
\```

## 浏览器支持

CSS Grid现在已经被所有主流浏览器支持，包括Chrome、Firefox、Safari、Edge和Opera的最新版本。

## 结论

CSS Grid是一个强大的布局工具，它彻底改变了我们设计网页布局的方式。虽然学习曲线可能有点陡峭，但一旦掌握，它将使复杂的布局变得简单和直观。

希望这篇指南能帮助你开始使用CSS Grid创建令人惊叹的布局！
`,
        tags: ['CSS', 'Grid布局', '前端开发'],
        cover: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
    }
];

// 在首页加载精选文章
document.addEventListener('DOMContentLoaded', function() {
    const featuredPostsContainer = document.getElementById('featured-posts-container');
    if (featuredPostsContainer) {
        // 显示最新的3篇文章
        const featuredPosts = posts.slice(0, 3);
        featuredPosts.forEach(post => {
            const postCard = createPostCard(post);
            featuredPostsContainer.appendChild(postCard);
        });
    }
});