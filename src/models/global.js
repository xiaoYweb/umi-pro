import { getWholeCountry, getCatesTree } from '@/services/common';
import { warehouseComboBox } from '@/services/warehouse';
import config from '@/config';
import Toast from '@/lib/Toast';

const { WAREHOUSE_ID_KEY } = config;


const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
    warehouseModal: false,
    userWarehouseInfo: {},
  },

  effects: {
    *updateUserAllWarehouses(_, { call, put }) {
      const { status, message, entry } = yield call(warehouseComboBox, {
        pageNum: 1,
        pageSize: 38,
      });
      if (status) {
        yield put({
          type: 'saveUserWarehouses',
          payload: entry,
        });
      } else {
        Toast.error(message);
      }
    },

    *initUserWarehousesInfo(_, { call, put }) {
      const { status, message, entry } = yield call(warehouseComboBox, {
        pageNum: 1,
        pageSize: 38,
      });
      if (status) {
        yield put({
          type: 'saveUserWarehouses',
          payload: entry,
        });
        const whid = localStorage.getItem(WAREHOUSE_ID_KEY);
        if (whid) {
          yield put({
            type: 'changeCurWarehouse',
            payload: whid,
          });
        } else {
          yield put({
            type: 'changeWarehouseModal',
            payload: true,
          });
        }
      } else {
        throw new Error(message || '用户仓库数据获取失败');
      }
    },
     // 获取品类
    *getItemCates(_, { call, put, select }) {
      const { itemCates } = yield select(state => state.global);
      if (itemCates && itemCates.length) {
        return;
      }
      const { status, entry } = yield call(getCatesTree); // 获取品类
      if (status) {
        yield put({
          type: 'saveData',
          payload: {
            itemCates: entry,
          },
        });
      }
    },
    // 获取仓库列表
    *getWholeCountry(_, { call, put, select }) {
      const { wholeCountry } = yield select(
        state => state.global
      );
      if (wholeCountry && wholeCountry.name) {
        return;
      }
      const { status, entry } = yield call(getWholeCountry); // 获取仓库列表
      if (status) {
        yield put({
          type: 'saveData',
          payload: {
            wholeCountry: entry,
          },
        });
      }
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    saveUserWarehouses(state, { payload }) {
      const { userWarehouseInfo } = state;
      return {
        ...state,
        userWarehouseInfo: {
          ...userWarehouseInfo,
          allWarehouses: payload,
        },
      };
    },

    changeLayoutCollapsed(state, { payload }) { // 修改 collapsed: bollean = true / false
      return {
        ...state,
        collapsed: payload,
      };
    },

    changeWarehouseModal(state, { payload }) { // 修改 warehouseModal: bollean = true / false
      return {
        ...state,
        warehouseModal: payload,
      };
    },

    changeCurWarehouse(state, { payload }) {
      const { allWarehouses = [] } = state.userWarehouseInfo;
      const curObj = allWarehouses.find(item => item.id === payload) || {};
       curObj.id && localStorage.setItem(WAREHOUSE_ID_KEY, curObj.id);
      return {
        ...state,
        warehouseModal: false,
        userWarehouseInfo: {
          ...state.userWarehouseInfo,
          curId: curObj.id,
          curWarehouseCode: curObj.warehouseCode,
          curWarehouseName: curObj.warehouseName,
        },
      };
    },
  },

  subscriptions: { // 第一次载入页面 或者 刷新 触发 
    setup({ history, dispatch }) {
      dispatch({ type: 'initUserWarehousesInfo' });
      setTimeout(() => {
        history.listen(({ pathname }) => {
          if (pathname.includes('/basisset/warehousemanage')) {
            dispatch({ type: 'getWholeCountry' }); // 获取仓库列表
            dispatch({ type: 'getItemCates' }); // 获取品类
          }
        });
      }, 0);
    }
  },
};

export default GlobalModel;
