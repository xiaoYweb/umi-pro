import Toast from '@/lib/Toast';
import { getInStorageList, getInStorageDetail } from '@/services/y/instorage';

const model = {
  namespace: 'purchase',

  state: {
    list: [],
    total: 0,
    detail: {

    }
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  effects: {
    *getList({ payload }, { call, put }) {
      const { status, entry = [], message } = yield call(getInStorageList, payload)
      // const res: any = yield call(getInStorageList, payload)
      if (!status) {
        Toast.error(message)
        return
      }
      yield put({ type: 'updateState', payload: { list: entry, total: entry.length } })
    },

    *getDetail({ payload }, { call, put }) {
      const { status, entry = [], message } = yield call(getInStorageDetail, payload)
      if (!status) {
        Toast.error(message)
        return
      }
      yield put({ type: 'updateState', payload: { detail: entry } })
      
    },
  },
}

export default model;
