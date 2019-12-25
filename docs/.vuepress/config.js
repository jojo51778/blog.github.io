module.exports = {
  title: '前端姿势',
  description: '坐上来自己动',
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置 下面会讲
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    sidebarDepth: 2, // e'b将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
    nav: [
      { text: '前端大杂烩', link: '/JS/' }, // 内部链接 以docs为根目录
      { text: 'GitHub', link: 'https://github.com/jojo51778' }
    ],
    sidebar: [
      {
        title: 'Vue相关',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        children: [
          '/JS/vue/vue-obeserve',
          '/JS/vue/vue-dep',
        ]
      },
      {
        title: 'React相关',   // 必要的
        collapsable: false, 
        children: [
          '/JS/react/hooks',
        ]
      },
      {
        title: '面试葵花宝典',   // 必要的
        collapsable: false, 
        children: [
          '/JS/interview/html',
          '/JS/interview/css',
          '/JS/interview/javascript',
        ]
      },
      {
        title: '手写一个？？？',   // 必要的
        collapsable: false, 
        children: [
          '/JS/handwriting/jswritten',
        ]
      },
      {
        title: '重在积累',   // 必要的
        collapsable: false, 
        children: [
          '/JS/knowledge/30s',
        ]
      },
      {
        title: '网络',   // 必要的
        collapsable: false, 
        children: [
          '/JS/http/tcpip',
          '/JS/http/httpstatus',
          '/JS/http/http',
          '/JS/http/httpsecure',
          '/JS/http/userAuth',
        ]
      },
      // {
      //   title: 'rollup相关',   // 必要的
      //   collapsable: false, 
      //   children: [
      //     '/JS/rollup/rollupStart',
      //   ]
      // },
    ]
  }
}