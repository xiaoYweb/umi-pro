import Toast from '@/lib/Toast';

const WarehouseListModel = {
  namespace: 'goodslist',

  state: {
    list: [
      { key: '1-11', code: '111', name: '衣服', spec: '规格', brand: '品牌1', menufacturersCode: 'xxsdfasfd', barcode: '12981237', }
    ],
    totalRecord: 1,
  },

  effects: {
    *requestList({ payload }, { call, put }) {
      const {
        status,
        message,
        entry,
        totalRecordSize,
      } = yield call(getDate, payload);
      if (status) {
        yield put({
          type: 'updateState',
          payload: {
            list: entry,
            totalRecord: totalRecordSize
          },
        });
        return
      }
      Toast.error(message);
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default WarehouseListModel;

function getDate() {
  const data = [
    { key: '1-11', code: '111', name: '衣服', spec: '规格', brand: '品牌1', menufacturersCode: 'xxsdfasfd', barcode: '12981237', price: '998', goodsCategory: '商品类目1', warehouseCategory: '仓库类目1', warehouse: '仓库1', updateTime: '22-22-22' },
    { key: '2-22', code: '222', name: '裤子', spec: '规格', brand: '品牌2', menufacturersCode: 'adadf', barcode: '992981237', price: '298', goodsCategory: '商品类目2', warehouseCategory: '仓库类目1', warehouse: '仓库2', updateTime: '21-2-33' },
  ]
  const exector = resolve => {
    setTimeout(() => {
      resolve({ entry: data, status: true, totalRecordSize: 2 })
    }, 2000)
  }
  return new Promise(exector)
}
