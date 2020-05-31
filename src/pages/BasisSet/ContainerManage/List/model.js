import { getContainerDetail, getContainerList, newContainer, updateContainer, updateContainerStatus, } from '@/services/container';
import Toast from '@/lib/Toast';

const containerListModel = {
  namespace: 'containerlist',

  state: {
    list: [],
    total: 0,
    details: {}
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
    *getContainerDetail({ payload }, { call, put }) {
      const { status, entry, message } = yield call(getContainerDetail, payload)
      if (!status) return Toast.error(message);
      const volume = calcuVolume(entry)// 计算体积 后台没有保存该字段 前段需显示
      const details = { ...entry, volume, id: payload }
      yield put({ type: 'updateState', payload: { details } })
      return undefined
    },

    *getContainerList({ payload }, { call, put }) {
      const { status, entry, totalRecordSize, message } = yield call(getContainerList, payload)

      if (!status) return Toast.error(message)
      yield put({ type: 'updateState', payload: { list: entry, total: +totalRecordSize } })
      return undefined
    },

    *newContainer({ payload, success }, { call }) {
      const { status, message } = yield call(newContainer, payload)
      if (!status) return Toast.error(message);
      success && success()
      return undefined
    },

    *updateContainer({ payload, success }, { call }) {
      const { status, message } = yield call(updateContainer, payload)
      if (!status) return Toast.error(message);
      success && success()
      return undefined
    },

    *updateContainerStatus({ payload: { selectedKeys, onoff }, success }, { call }) {
      const { status, message } = yield call(updateContainerStatus, selectedKeys, onoff)
      if (!status) return Toast.error(message)
      success && success()
      Toast.success(onoff ? '启用成功' : '停用成功')
      return undefined
    },
  }

}

export default containerListModel;

function calcuVolume(info) {
  const { length = 0, width = 0, height = 0 } = info || {};
  return length * width * height;
}
