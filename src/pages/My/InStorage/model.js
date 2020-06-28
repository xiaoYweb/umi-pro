import Toast from '@/lib/Toast';
import {
  getInStorageList,
  getInStorageDetail,
  finishReceive,
  refuseReceive,
  listPrint,
  listExport,
  detailExport
} from '@/services/y/instorage';
import { downloadBlobFile } from '@/lib/utils';

const model = {
  namespace: 'purchase',

  state: {
    list: [],
    total: 0,
    detail: {},
    detialList: [],
    detailTotal: 0,
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
    *requestGetList({ payload }, { call, put }) { // 请求采购入库单 列表
      const {
        entry = [],
        totalRecordSize,
      } = yield call(getInStorageList, payload)
      yield put({ type: 'updateState', payload: { list: entry, total: +totalRecordSize } })
    },

    *requestGetDetail({ payload }, { call, put }) { // 请求采购入库单 详情
      const { entry } = yield call(getInStorageDetail, payload)
      const { totalRecord, detail = {}, ...rest } = entry;
      const detialList = detail?.list || []
      yield put({ type: 'updateState', payload: { detialList, detail: rest, detailTotal: totalRecord } })
    },

    *requestFinishReceive({ payload, success }, { call }) { // 收货完成
      const { entry } = yield call(finishReceive, payload)
      if (!entry) {
        Toast.error('收货失败')
        return
      }
      entry && success()
    },

    *requestRefuseReceive({ payload, success }, { call }) { // 整单拒收
      const { entry } = yield call(refuseReceive, payload)
      if (!entry) {
        Toast.error('拒收失败')
        return
      }
      entry && success()
    },

    *requestListPrint({ payload }, { call }) { // 收货交接单打印
      const { entry } = yield call(listPrint, payload)
      console.log(entry)
    },

    *requestListExport({ payload }, { call }) { // 单据导出
      const res = yield call(listExport, payload)
      downloadBlobFile(res, '采购入库单')
    },

    *requestDetailExport({ payload }, { call }) { // 明细导出
      const res = yield call(detailExport, payload)
      downloadBlobFile(res, '采购入库明细')
    },
  }
}

export default model
