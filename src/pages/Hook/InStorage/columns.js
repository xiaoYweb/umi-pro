import React from 'react';
import { Link } from 'umi';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

function retColumns(handleFinish, handleRefuse) {
  const columns = [
    {
      title: '到货通知单号',
      dataIndex: 'bizBillNo',
      render(res, record) {
        const navUrl = `/my/instorage/detail/${record.id}`;
        return record.id ? <Link to={navUrl}>{res}</Link> : <span>{res}</span>
      }
    },
    { title: '收货入库单号', dataIndex: 'inStorageNo' },
    { title: '货主', dataIndex: 'cargoOwnerName' },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      render(name, { supplierCode, orderType }) {
        let code = '--';
        orderType === 'PURCHASE' && (code = supplierCode)
        orderType === 'TRANSFER' && (code = '发货仓库编码')
        return `${code} ${name}`
      }
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      render(type) {
        return {
          CANCEL: '已取消',
          NOTICE: '已通知',
          RECEIVING: '收货中',
          FINISHED: '已完成',
          REJECT: '已拒收',
        }[type] || '--'
      }
    },
    {
      title: '计划到货时间',
      dataIndex: 'arrivalPlanTime',
      render: timestamp => (timestamp
        ? moment(new Date(timestamp)).format(DATE_FORMAT)
        : '--')
    },
    {
      title: '单据生成时间',
      dataIndex: 'gmtCreate',
      render: timestamp => (timestamp
        ? moment(new Date(timestamp)).format(DATE_FORMAT)
        : '--')
    },
    {
      title: '单据类型',
      dataIndex: 'orderType',
      render(type) {
        return {
          PURCHASE: '采购入库',
          PROXY: '代销入库',
          TRANSFER: '调拨入库',
          CUSTOMER_RETURN: '客退入库'
        }[type] || '--'
      }
    },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      render: ({ id, status }) => {
        return <span>
          {
            status === 'RECEIVING' ? <a onClick={() => handleFinish(id)}>收货完成</a>
              : status === 'NOTICE' ? <a onClick={() => handleRefuse(id)}>整单拒收</a>
                : null
          }
        </span>
      }
    }
  ];

  return columns;
}

export default retColumns;
