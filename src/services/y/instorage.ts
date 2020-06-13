// 入库
import config from '@/config';
import { post } from '@/lib/http';

function getWhid() {
  return 101 || localStorage.getItem(config.WAREHOUSE_ID_KEY);
}

/**
 * 供应商管理列表（分页）
 * @param {object} params
 * @return {Promise<any>}
 */
/**
 * 
 * {
    "cargoOwnerId": "货主ID",
    "bizBillNo": "DV00000001",  到货通知单号
    "inStorageNo": "POI000001", 收货入库单
    "skuId": "skuID", 商品编码
    "operator": 1,
    "orderType": "1:采购入库,2:调拨入库,3:客退入库",
    "pageNum": "1L",
    "pageSize": "20L",
    "status": "CANCEL", 入库单的状态
    "supplierCode": "string",
    "warehouseId": 101,
    "arrivalPlanTimeBeginTime": "yyyy-MM-dd HH:mm:ss",  计划到货时间
    "arrivalPlanTimeEndTime": "yyyy-MM-dd HH:mm:ss",  计划到货时间
    "createdBeginTime": "yyyy-MM-dd HH:mm:ss",  单据生成时间
    "createdEndTime": "yyyy-MM-dd HH:mm:ss",  单据生成时间
  }
 */
export async function getInStorageList(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/list';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  });
}

/**
 * 
 * @param params // {inStorageOrderId: '入库单Id', operator: '操作人', warehouseId: '仓库id'  }
 */
export async function getInStorageDetail(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/getStorageOrderInfo';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  });
}
