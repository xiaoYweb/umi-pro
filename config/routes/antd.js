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
        exact: true,
        path: '/antd/form',
        name: 'Form',
        component: './Antd/Form',
      },
      {
        exact: true,
        path: '/antd/table',
        name: 'Table',
        component: './Antd/Table',
      },
      {
        component: './404',
      }
    ]
  },
]

export default routes;
