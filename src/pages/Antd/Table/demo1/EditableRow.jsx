import React from 'react';
import { Form } from 'antd';

export const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => {
  window.cache = { ...window.cache, [Date.now()]: form }
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  )
};

export default Form.create()(EditableRow)
