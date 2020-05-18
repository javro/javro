import React from 'react';
import { Alert, Col, Layout, Menu, Row } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import styles from './Editor.css';
import schema from './avro-schema.json';

const { Header, Content } = Layout;

type Props = {
  avro: {
    isInError: boolean;
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

  const options = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: {
      enabled: false
    }
  };

  const jsonOptions = {
    ...options,
    readOnly: true
  };

  const avroOptions = {
    ...options
  };

  function editorWillMount(monacoInstance: typeof monacoEditor) {
    monacoInstance.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          fileMatch: ['*'],
          uri: '',
          schema
        }
      ]
    });
  }

  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Javro</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className={styles['layout-content']}>
          <h1>Avro to JSON</h1>
          <Row gutter={16}>
            <Col span={12}>
              <div className={avro.isInError ? styles.malformed : ''}>
                <MonacoEditor
                  width="100%"
                  height="500"
                  language="json"
                  theme="vs-light"
                  options={avroOptions}
                  value={avro.value}
                  editorWillMount={editorWillMount}
                  onChange={value => changeAvro(value)}
                />
              </div>
            </Col>
            <Col span={12}>
              <MonacoEditor
                width="100%"
                height="500"
                language="json"
                theme="vs-light"
                options={jsonOptions}
                value={json.value}
                onChange={value => changeJson(value)}
              />
            </Col>
          </Row>
          <br />
          {avro.isInError && (
            <Alert message="Avro is malformed" type="warning" />
          )}
        </div>
      </Content>
    </Layout>
  );
}
