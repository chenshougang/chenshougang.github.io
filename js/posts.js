/**
 * 文章索引（自动生成，请勿手动编辑）
 *
 * 写文章：
 *   1. 在 articles/ 下新建 Markdown 文件（可用 tools/new-post.ps1 生成模板）
 *   2. 在文件头部的 front matter 中填写 id / slug / title / date / tags / excerpt
 *   3. 运行 tools/build-posts.ps1 重新生成本文件
 *
 * front matter 示例：
 *   ---
 *   id: 6
 *   slug: my-post
 *   title: 我的文章
 *   date: 2025-11-09
 *   tags: [C++, 并发编程]
 *   excerpt: 一句话摘要
 *   ---
 */

const posts = [
    {
        // id: 5,
        // slug: "thread-pool",
        // title: "线程池",
        // excerpt: "线程池的基本组成，以及具体场景下的使用方式与注意事项。",
        // date: "2025-11-04",
        // tags: ["C++", "并发编程"],
        id: 6,
        slug: "",
        title: "前沿部署工程师",
        date: "2026-11-10",
        tags: ["LLM", "大模型"],
        excerpt: "前沿部署工程师基本介绍",
        file: "../articles/LLM/前沿部署工程师.md"
    },
    {
        id: 5,
        slug: "thread-pool",
        title: "线程池",
        excerpt: "线程池的基本组成，以及具体场景下的使用方式与注意事项。",
        date: "2025-11-04",
        tags: ["C++", "并发编程"],
        file: "../articles/线程池.md"
    },
    {
        id: 4,
        slug: "design-pattern",
        title: "设计模式",
        excerpt: "常见设计模式的介绍与 C++ 场景下的落地案例。",
        date: "2025-11-02",
        tags: ["C++", "设计模式"],
        file: "../articles/DesignPattern.md"
    },
    {
        id: 3,
        slug: "efficiency",
        title: "关于效率的思考",
        excerpt: "工具、流程与注意力管理：如何让每天的产出更稳定。",
        date: "2025-11-02",
        tags: ["个人成长"],
        file: "../articles/Efficiency.md"
    },
    {
        id: 1,
        slug: "boost-asio",
        title: "Boost.Asio 网络编程入门",
        excerpt: "从 io_context 到异步回调，梳理 Boost.Asio 的核心概念与常见用法。",
        date: "2023-10-01",
        tags: ["C++", "网络编程"],
        file: "../articles/boost/BoostAsio.md"
    },
    {
        id: 2,
        slug: "react-hooks",
        title: "学习 React Hooks",
        excerpt: "useState、useEffect 与自定义 Hook 的实践笔记。",
        date: "2023-10-01",
        tags: ["React", "前端"],
        file: "../articles/ReactHooks.md"
    }
];
