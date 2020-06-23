import moment from 'moment';

export const downloadBlobFile = (data, filename) => {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  });
  const href = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href;
  const date = moment().format('YYYY-MM-DD')
  a.download = `${date}_${filename || 'file'}.xls`; // 自定义文件名
  a.click();
  window.URL.revokeObjectURL(href); // 移除链接对象
}
