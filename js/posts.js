const posts = [
  {
    id: 1,
    excerpt: 'Boost.Asio介绍',
    title: 'Boost.Asio介绍',
    // date: '2023-10-01',
    date: new Date().toISOString().split('T')[0],
    tags: ['C++', '网络编程'],
    file: '../articles/BoostAsio.md'
  },
  {
    id: 2,
    excerpt: '学习React Hooks',
    title: '学习React Hooks',
    // date: '2023-10-01',
    date: new Date().toISOString().split('T')[0],
    tags: ['React', '前端'],
    file: '../articles/ReactHooks.md'
  },
  {
    id: 3,
    excerpt: '关于效率的思考',
    title: '关于效率的思考',
    // date: '2023-10-01',
    date: new Date().toISOString().split('T')[0],
    tags: ['个人成长'],
    file: '../articles/Efficiency.md'
  }
];