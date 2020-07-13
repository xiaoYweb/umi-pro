import React from 'react';
import styles from './index.less'

class PromptWrap extends React.PureComponent {
  render() {
    return (<section className={styles['prompt-wrap']}>
      {this.props.children}
    </section>);
  }
}

export default PromptWrap;
