import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  base: '/',
  publicPath: '/',
  hash: true,
  define: {
    'process.env.APP_ENV': 'production',
  },
}

export default config;
