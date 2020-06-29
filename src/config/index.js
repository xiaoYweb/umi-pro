const env = process.env.APP_ENV; // root/config/ config.ts --- define 决定环境变量

const baseUrl = {
  development: 'https://daily-api.xinc818.com/',
  testing: 'https://daily-api.xinc818.com/',
  production: '/',
}

const authUrl = {
  development: 'https://daily.xinc818.com/',
  testing: 'https://daily.xinc818.com/',
  production: '/',
}

const config = {
  baseUrl: baseUrl[env],
  authUrl: authUrl[env],
  requestTimeout: 6000,
  TOKEN_KEY: '__token_key',
  USER_ID_KEY: '__user_id_key',
  WAREHOUSE_ID_KEY: '__warehouse_id_key',
}

export default config;
