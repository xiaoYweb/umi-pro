import { Effect } from 'dva';
import { Reducer } from 'redux';
import { saveWarehouse, warehouseDetail, updateWarehouse } from '@/services/warehouse';
import { DataType } from '@/utils/request/HttpRequest';
import Toast from '@/lib/Toast';
import { router } from 'umi';
import { ConnectState } from '@/models/connect';

export interface WarehouseModelState {
  address?: string;
  belongTo?: number;
  buildType?: number;
  categoryList?: any[];
  contactList?: any[];
  contactList2?: any[];
  county?: any[] | string;
  province?: string;
  city?: string;
  street?: string;
  locationVals?: string;
  floorInfo?: any[];
  gmtModified?: number;
  id?: string;
  latitude?: number;
  longitude?: number;
  operatorName?: string;
  modifier?: string;
  remark?: string;
  status?: string;
  supportReturn?: number;
  warehouseCode?: string;
  warehouseName?: string;
}

export interface WarehouseModelType {
  namespace: 'warehouse';
  state: WarehouseModelState;
  effects: {
    updateWarehouse: Effect;
    saveWarehouse: Effect;
    fetchDetails: Effect;
  };
  reducers: {
    saveData: Reducer<WarehouseModelState>;
    clearData: Reducer<WarehouseModelState>;
  };
}

const WarehouseModel: WarehouseModelType = {
  namespace: 'warehouse',

  state: {
  },

  effects: {
    *updateWarehouse({ payload }, { call }) {
      const { remark, contactList, id } = payload;
      const { status, entry, message }: DataType = yield call(updateWarehouse, {
        remark, contactList, id,
      });
      if (status && entry) {
        Toast.success('修改成功');
        setTimeout(() => {
          router.goBack();
        }, 2000);
      } else {
        Toast.error(message);
      }
    },
    *saveWarehouse({ payload }, { call, put, select }) {
      const data: WarehouseModelState = yield select(
        (state: ConnectState) => state.warehouse
      );
      if (data && data.id) {
        const { id, status } = data;
        payload = { id, status, ...payload };
        if (!'DRAFT|AUDIT_REJECT'.includes(data.status as string)) {
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
      }: DataType = yield call(saveWarehouse, payload);
      if (status && entry) {
        Toast.success('保存成功');
        setTimeout(() => {
          router.goBack();
        }, 2000);
      } else {
        Toast.error(message);
      }
    },
    *fetchDetails({ payload }, { call, put }) {
      const {
        status,
        message,
        entry,
      }: DataType = yield call(warehouseDetail, payload);
      if (status) {
        yield put({
          type: 'saveData',
          payload: parseEntry(entry),
        });
      } else {
        Toast.error(message);
      }
    },
  },

  reducers: {
    clearData() {
      return {};
    },
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default WarehouseModel;

function parseEntry(data: WarehouseModelState): WarehouseModelState {
  const { categoryList = [], contactList = [] } = data;
  data.categoryList = categoryList.map((val) => String(val));
  data.contactList = contactList.map((item) => item.userId);
  data.contactList2 = contactList;

  data.county = [
    String(data.province), String(data.city), String(data.county), String(data.street),
  ];
  data.locationVals = `${data.longitude},${data.latitude}`;
  return data;
}
