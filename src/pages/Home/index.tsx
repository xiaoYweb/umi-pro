import React from 'react';
import { Card, Typography } from 'antd';
import styles from './index.less';

const { Title, Text } = Typography;

export default (): React.ReactNode => (
  <Card bodyStyle={{ padding: 16 }} bordered={false}>
    <div className={styles.wrapper}>
      <Title>辛橙 WMS 仓库管理系统</Title>
      <Text className={styles.desc} strong>工作台</Text>
    </div>
  </Card>
);
