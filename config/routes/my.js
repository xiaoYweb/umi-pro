const routes = [
  {
    path: '/my',
    name: '我的',
    icon: 'setting',
    routes: [
      {
        path: '/my/warehousemanagement',
        name: '仓库管理',
        component: './My/WarehouseManagement',
      },
      {
        path: '/my/warehousemanagement/check/:id',
        component: './My/WarehouseManagement/Detail',
      },
      {
        path: '/my/warehousemanagement/create',
        component: './My/WarehouseManagement/Detail',
      },
      {
        path: '/my/warehousemanagement/edit/:id',
        component: './My/WarehouseManagement/Detail',
      },
      {
        path: '/my/instorage',
        name: '采购入库单',
        component: './My/InStorage',
      },
      {
        hideInMenu: true,
        path: '/my/instorage/detail/:id',
        name: '入库单详情',
        component: './My/InStorage/Detail',
      },
      {
        component: './404',
      }
    ]
  }
]

export default routes;
