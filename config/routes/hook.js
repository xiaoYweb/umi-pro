const routes = [
  {
    path: '/hook',
    name: 'hooks',
    icon: 'setting',
    routes: [
      {
        path: '/hook/instorage',
        name: '采购入库单',
        component: './Hook/InStorage',
      },
      {
        component: './404',
      }
    ]
  }
]

export default routes;
