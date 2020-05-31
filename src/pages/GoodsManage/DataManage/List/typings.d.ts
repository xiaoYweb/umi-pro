import { FormComponentProps } from 'antd/es/form';
import { ConnectProps, Loading } from '@/models/connect';
import { Dispatch } from 'redux';

export interface GoodsDataManageState {
  belongTo?: number;
  buildType?: number;
  pageNum?: number;
  pageSize?: number;
  status?: number;
  warehouseCode?: string;
  warehouseName?: string;
}
 
export interface GoodsDataManageProps extends ConnectProps{
  dispatch: Dispatch;
  form: FormComponentProps['form'];
  loading: Loading;
  list?: any[];
  totalRecord?: number;
}
