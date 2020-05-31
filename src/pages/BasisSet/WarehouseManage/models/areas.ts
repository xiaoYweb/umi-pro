import { Effect } from 'dva';
import { Reducer } from 'redux';
import {
  getStoreList, getWarehouseFloors,
  saveStore, turnoffStore, deleteStore,
} from '@/services/warehouse';
import Toast from '@/lib/Toast';

export interface AreasModelState {
  floors?: any[];
  list: any[];
  totalRecord: number;
}

export interface AreasModelType {
  namespace: 'areas';
  state: AreasModelState;
  effects: {
    onOffArea: Effect;
    delArea: Effect;
    saveArea: Effect;
    fetchFloors: Effect;
    fetchAreaList: Effect;
  };
  reducers: {
    changeStatus: Reducer<AreasModelState>;
    saveData: Reducer<AreasModelState>;
  };
}

const AreasModel: AreasModelType = {
  namespace: 'areas',

  state: {
    list: [],
    totalRecord: 0,
  },

  effects: {
    *onOffArea({ payload }, { call, put }) {
      const { status, entry, message }: any = yield call(turnoffStore, payload.id, payload.on);
      if (status && entry) {
        Toast.success(payload.on ? '启用成功' : '停用成功');
        yield put({
          type: 'changeStatus',
          payload,
        });
      } else {
        Toast.error(message);
      }
    },
    *delArea({ payload, pagePayload }, { call, put }) {
      const { status, entry, message }: any = yield call(deleteStore, payload);
      if (status && entry) {
        Toast.success('删除成功');
        yield put({
          type: 'fetchAreaList',
          payload: pagePayload,
        });
      } else {
        Toast.error(message);
      }
    },
    *saveArea({ payload, callback }, { call }) {
      const { status, entry, message }: any = yield call(saveStore, payload);
      if (status && entry) {
        Toast.success('保存成功');
        callback();
      } else {
        Toast.error(message);
      }
    },
    *fetchFloors({ pagePayload }, { call, put }) {
      const { status, entry = [], message }: any = yield call(getWarehouseFloors);
      if (status) {
        yield put({
          type: 'saveData',
          payload: {
            floors: entry.map((name: string) => ({
              key: name,
              tab: name,
            })),
          },
        });
        yield put({
          type: 'fetchAreaList',
          payload: {
            ...pagePayload,
            floorName: entry[0],
          },
        });
      } else {
        Toast.error(message);
      }
    },
    *fetchAreaList({ payload }, { call, put }) {
      const {
        status,
        message,
        entry,
        totalRecordSize,
      }: any = yield call(getStoreList, payload);
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
    changeStatus(state = { list: [], totalRecord: 0 }, { payload }) {
      const list = state.list.map((item: any) => {
        if (item.id === payload.id) {
          return {
            ...item,
            status: payload.on ? 'VALID' : 'INVALID',
          };
        }
        return item;
      });

      return {
        ...state,
        list,
      };
    },
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default AreasModel;
