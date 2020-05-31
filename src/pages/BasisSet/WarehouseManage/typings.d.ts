import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { ItemCateData, WholeCountryDataType } from '@/models/global';
import { ConnectProps, Loading } from '@/models/connect';
import { WarehouseModelState } from './models/warehouse';

// 仓库管理属性跟状态
export interface WarehouseListProps extends FormComponentProps {
  dispatch: Dispatch;
  list?: WarehouseModelState[];
  totalRecord?: number;
  loading: Loading;
}

export interface WarehouseListState {
  belongTo?: number;
  buildType?: number;
  pageNum?: number;
  pageSize?: number;
  status?: number;
  warehouseCode?: string;
  warehouseName?: string;
}

// 仓库属性跟状态
export interface WarehouseProps extends FormComponentProps {
  location: Location;
  match: any;
  dispatch: Dispatch;
  data: WarehouseModelState;
  wholeCountry?: WholeCountryDataType;
  itemCates?: ItemCateData[];
}

export interface WarehouseState {
  statusDisabled: boolean;
  lookDisabled: boolean;
  contactFlag: boolean;
  contacting: boolean;
  contactData: any[];
}

// 库区管理属性跟状态
export interface AreasProps extends FormComponentProps {
  dispatch: Dispatch;
  floors?: any[];
  list?: any[];
  totalRecord?: number;
  loading: Loading;
}

export interface AreasState {
  modalVisible: boolean;
  modalId?: string;
  areaCode?: string;
  floorName?: string;
  pageNum?: number;
  pageSize?: number;
  status?: number;
}

// 库位管理属性跟状态
export interface ShelvesProps extends ConnectProps {
  form: FormComponentProps['form'];
  floors?: any[];
  list?: any[];
  totalRecord?: number;
  loading: Loading;
}

export interface ShelvesState {
  modalVisible: boolean;
  modalId?: string;
  areaCode?: string;
  floorId?: string;
  pageNum?: number;
  pageSize?: number;
  status?: number;
}
