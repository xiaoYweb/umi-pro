import { warehouseList, turnoffStore, deleteLocation, updateWarehouse, saveWarehouse, warehouseDetail } from '@/services/warehouse'
import tip from '@/lib/tip';


export default {
  namespace: 'mywarehouse',

  state: {
    list: [],
    total: 0,
    record: null
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
      if (!status) {
        tip.info(message);
        return
      }
      yield put({
        type: 'updateState',
        payload: {
          list: entry,
          total: +totalRecordSize
        }
      })
    },

    *requestWarehouseEnable({ id, success }, { call }) {
      const { status, entry, message } = yield call(turnoffStore, id, true)
      if (!status || !entry) {
        tip.info(message);
        return
      }
      success && success()
    },

    *requestWarehousDisnable({ id, success }, { call }) {
      const { status, entry, message } = yield call(turnoffStore, id, false)
      if (!status || !entry) {
        tip.info(message);
        return
      }
      success && success()
    },

    *requestWarehousRemove({ id, success }, { call }) {
      const { status, entry, message } = yield call(deleteLocation, id)
      if (!status || !entry) {
        tip.info(message);
        return
      }
      success && success()
    },

    *requestUpdateWarehouse({ payload, success }, { call }) {
      const { remark, contactList, id } = payload;
      const { status, entry, message } = yield call(updateWarehouse, {
        remark, contactList, id,
      });
      if (!status || !entry) {
        tip.info(message);
        return
      }
      success && success()
    },

    *requestSaveWarehouse({ payload, success }, { call, put, select }) {
      const data = yield select(
        state => state.warehouse
      );
      if (data && data.id) {
        const { id, status } = data;
        payload = { id, status, ...payload };
        if (!'DRAFT|AUDIT_REJECT'.includes(data.status)) {
          yield put({
            type: 'updateWarehouse',
            payload,
          });
          return;
        }
      }
      const {
        status,
        message,
        entry,
      } = yield call(saveWarehouse, payload);
      if (!status || !entry) {
        tip.info(message);
        return
      }
      success && success()
    },

    *requestWarehouseDetails({ payload, success }, { call }) {
      const {
        status,
        message,
        entry,
      } = yield call(warehouseDetail, payload);
      if (!status || !entry) {
        tip.info(message);
        return
      }
      success && success()
    },
  }

}
