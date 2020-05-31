import { warehouseList } from '@/services/warehouse';
import Toast from '@/lib/Toast';

const ListModel = {
  namespace: 'test',
  state: {
    list: [],
    totalRecord: 0,
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    *requestList({ payload }, { call, put }) {
      const res = yield call(warehouseList, payload)
      const { status, totalRecordSize, entry, message } = res;
      if (status) {
        yield put({
          type: 'updateState',
          payload: { list: entry, totalRecord: +totalRecordSize }
        })
        return
      }
      Toast.error(message);
    }
  }
}

export default ListModel;
