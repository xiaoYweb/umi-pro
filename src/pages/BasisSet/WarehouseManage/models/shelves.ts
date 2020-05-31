import { Effect } from 'dva';
import { Reducer } from 'redux';
import {
  turnoffLocation, deleteLocation, getLocationList,
} from '@/services/warehouse';
import Toast from '@/lib/Toast';

export interface ShelvesModelState {
  list: any[];
  totalRecord: number;
}

export interface ShelvesModelType {
  namespace: 'shelves';
  state: ShelvesModelState;
  effects: {
    onOffShelves: Effect;
    delShelves: Effect;
    saveShelves: Effect;
    fetchShelvesList: Effect;
  };
  reducers: {
    changeStatus: Reducer<ShelvesModelState>;
    saveData: Reducer<ShelvesModelState>;
  };
}

const ShelvesModel: ShelvesModelType = {
  namespace: 'shelves',

  state: {
    list: [],
    totalRecord: 0,
  },

  effects: {
    *onOffShelves({ payload }, { call, put }) {
      const {
        status,
        entry,
        message,
      }: any = yield call(turnoffLocation, payload.id, payload.on);
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
    *delShelves({ payload, pagePayload }, { call, put }) {
      const { status, entry, message }: any = yield call(deleteLocation, payload);
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
    *saveShelves({ payload, callback }, { call }) {
      const { status, entry, message }: any = yield call(deleteLocation, payload);
      if (status && entry) {
        Toast.success('保存成功');
        callback();
      } else {
        Toast.error(message);
      }
    },
    *fetchShelvesList({ payload }, { call, put }) {
      const {
        status,
        message,
        entry,
        totalRecordSize,
      }: any = yield call(getLocationList, payload);
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

export default ShelvesModel;
