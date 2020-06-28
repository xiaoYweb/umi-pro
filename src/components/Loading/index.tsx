import React, { PureComponent } from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import styles from './index.less';

export interface LoadingProps {
  loading: boolean | undefined;
}

export interface LoadingState {

}

class Loading extends PureComponent<LoadingProps, LoadingState> {
  render() {
    return (<>
      {
        this.props.loading
        ? <div className={styles['loading-wrap']}>
            <PageLoading />
          </div>
        : null
      }
    </>);
  }
}

export default Loading;
