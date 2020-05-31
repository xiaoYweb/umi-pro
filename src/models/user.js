import { queryCurrent, goLogout } from '@/services/user';
import Toast from '@/lib/Toast';
import tools from '@/utils/tools';
import config from '@/config';


const UserModel = {
  namespace: 'user',

  state: {},

  effects: {
    *logout(_, { call, put }) { // 登出 清除 storage 及 redux中的信息
      const { status, message, entry } = yield call(goLogout);
      if (status && entry) {
        tools.clearSession();
        yield put({ type: 'clear' });
      } else {
        Toast.error(message);
      }
    },
    *fetchCurrent(_, { call, put }) { // 获取 个人信息 记录 于 storage(请求参数) 及 redux(显示用户名) 中
      const { status, message, entry } = yield call(queryCurrent);
      if (status) {
        localStorage.setItem(config.USER_ID_KEY, entry.employee.employeeId);
        yield put({
          type: 'saveCurrentUser',
          payload: entry.employee,
        });
      } else {
        Toast.error(message);
      }
    },
  },

  reducers: {
    clear() {
      return {};
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};

export default UserModel;
