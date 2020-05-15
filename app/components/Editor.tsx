import React from 'react';
import { Col, Layout, Menu, Row } from 'antd';
import styles from './Editor.css';

const { Header, Content } = Layout;

type Props = {
  avro: {
    value: string;
  };
  json: {
    value: string;
  };
  changeJson: (value: string) => void;
  changeAvro: (value: string) => void;
};

export default function Editor(props: Props) {
  const { json, changeJson } = props;

  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Javro</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className={styles['layout-content']}>
          <Row>
            <Col span={12}>
              <h1>JSON</h1>
              <input
                type="text"
                value={json.value}
                onChange={({ target }) => changeJson(target.value)}
              />
            </Col>
            <Col span={12}>
              <p>Bonjour</p>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
