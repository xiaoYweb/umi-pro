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
/**
 *  CANCEL(0, "已取消"),
    NOTICE(1, "已通知"),
    RECEIVING(2, "收货中"),
    FINISHED(3,"已完成");
 */

/**
 * PURCHASE(1, "采购入库"),
   PROXY(2, "代销入库"), // 暂时不做 以删除
   TRANSFER(2, "调拨入库"),
   CUSTOMER_RETURN(3,"客退入库");
 */

/**
 * 收货完成 
 * @param params { inStorageOrderId: '', } 
 */
export async function finishReceive(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/finishedReceiving';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  });
}

/**
 * 整单拒收
 * @param params { inStorageOrderId: '', } 
 */
export async function refuseReceive(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/rejectionAll';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  });
}

/**
 * 
 * @param params {
    "cargoOwnerId": "货主ID",
    "bizBillNo": "DV00000001",  到货通知单号
    "inStorageNo": "POI000001", 收货入库单
    "skuId": "skuID", 商品编码
    "supplierCode": "string",
    "orderType": "1:采购入库,2:调拨入库,3:客退入库",
    "status": "CANCEL", 入库单的状态
    "arrivalPlanTimeBeginTime": "yyyy-MM-dd HH:mm:ss",  计划到货时间
    "arrivalPlanTimeEndTime": "yyyy-MM-dd HH:mm:ss",  计划到货时间
    "createdBeginTime": "yyyy-MM-dd HH:mm:ss",  单据生成时间
    "createdEndTime": "yyyy-MM-dd HH:mm:ss",  单据生成时间
    "pageNum": "1",
    "pageSize": "10",

    "inStorageOrderIds": "1,2,3",
    "warehouseId": 101,
    "operator": 1,
  }
 */
export async function listPrint(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/printed';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  });
}

export async function listExport(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/exportHeaders';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  });
}

export async function detailExport(params: object) {
  const url = '/wms/public/inWare/purchaseInStorageOrder/exportItems';
  return post(url, {
    ...params,
    warehouseId: getWhid(),
  }, 'blob');
}

// 收货装箱单
/**
 * 
 * @param params {
    "inStorageNo": "POI000001",
    "acceptanceNo": "POI000001",
    "skuId": "skuID",
    "pageNum": "1",
    "pageSize": "10",
    
    "warehouseId": 101
    "operator": 1,
  }
 */
export async function getPackageList(params: object) {
  const url = '/wms/public/inWare/acceptance/pageList';
  const option: any = {
    responseType: 'blob'
  }
  return post(url, {
    ...params,
    warehouseId: getWhid(),
    option
  });
}

export async function packageListExport(params: object) {
  const url = '/wms/public/inWare/acceptance/export';
  const option: any = {
    responseType: 'blob'
  }
  return post(url, {
    ...params,
    warehouseId: getWhid(),
    option
  });
}
