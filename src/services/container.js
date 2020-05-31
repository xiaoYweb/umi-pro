// 容器管理
import config from '@/config';
import { post } from '@/lib/http';

function getWhid() {
  return localStorage.getItem(config.WAREHOUSE_ID_KEY);
}

/**
 * 获取容器详情
 * @param {string} id
 * @return {Promise<any>}
 */
export async function getContainerDetail(id) {
  return post('/wms/public/container/getContainerDetail', {
    id,
  });
}

/**
 * 获取容器列表（分页）
 * @param {object} params
 * @return {Promise<any>}
 */
export async function getContainerList(params) {
  return post('/wms/public/container/getContainerList', {
    ...params,
    warehouseId: getWhid(),
  });
}

/**
 * 添加、新建 容器
 * @param {object} params
 * @return {Promise<any>}
 */
export async function newContainer(params) {
  return post('/wms/public/container/saveContainer', {
    ...params,
    warehouseId: getWhid(),
  });
}

/**
 * 更新容器
 * @param {object} params
 * @return {Promise<any>}
 */
export async function updateContainer(params) {
  return post('/wms/public/container/updateContainer', params);
}

/**
 * 启用/停用容器
 * @param {object} params
 * @return {Promise<any>}
 */
export async function updateContainerStatus(idList, on) {
  return post('/wms/public/container/updateContainerStatus', {
    idList,
    status: on ? 'VALID' : 'INVALID',
  });
}