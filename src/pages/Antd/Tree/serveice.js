import { get } from '@/lib/http';
/**
 * 获取全国省市区数据
 * @return {Promise<any>}
 */
export async function getLocations() {
  return get('/usercenter/location/getLocations');
}
