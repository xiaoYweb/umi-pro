import { warehouseList, turnoffStore, deleteLocation } from '@/services/warehouse'
import tip from '@/lib/tip';


export default {
  namespace: 'mywarehouse',

  state: {
    list: [],
    total: 0
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
    *requestWarehouseList({ payload }, { call, put }) {
      const { status, entry, totalRecordSize, message } = yield call(warehouseList, payload)
      if (!status) return tip.info(message);
      yield put({
        type: 'updateState',
        payload: {
          list: entry,
          total: +totalRecordSize
        }
      })
      return true
    },

    *requestWarehouseEnable({ id, success }, { call }) {
      const { status, entry, message } = yield call(turnoffStore, id, true)
      if (!status || !entry) return tip.info(message);
      success && success()
      return true
    },

    *requestWarehousDisnable({ id, success }, { call }) {
      const { status, entry, message } = yield call(turnoffStore, id, false)
      if (!status || !entry) return tip.info(message);
      success && success()
      return true
    },

    *requestWarehousRemove({ id, success }, { call }) {
      const { status, entry, message } = yield call(deleteLocation, id)
      if (!status || !entry) return tip.info(message);
      success && success()
      return true
    },
  }

}
