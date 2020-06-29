import React from 'react';
import ReactToPrint from 'react-to-print';

class Print extends React.PureComponent {
  render() {
    const { 
      children, 
      content 
    } = this.props;

    return (<ReactToPrint
      trigger={() => {
        return children
      }}
      content={() => content}
    />);
  }
}

export default Print;
