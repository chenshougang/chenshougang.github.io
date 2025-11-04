# 个人博客网站

这是一个基于HTML、CSS和JavaScript构建的个人博客网站，用于展示个人文章、思考和生活记录。

## 功能特点

- 响应式设计，适配各种设备
- 支持明暗主题切换
- Markdown文章渲染
- 代码高亮显示
- 文章列表和详情页面
- 个人信息展示
- CSS模块化架构，便于维护和扩展

## 目录结构

```
├── articles/       # 存放文章的Markdown文件
├── css/            # 样式文件
│   ├── style.css   # 主样式文件，通过@import导入所有模块
│   ├── variables.css # CSS变量定义文件
│   ├── base.css    # 基础样式文件
│   ├── layout.css  # 布局样式文件
│   ├── components.css # 组件样式文件
│   ├── pages.css   # 页面特定样式文件
│   └── responsive.css # 响应式样式文件
├── js/             # JavaScript文件
│   ├── article.js  # 文章详情页面的脚本
│   ├── articles.js # 文章列表页面的脚本
│   ├── main.js     # 主要脚本文件，包含主题切换等通用功能
│   └── posts.js    # 文章数据和加载逻辑
├── pages/          # HTML页面
│   ├── about.html  # 关于页面
│   ├── article.html# 文章详情页面模板
│   └── articles.html# 文章列表页面
├── posts/          # 博客文章内容
└── index.html      # 网站首页
```

## 文件说明

### HTML文件
- `index.html`: 网站首页，展示最新文章和网站概览
- `pages/about.html`: 关于页面，展示个人信息
- `pages/article.html`: 文章详情页面模板
- `pages/articles.html`: 文章列表页面，展示所有文章

### CSS文件
- `css/style.css`: 主样式文件，通过@import导入所有模块化的CSS文件
- `css/variables.css`: CSS变量定义，包含颜色、尺寸、主题变量等
- `css/base.css`: 基础样式，包含重置、body、链接、图片等基础元素样式
- `css/layout.css`: 布局样式，包含容器、头部、导航、主内容、页脚等布局相关样式
- `css/components.css`: 组件样式，包含卡片、按钮、标签、主题切换等UI组件样式
- `css/pages.css`: 页面特定样式，包含文章详情、文章列表、关于页面等特定页面样式
- `css/responsive.css`: 响应式样式，包含移动端适配的媒体查询样式

### JavaScript文件
- `js/main.js`: 包含网站的核心功能，如主题切换、导航栏等
- `js/posts.js`: 处理文章数据的加载和展示
- `js/article.js`: 处理单篇文章的展示和渲染
- `js/articles.js`: 处理文章列表的展示和分页

### 内容目录
- `articles/`: 存放Markdown格式的文章源文件
- `posts/`: 存放处理后的文章内容

## 使用说明

1. 添加新文章：
   - 在`articles/`目录下创建新的Markdown文件
   - 文章将自动显示在文章列表和首页中

2. 修改样式：
   - 编辑对应的CSS模块文件（如需要修改布局，编辑`css/layout.css`）
   - 主样式文件`css/style.css`会自动导入所有模块

3. 修改功能：
   - 根据需要修改相应的JavaScript文件

4. 部署：
   - 将整个目录部署到Web服务器即可