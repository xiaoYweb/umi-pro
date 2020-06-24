const routes = [
  {
    path: '/my',
    name: '我的',
    icon: 'setting',
    routes: [
      {
        exact: true,
        path: '/my/warehousemanagement',
        name: '仓库管理',
        component: './My/WarehouseManagement',
      },
      {
        exact: true,
        path: '/my/warehousemanagement/check/:id',
        component: './My/WarehouseManagement/Detail',
      },
      {
        exact: true,
        path: '/my/warehousemanagement/create',
        component: './My/WarehouseManagement/Detail',
      },
      {
        exact: true,
        path: '/my/warehousemanagement/edit/:id',
        component: './My/WarehouseManagement/Detail',
      },
      {
        component: './404',
      }
    ]
  }
]

export default routes;
