import { Effect } from 'dva';
import { Reducer } from 'redux';
import { warehouseList, turnOffWarehouse, delWarehouse } from '@/services/warehouse';
import Toast from '@/lib/Toast';
import { WarehouseModelState } from './warehouse';

export interface WarehouseListModelState {
  list: WarehouseModelState[];
  totalRecord: number;
}

export interface WarehouseListModelType {
  namespace: 'warehouselist';
  state: WarehouseListModelState;
  effects: {
    turnOffWarehouse: Effect;
    delWarehouse: Effect;
    fetchList: Effect;
  };
  reducers: {
    saveData: Reducer<WarehouseListModelState>;
  };
}

const WarehouseListModel: WarehouseListModelType = {
  namespace: 'warehouselist',

  state: {
    list: [],
    totalRecord: 0,
  },

  effects: {
    *delWarehouse({ payload, pagePayload }, { call, put }) {
      const {
        status, message, entry,
      }: any = yield call(delWarehouse, payload);
      if (status && entry) {
        Toast.success('仓库删除成功');
        yield put({
          type: 'fetchList',
          payload: pagePayload,
        });
      } else {
        Toast.error(message);
      }
    },

    *turnOffWarehouse({ payload, pagePayload }, { call, put }) {
      const {
        status, message, entry,
      }: any = yield call(turnOffWarehouse, payload.id, payload.on);
      if (status && entry) {
        Toast.success(`仓库${payload.on ? '启用' : '停用'}成功`);
        yield put({
          type: 'fetchList',
          payload: pagePayload,
        });
      } else {
        Toast.error(message);
      }
    },

    *fetchList({ payload }, { call, put }) {
      const {
        status,
        message,
        entry,
        totalRecordSize,
      }: any = yield call(warehouseList, payload);
      if (status) {
        yield put({
          type: 'saveData',
          payload: {
            list: entry,
            totalRecord: parseInt(String(totalRecordSize), 10),
          },
        });
      } else {
        Toast.error(message);
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
  },
};

export default WarehouseListModel;
