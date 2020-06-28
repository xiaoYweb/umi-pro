import React from 'react';
import {
  Form,
  // Input, 
  InputNumber
} from 'antd';
import { EditableContext } from './EditableRow';


class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      console.log('values', values)
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  updateState = values => {
    const { record, handleSave } = this.props;
    handleSave({ ...record, ...values });
  }

  validator = (rule, value, callback) => {
    try {
      const { getFieldsValue } = this.form;
      this.updateState(getFieldsValue())
    } catch (err) {
      console.log('err, -----', err)
    }
    // console.log("validator -> rule, value", rule, `--${value}--`, typeof value)
    if (value === 0) return callback('调整数必须为-9999 至 9999 的非 0 整数')
    if (!value) return callback('必填项')
    return callback()
  }

  static contextType = EditableContext

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            { validator: this.validator }
          ],
          initialValue: record[dataIndex],
        })(
          // <Input ref={node => {
          //   this.input = node
          //   return node
          // }} onPressEnter={this.save} onBlur={this.save} />
          <InputNumber
            max={9999}
            min={-9999}
            ref={node => {
              this.input = node
              return node
            }}

            onPressEnter={this.save} onBlur={this.save}
          />

        )}
      </Form.Item>
    ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    console.log(restProps)
    return (
      <td {...restProps}>
        {
          editable
            ? (<EditableContext.Consumer>
              {this.renderCell}
            </EditableContext.Consumer>)
            : children
        }
      </td>
    );
  }
}

export default EditableCell;
