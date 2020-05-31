import { requestWithSpin } from '@/lib/http'

export async function getWholeCountry() { // 获取仓库列表
  return requestWithSpin('usercenter/location/getWholeCountry');
}

export async function getCatesTree() { // 获取品类
  return requestWithSpin('itemcenter/gaea/cates/laser/tree');
}
