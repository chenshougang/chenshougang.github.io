/**
 * 文章数据配置文件
 * 在这里添加、修改或删除文章
 * 
 * 每篇文章的结构：
 * {
 *   id: 数字,           // 文章唯一标识符（必须唯一且递增）
 *   excerpt: "摘要",     // 文章摘要（显示在卡片上）
 *   title: "标题",       // 文章标题
 *   date: "2024-01-15", // 发布日期（格式：YYYY-MM-DD）
 *   tags: ["标签1", "标签2"], // 文章标签
 *   file: "../articles/文件名.md" // Markdown 文件路径
 * }
 */

const posts = [
    {
        id: 1,
        excerpt: "Boost.Asio介绍",
        title: "Boost.Asio介绍",
        date: "2023-10-01",
        tags: ["C++", "网络编程"],
        file: "../articles/Boost.Asio.md"
    },
    {
        id: 2,
        excerpt: "学习React Hooks",
        title: "学习React Hooks",
        date: "2023-10-01",
        tags: ["React", "前端"],
        file: "../articles/ReactHooks.md"
    },
    {
        id: 3,
        excerpt: "关于效率的思考",
        title: "关于效率的思考",
        date: "2025-11-02",
        tags: ["个人成长"],
        file: "../articles/Efficiency.md"
    },
    {
        id: 4,
        excerpt: "设计模式介绍和案例",
        title: "设计模式",
        date: "2025-11-02",
        tags: ["C++", "设计模式"],
        file: "../articles/DesignPattern.md"
    },
    {
        id: 5,
        excerpt: "线程池介绍一级具体场景下的使用方法",
        title: "线程池",
        date: "2025-11-04",
        tags: ["C++", "并发编程"],
        file: "../articles/线程池.md"
    }
];

/**
 * 添加新文章的步骤：
 * 
 * 1. 在 articles/ 目录下创建新的 Markdown 文件
 *    例如：articles/MyNewArticle.md
 * 
 * 2. 在上面的 posts 数组中添加一个新对象
 *    {
 *      id: 6,  // 确保 ID 是唯一且递增的
 *      excerpt: "文章摘要",
 *      title: "文章标题",
 *      date: "2024-01-15",
 *      tags: ["标签1", "标签2"],
 *      file: "../articles/MyNewArticle.md"
 *    }
 * 
 * 3. 保存文件，刷新页面即可看到新文章！
 * 
 * 提示：你也可以使用 tools/add-post.js 中的辅助工具来交互式添加文章
 */
