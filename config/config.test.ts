import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  base: '/',
  publicPath: '/',
  hash: false,
  define: {
    'process.env.APP_ENV': 'testing',
  },
}

export default config;
