import Toast from './lib/Toast';
import tools from './utils/tools';
import config from './config';

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      // eslint-disable-next-line no-console
      console.error(err.message);
    },
  },
};

export function onRouteChange() {
  Toast.closeAll();
}

const pageQuery = tools.parse(window.location.search);
if (pageQuery.token) {
  window.localStorage.setItem(config.TOKEN_KEY, pageQuery.token);
  const { origin, hash, pathname } = window.location;
  window.location.href = origin + pathname + hash; // 刷新页面
}
