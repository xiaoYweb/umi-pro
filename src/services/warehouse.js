// 仓库管理
import config from '@/config';
import { post, requestWithSpin } from '@/lib/http';

function getWhid() {
  return localStorage.getItem(config.WAREHOUSE_ID_KEY);
}

/**
 * 删除仓库
 * @param {string} id
 * @return {Promise<any>}
 */
export async function delWarehouse(id) {
  return post('/wms/public/warehouse/delWarehouse', {
    id,
  });
}

/**
 * 保存仓库信息--新增/更新草稿/不通过的仓库信息
 * @param {object} params
 * @return {Promise<any>}
 */
export async function saveWarehouse(params) {
  return post('/wms/public/warehouse/saveWarehouse', params);
}

/**
 * 更新仓库
 * @param {object} params
 * @return {Promise<any>}
 */
export async function updateWarehouse(params) {
  return post('/wms/public/warehouse/updateWarehouse', params);
}

/**
 * 启用/停用仓库
 * @param {string} id
 * @param {boolean} on
 * @return {Promise<any>}
 */
export async function turnOffWarehouse(id, on) {
  return post('/wms/public/warehouse/updateWarehouseStatus', {
    id,
    status: on ? 'START_USING' : 'STOP_USING',
  });
}

/**
 * 仓库下拉列表
 * @param {object} params
 * @return {Promise<any>}
 */
export async function warehouseComboBox(params) {
  return post('/wms/public/warehouse/warehouseComboBox', params);
}

/**
 * 仓库详情
 * @param {string} id
 * @return {Promise<any>}
 */
export async function warehouseDetail(id) {
  return requestWithSpin('/wms/public/warehouse/warehouseDetail', {
    method: 'POST',
    data: { id },
  });
}

/**
 * 仓库列表（分页）
 * @param {object} params
 * @return {Promise<any>}
 */
export async function warehouseList(params) {
  return post('/wms/public/warehouse/warehouseList', params);
}

/**
 * 钉钉审核回调
 * @param {object} params
 * @return {Promise<any>}
 */
export async function dingCallBack(params) {
  return post('/wms/dingCallBack', params);
}

/**
 * 删除库区
 * @param {string} id
 * @return {Promise<any>}
 */
export async function deleteStore(id) {
  return post('/wms/public/storageArea/delete', { id });
}

/**
 * 楼层详情
 * @return {Promise<any>}
 */
export async function getWarehouseFloors() {
  return post('/wms/public/warehouse/floor', {
    id: getWhid(),
  });
}

/**
 * 库区列表(分页)
 * @param {object} params
 * @return {Promise<any>}
 */
export async function getStoreList(params) {
  return post('/wms/public/storageArea/getOnePage', {
    warehouseId: getWhid(),
    ...params,
  });
}

/**
 * 保存库区
 * @param {object} params
 * @return {Promise<any>}
 */
export async function saveStore(params) {
  return post('/wms/public/storageArea/save', {
    warehouseId: getWhid(),
    ...params,
  });
}

/**
 * 启用/停用库区
 * @param {string} id
 * @param {boolean} on
 * @return {Promise<any>}
 */
export async function turnoffStore(id, on) {
  return post('/wms/public/storageArea/updateStatus', {
    id,
    status: on ? 'VALID' : 'INVALID',
  });
}

/**
 * 启用/停用库位
 * @param {object} params
 * @return {Promise<any>}
 */
export async function turnoffLocation(ids, on) {
  return post('/wms/public/storageLocation/batchUpdateStatus', {
    ids,
    status: on ? 'VALID' : 'INVALID',
  });
}

/**
 * 删除库位
 * @param {object} params
 * @return {Promise<any>}
 */
export async function deleteLocation(id) {
  return post('/wms/public/storageLocation/delete', {
    id,
  });
}

/**
 * 库位列表(分页)
 * @param {object} params
 * @return {Promise<any>}
 */
export async function getLocationList(params) {
  return post('/wms/public/storageLocation/getOnePage', params);
}

/**
 * 批量保存库位 <-已废弃->
 * @param {object} params
 * @return {Promise<any>}
 */
export async function saveBatch(params) {
  return post('/wms/public/storageLocation/saveBatch', params);
}

/**
 * 批量保存库位-前置检查 <-已废弃->
 * @param {object} params
 * @return {Promise<any>}
 */
export async function saveBatchPreCheck(params) {
  return post('/wms/public/storageLocation/saveBatchPreCheck', params);
}
