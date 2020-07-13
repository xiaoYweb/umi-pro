const routes = [
  {
    path: '/test',
    name: 'Test',
    icon: 'setting',
    routes: [
      {
        path: '/test/prompt',
        name: '测试propmt',
        component: './Test/Prompt',
      },
    ]
  }
]

export default routes;
