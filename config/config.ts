import { IConfig } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import pageRoutes from './router.config';
import path from 'path';

const { pwa } = defaultSettings;

// ref: https://umijs.org/config/
const config: IConfig =  {
  treeShaking: true,
  history: 'hash',
  outputPath: './dist',
  hash: false,
  targets: {
    ie: 9,
  },
  routes: pageRoutes,
  alias: {
    '@': path.resolve(__dirname, '../src'),
  },
  plugins: [
    ['umi-plugin-antd-icon-config', {}],
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      locale: {
        default: 'zh-CN',
        antd: true,
        baseNavigator: false,
        baseSeparator: '-',
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      title: '辛橙仓库管理系统',
      dll: true,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  manifest: {
    basePath: '/',
  },
  define: {
    'process.env.APP_ENV': 'development',
  },
};

export default config;
