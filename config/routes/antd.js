const routes = [
  {
    path: '/antd',
    name: 'antd',
    icon: 'setting',
    routes: [
      {
        exact: true,
        path: '/antd/select',
        name: 'Select',
        component: './Antd/Select',
      },
      {
        exact: true,
        path: '/antd/input',
        name: 'Input',
        component: './Antd/Input',
      },
      {
        component: './404',
      }
    ]
  },
]

export default routes;
