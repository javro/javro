import React from 'react';
import { Col, Layout, Menu, Row } from 'antd';
import MonacoEditor from 'react-monaco-editor';
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
  const { json, changeJson, avro, changeAvro } = props;

  const jsonOptions = {
    selectOnLineNumbers: true,
    readOnly: true,
    minimap: {
      enabled: false
    }
  };

  const avroOptions = {
    selectOnLineNumbers: true,
    minimap: {
      enabled: false
    }
  };

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
              <MonacoEditor
                width="90%"
                height="500"
                language="json"
                theme="vs-light"
                options={avroOptions}
                value={avro.value}
                onChange={value => changeAvro(value)}
              />
            </Col>
            <Col span={12}>
              <MonacoEditor
                width="90%"
                height="500"
                language="json"
                theme="vs-light"
                options={jsonOptions}
                value={json.value}
                onChange={value => changeJson(value)}
              />
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
