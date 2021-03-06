import { IRoute } from 'umi-types';

const routes: IRoute[] = [
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            exact: true,
            path: '/home',
            name: '首页',
            icon: 'home',
            component: './Home',
          },
          {
            path: '/basisset',
            name: '基础设置',
            icon: 'setting',
            routes: [
              {
                exact: true,
                path: '/basisset/warehousemanage/list',
                name: '仓库管理',
                component: './BasisSet/WarehouseManage/WarehouseList',
              },
              {
                exact: true,
                hideInMenu: true,
                path: '/basisset/warehousemanage/create',
                name: '新建仓库',
                component: './BasisSet/WarehouseManage/Warehouse',
              },
              {
                exact: true,
                hideInMenu: true,
                path: '/basisset/warehousemanage/look/:id',
                name: '查看仓库',
                component: './BasisSet/WarehouseManage/Warehouse',
              },
              {
                exact: true,
                hideInMenu: true,
                path: '/basisset/warehousemanage/edit/:id',
                name: '编辑仓库',
                component: './BasisSet/WarehouseManage/Warehouse',
              },
              {
                exact: true,
                path: '/basisset/areamanage/list',
                name: '库区管理',
                component: './BasisSet/WarehouseManage/Areas',
              },
              {
                exact: true,
                hideInMenu: true,
                path: '/basisset/shelvesmanage/list/:areaId',
                name: '库位管理',
                component: './BasisSet/WarehouseManage/Shelves',
              },
              {
                exact: true,
                hideInMenu: true,
                path: '/basisset/test/list',
                name: '库位管理',
                component: './BasisSet/Test/List',
              },
              {
                exact: true,
                hideInMenu: true,
                path: '/basisset/containermanage/list',
                name: '容器管理',
                component: './BasisSet/ContainerManage/List',
              },
            ],
          },
          {
            path: '/goodsmanage',
            name: '商品管理',
            icon: 'database',
            routes: [
              {
                exact: true,
                path: '/goodsmanage/dagamanage/list',
                name: '商品资料管理',
                component: './GoodsManage/DataManage/List',
              },
            ]
          },
          {
            path: '/my',
            name: '我的',
            icon: 'setting',
            routes: [
              {
                exact: true,
                path: '/my/warehousemanagement/list',
                name: '仓库管理',
                component: './My/WarehouseManagement/List',
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
          },
          {
            component: './404',
          }
        ]
      }
    ]
  }
];

export default routes;
