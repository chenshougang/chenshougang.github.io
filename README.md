# CSG.DEV · 个人技术博客

基于原生 HTML、CSS 和 JavaScript 的静态博客，无构建框架、无后端，直接部署到 GitHub Pages。
视觉风格为深色科技风：粒子网络背景、霓虹渐变、玻璃拟态卡片与滚动入场动画。

---

## 目录

- [快速开始](#快速开始)
- [写文章的完整流程](#写文章的完整流程)
- [文章元信息（front matter）](#文章元信息front-matter)
- [文章索引生成规则](#文章索引生成规则)
- [目录结构](#目录结构)
- [页面与路由](#页面与路由)
- [JavaScript 架构](#javascript-架构)
- [CSS 架构与设计系统](#css-架构与设计系统)
- [自定义站点](#自定义站点)
- [功能清单](#功能清单)
- [第三方依赖（CDN）](#第三方依赖cdn)
- [部署](#部署)
- [常见问题](#常见问题)
- [开发约定](#开发约定)
- [后续计划](#后续计划)

---

## 快速开始

### 环境要求

- 任意现代浏览器
- Windows PowerShell（用于文章索引脚本，Windows 自带）
- 可选：VS Code（已提供任务配置）

### 本地预览

文章通过 `fetch` 读取 Markdown，**直接双击 `index.html` 会因浏览器安全限制无法加载文章**，请使用本地服务器：

```powershell
# 任选一种
python -m http.server 8000
npx http-server -p 8000
```

然后访问 <http://localhost:8000>。
如果你安装了 VS Code 的 **Live Preview** 扩展，也可直接预览（项目已在 `.vscode/settings.json` 中指定入口）。

### 一键写文章（推荐）

在 VS Code 中按 `Ctrl+Shift+P` → `Tasks: Run Task`：

| 任务 | 作用 |
| --- | --- |
| ✍️ 新建文章 | 输入标题、标签，自动生成 Markdown 模板并更新索引 |
| ✍️ 新建文章（仅标题） | 只输入标题 |
| 🔄 生成文章索引 | 手动重建 `js/posts.js`（例如手写了 Markdown 之后） |

---

## 写文章的完整流程

### 方式一：VS Code 任务（最省事）

1. 运行任务 **✍️ 新建文章**，按提示输入标题与标签（标签用逗号分隔，可留空）。
2. 脚本会：
   - 在 `articles/` 下创建 `<slug>.md`；
   - 自动填写 `id`、`slug`、`date`（今天）、`title`、`tags`；
   - 自动运行索引生成，更新 `js/posts.js`。
3. 打开生成的 Markdown 文件写正文，保存。
4. 如果之后修改了 front matter 中的标题 / 日期 / 标签 / 摘要，再运行一次 **🔄 生成文章索引**。
5. 提交并推送：

```powershell
git add .
git commit -m "post: 新文章标题"
git push
```

> 文章正文的修改不需要重新生成索引；只有 **front matter 变化** 才需要。

### 方式二：命令行

```powershell
# 新建（会顺带生成索引）
powershell -ExecutionPolicy Bypass -File tools\new-post.ps1 -Title "C++ 内存模型" -Tags "C++, 并发编程"

# 指定日期 / 子目录 / 自定义 slug
powershell -ExecutionPolicy Bypass -File tools\new-post.ps1 `
  -Title "Boost.Asio 深入" -Tags "C++" -Folder boost -Slug boost-asio-deep -Date 2025-11-09

# 只重建索引
powershell -ExecutionPolicy Bypass -File tools\build-posts.ps1
```

`new-post.ps1` 参数：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `-Title` | 是 | 文章标题 |
| `-Tags` | 否 | 标签，英文或中文逗号分隔 |
| `-Slug` | 否 | 链接别名与文件名，默认由标题生成 |
| `-Date` | 否 | 发布日期，默认今天，格式 `yyyy-MM-dd` |
| `-Excerpt` | 否 | 卡片摘要，留空则自动从正文首段提取 |
| `-Folder` | 否 | 子目录（如 `boost`），默认放在 `articles/` 根目录 |
| `-NoBuild` | 否 | 只创建文件，不生成索引 |

### 方式三：完全手动

1. 在 `articles/`（可建子目录）新建 `.md` 文件。
2. 文件开头写 front matter（见下一节）。
3. 运行 `tools\build-posts.ps1`。
4. 刷新页面。

---

## 文章元信息（front matter）

文件头部的 `---` 块会被索引脚本读取，**并从正文渲染中自动剔除**，不会显示在页面上。

```markdown
---
id: 6
slug: my-new-post
title: 我的新文章
date: 2025-11-09
tags: [C++, 并发编程]
excerpt: 一句话摘要，显示在文章卡片上。
cover: ../images/my-cover.png
---

## 第一节

正文从这开始……
```

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `id` | 建议 | 数字，用于兼容旧链接 `article.html?id=6`。留空时脚本自动分配 |
| `slug` | 建议 | 链接别名，生成 `article.html?post=my-new-post`；默认取文件名 |
| `title` | 建议 | 文章标题，缺失时取正文第一个 `#` 标题，再退回文件名 |
| `date` | 建议 | 发布日期 `yyyy-MM-dd`，缺失时取文件名前缀日期，再退回文件修改时间 |
| `tags` | 否 | `[标签1, 标签2]` 或逗号分隔，不带方括号也可以 |
| `excerpt` | 否 | 卡片摘要，缺失时自动取正文第一段（截断 90 字） |
| `cover` | 否 | 卡片封面图路径；没有则显示自动生成的渐变科技风封面 |

支持的日期写法：`2025-11-09`、`2025/11/9`、`2025.11.09`、`20251109`。

> 中文标题可以正常使用，中文 slug / 文件名同样可用，浏览器会自动进行 URL 编码。若想链接更简洁，请显式指定英文 `slug`。

---

## 文章索引生成规则

`tools/build-posts.ps1` 会扫描 `articles/**/*.md`（忽略以下划线 `_` 开头的文件），生成 `js/posts.js`：

- 按日期 **倒序** 输出（最新在前）
- `id`：优先使用 front matter；缺失或重复时从现有最大 id + 1 开始分配
- `slug`：重复时自动追加 `-2`、`-3`……
- `file`：自动转换为相对 `pages/` 的路径，如 `../articles/boost/BoostAsio.md`
- 输出编码：UTF-8（无 BOM），可直接被浏览器加载

**请勿手动编辑 `js/posts.js`**，每次运行都会被覆盖。

---

## 目录结构

```
chenshougang.github.io/
├── index.html                 # 首页：英雄区 / 最新文章 / 技术栈
├── pages/
│   ├── articles.html          # 文章列表：搜索 + 标签筛选
│   ├── article.html           # 文章详情模板
│   └── about.html             # 关于页
├── articles/                  # Markdown 文章（唯一内容来源）
│   ├── Efficiency.md
│   ├── DesignPattern.md
│   ├── ReactHooks.md
│   ├── 线程池.md
│   └── boost/
│       └── BoostAsio.md
├── css/
│   ├── style.css              # 入口，@import 各模块
│   ├── variables.css          # 设计令牌（颜色 / 尺寸 / 字体 / 动画）
│   ├── base.css               # 重置、排版、滚动条、焦点样式
│   ├── layout.css             # 容器、导航、Hero、区块标题、页脚
│   ├── components.css         # 卡片、按钮、标签、搜索、筛选、Toast
│   ├── pages.css              # 文章详情 / 列表 / 关于页
│   ├── effects.css            # 背景层、入场动画、关键帧
│   └── responsive.css         # 响应式媒体查询
├── js/
│   ├── main.js                # 主题、卡片渲染、阅读进度、回到顶部
│   ├── posts.js               # 文章索引（自动生成，勿手改）
│   ├── articles.js            # 列表页：搜索、筛选、渲染
│   ├── article.js             # 详情页：Markdown、目录、复制、阅读时长
│   └── effects.js             # 粒子背景、滚动动画、打字机、跑马灯
├── tools/
│   ├── new-post.ps1           # 新建文章模板 + 自动更新索引
│   └── build-posts.ps1        # 扫描 Markdown 生成 js/posts.js
├── .vscode/
│   ├── settings.json
│   └── tasks.json             # 文章相关任务
└── README.md                  # 项目说明与写作指南（唯一文档）
```

---

## 页面与路由

| 页面 | 地址 | 说明 |
| --- | --- | --- |
| 首页 | `index.html` | 最新 3 篇（按日期排序）、文章/标签/年限统计、技术栈跑马灯 |
| 文章列表 | `pages/articles.html` | 关键词搜索、标签筛选、结果计数，按日期倒序 |
| 文章详情 | `pages/article.html?post=<slug>` | 推荐链接格式 |
| 文章详情（旧） | `pages/article.html?id=<id>` | 保留兼容，自动回退查找 |
| 关于 | `pages/about.html` | 个人介绍、技能、时间线、联系方式 |

文章链接由 `createPostCard()` 统一生成，优先使用 `slug`。

---

## JavaScript 架构

所有脚本为普通 `<script>`（非模块），按页面在 `</body>` 前依次引入，共享全局作用域。

### `js/main.js` — 通用层

| 函数 | 作用 |
| --- | --- |
| `escapeHtml(value)` | 渲染卡片前转义文章数据 |
| `formatDate(dateString)` | `2025-11-04` → `2025年11月4日` |
| `getAllTags(posts)` | 提取去重标签，用于筛选按钮 |
| `createPostCard(post)` | 生成文章卡片 DOM（封面 / 编号 / 标签 / 链接） |
| `applyTheme / initTheme` | 主题应用与切换，写入 `localStorage.theme` |
| `initReadingProgress` | 顶部阅读进度条 |
| `initBackToTop` | 回到顶部按钮 |
| `initSearch` | 搜索框输入监听，调用列表页的 `filterPosts()` |
| `initFilter` / `filterPosts` | 占位实现，由 `articles.js` 覆盖 |

### `js/articles.js` — 列表页

- `renderFilterTags()`：生成“全部 + 各标签”按钮
- `filterPosts()`：按标签与关键词（标题 / 摘要 / 标签）筛选并渲染
- `updateResultCount(count)`：更新 `// 共 N 篇 / TOTAL N`

### `js/article.js` — 详情页

| 函数 | 作用 |
| --- | --- |
| `loadMarkdownContent(path)` | `fetch` 加载 Markdown，带绝对路径回退 |
| `stripFrontMatter(md)` | 去除头部 front matter |
| `renderMarkdown(md, title)` | Marked 渲染、Highlight.js 高亮、标题锚点去重、外链新窗口、代码复制按钮 |
| `renderTOC(toc)` | 生成右侧目录（h1–h3，过滤与标题重复的 h1） |
| `initTOCScrollSpy(items)` | 滚动时高亮当前章节 |
| `estimateReadingMinutes(md)` | 阅读时长：中文 350 字/分钟 + 英文 200 词/分钟 |
| `copyText` / `showToast` | 复制代码与提示气泡 |
| `initArticle()` | 解析 `?post=` / `?id=`，填充元信息并渲染 |

### `js/effects.js` — 视觉动态

- `initCanvas()`：粒子网络背景，节点数随视口变化（上限 88），鼠标连线，DPR 上限 2，切页/隐藏时暂停
- 滚动入场：`IntersectionObserver` + `.reveal`，新渲染的卡片通过 `MutationObserver` 自动接入
- `initSpotlight()`：卡片跟随鼠标的聚光高亮
- `initHeader()`：滚动后给导航栏加 `.scrolled`
- `initTypewriter()`：首页副标题轮播打字
- `initMarquee()`：复制技术栈内容实现无缝滚动
- `animateCount(el)`：统计数字滚动

以上效果均尊重系统 `prefers-reduced-motion` 设置。

### 数据流

```
articles/*.md (front matter)
        │  tools/build-posts.ps1
        ▼
    js/posts.js  ──►  首页 / 列表页 / 详情页
```

---

## CSS 架构与设计系统

`css/style.css` 通过 `@import` 按顺序加载各模块，**修改样式请改对应模块**，不要写进 `style.css`。

### 设计令牌（`variables.css`）

深色为默认主题，浅色通过 `[data-theme="light"]` 覆盖：

| 变量 | 用途 |
| --- | --- |
| `--primary-color` | 青蓝 `#22d3ee`（浅色主题 `#0891b2`） |
| `--secondary-color` | 紫罗兰 `#a855f7` |
| `--accent-color` | 品红强调色 |
| `--background-color` | 页面背景 |
| `--card-background` | 玻璃面板背景（半透明 + backdrop-filter） |
| `--border-color` / `--border-strong` | 常规 / 高亮边框 |
| `--glow-primary` / `--glow-secondary` | 霓虹光晕阴影 |
| `--gradient-primary` / `--gradient-text` | 主渐变与文字渐变 |
| `--font-sans` / `--font-mono` | 正文 / 等宽字体（系统字体，无外链） |
| `--radius-*`、`--transition-*` | 圆角与过渡 |

### 模块职责

- `base.css`：重置、链接、滚动条、`:focus-visible`、选中文字
- `layout.css`：容器、吸顶导航、Hero、区块标题、技术栈、页脚
- `components.css`：主题按钮、文章卡片、按钮、标签、搜索、筛选、空状态、进度条、回到顶部、复制按钮、Toast
- `pages.css`：文章正文排版（标题条、引用、表格、代码块）、目录、关于页、时间线
- `effects.css`：固定背景层（Canvas + 网格 + 暗角）、页面进入、滚动入场、关键帧、减少动效
- `responsive.css`：1024 / 768 / 480 / 1600px 断点

### 动效与无障碍

- 入场动画仅在 `html.js-reveal` 存在时启用，禁用 JS 不会隐藏内容
- `prefers-reduced-motion: reduce` 下关闭动画、隐藏 Canvas
- 焦点样式统一使用 `:focus-visible`
- 卡片聚光、悬停浮起、主题切换均有过渡

---

## 自定义站点

### 站名与导航

- Logo / 站名：各 HTML 中的 `.site-title`
- 浏览器标题与描述：各 HTML 的 `<title>`、`<meta name="description">`
- 导航项：各 HTML 的 `nav ul`

### 首页文案

- 大标题：`index.html` → `.hero-title`
- 打字机副标题：`index.html` → `#info` 的 `data-typewriter`，用 `|` 分隔多句
- 状态徽标：`.hero-badge`
- 技术栈：`.tech-track` 内的 `.tech-chip`（脚本会自动复制一份实现无缝滚动）

### 个人信息

编辑 `pages/about.html`：头像文字（`.about-avatar`）、职位（`.about-role`）、技能芯片、时间线、联系卡片。
页脚社交链接在各 HTML 的 `.footer-links` 中。

### 配色与字体

全部集中在 `css/variables.css`，改 `:root` 与 `[data-theme="light"]` 即可，无需改动其他文件。

### 视觉参数

| 效果 | 位置 |
| --- | --- |
| 粒子数量 / 连线距离 | `js/effects.js` → `initCanvas()` 的 `count`、`LINK_DIST`、`MOUSE_DIST` |
| 打字速度 / 停留时间 | `js/effects.js` → `initTypewriter()` 中的 `setTimeout` 毫秒数 |
| 入场动画距离与时长 | `css/effects.css` → `.js-reveal .reveal` |
| 卡片悬停位移 | `css/components.css` → `.post-card:hover` |
| 高亮主题 | 各 HTML 的 highlight.js 样式表链接 |

### 关闭全部背景动效

删除各页面底部的 `<script src=".../effects.js"></script>`，或在系统中开启“减少动态效果”。

---

## 功能清单

- 深色科技风视觉，浅色主题可切换（默认深色，偏好持久化）
- Canvas 粒子网络背景，主题自适应、鼠标交互、页面隐藏时暂停
- 首页 Hero：渐变标题、打字机副标题、行动按钮、文章/标签/年限统计
- 文章卡片：编号、主标签、悬停聚光 + 浮起 + 渐变描边、入场动画
- 文章列表：实时搜索、标签筛选、结果计数、日期倒序
- 文章详情：Markdown 渲染、代码高亮 + 一键复制、外链新窗口
- 目录导航：自动生成、滚动高亮、桌面侧边栏 / 移动端置顶
- 阅读体验：阅读进度条、阅读时长估算、回到顶部
- 响应式：桌面三列 / 平板两列 / 手机单列，无横向溢出
- 无障碍：减少动效支持、键盘焦点可见、语义化标签
- 文章工作流：front matter + 自动索引生成 + VS Code 任务

---

## 第三方依赖（CDN）

| 资源 | 地址 |
| --- | --- |
| Marked（Markdown） | `https://cdn.jsdelivr.net/npm/marked@9.0.0/marked.min.js` |
| Highlight.js（浏览器构建） | `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/highlight.min.js` |
| 代码高亮主题 | `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.8.0/build/styles/atom-one-dark.min.css` |
| Font Awesome 6.4 | `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css` |

> 注意：不要使用 `highlight.js` npm 包里的 `lib/core.min.js` 或 `lib/languages/*.js`，它们是 CommonJS 模块，浏览器会报 `module is not defined`。请使用上面的 `cdn-release/build/highlight.min.js`。
> 若所在网络无法访问 jsDelivr，可将上述文件下载到本地 `vendor/` 目录并改为相对路径引用。

---

## 部署

1. 推送到 GitHub 仓库（确保 **同时提交 `js/posts.js`**）。
2. 仓库 `Settings → Pages` → Source 选择分支（如 `main`）与根目录。
3. 等待 Pages 构建完成。

注意事项：

- GitHub Pages 区分大小写，`file` 路径必须与真实文件名完全一致。
- 中文文件名可用，浏览器会自动 URL 编码；链接建议使用英文 `slug`。
- 部署的是静态文件，不需要在服务器上运行 PowerShell 脚本；索引在本地生成后提交即可。

---

## 常见问题

### 文章详情页显示“文章内容加载失败”

1. 用本地服务器访问，而不是 `file://` 直接打开；
2. 检查 `js/posts.js` 中对应 `file` 路径与实际文件名大小写；
3. 检查文章是否真的存在于 `articles/` 目录。

### 新文章没有出现在列表里

先运行 **🔄 生成文章索引**（或 `tools\build-posts.ps1`），确认 `js/posts.js` 中包含该文章；浏览器强刷（`Ctrl+F5`）。

### 卡片摘要 / 标题不对

front matter 中的 `title`、`excerpt` 优先于正文；修改后需要重新生成索引。
未写 `excerpt` 时取正文第一段（自动截断 90 字）。

### 代码没有高亮

确认页面引入了 `cdn-release/build/highlight.min.js`，并且 `<pre><code>` 由 Markdown 生成。

### 图标不显示

Font Awesome CDN 未加载。可下载到本地 `vendor/` 后改为相对路径。

### 想换代码高亮配色

把各 HTML 中的 `atom-one-dark.min.css` 换成同目录下其他主题，如 `github-dark.min.css`、`monokai.min.css`、`dracula.min.css`。

### 修改了 front matter 但页面没变化

索引是静态文件，必须重新运行生成脚本并刷新；必要时清理浏览器缓存。

### 如何删除一篇文章

删除对应 `.md` 文件 → 重新生成索引。旧的分享链接会显示“文章不存在”。

---

## 开发约定

1. **内容只写在 `articles/` 的 Markdown 中**，不要手改 `js/posts.js`。
2. front matter 与正文之间保留一个空行。
3. 标题层级建议从 `##` 开始（正文大标题可省略，页面会使用 `title`）；`h1–h3` 会进入目录。
4. 文章图片建议放在 `articles/images/` 或独立目录，使用相对路径。
5. 样式改动写到对应 CSS 模块，不直接写行内样式。
6. 新功能若涉及文章数据，先确认 `build-posts.ps1` 是否会保留该字段。
7. PowerShell 脚本使用 UTF-8 **带 BOM** 保存（Windows PowerShell 5.1 需要，否则中文注释会破坏解析）。

---

## 后续计划

- [ ] 归档页（按年份 / 标签聚合）
- [ ] RSS 订阅
- [ ] Giscus 评论
- [ ] 站点统计
- [ ] 文章封面图自动生成
- [ ] 全文搜索索引（本地 JSON）
- [ ] 写作时自动重建索引（文件监听）
