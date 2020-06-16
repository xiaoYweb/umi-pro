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
        exact: true,
        path: '/antd/date',
        name: 'DatePicker',
        component: './Antd/DatePicker',
      },
      {
        exact: true,
        path: '/antd/treeselect',
        name: 'TreeSelect',
        component: './Antd/TreeSelect',
      },
      {
        exact: true,
        path: '/antd/autocomplete',
        name: 'AutoComplete',
        component: './Antd/AutoComplete',
      },
      {
        exact: true,
        path: '/antd/cascader',
        name: 'Cascader',
        component: './Antd/Cascader',
      },
      {
        exact: true,
        path: '/antd/tree',
        name: 'Tree',
        component: './Antd/Tree',
      },
      {
        component: './404',
      }
    ]
  },
]

export default routes;
