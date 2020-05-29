import React from 'react';
import { Alert, Col, Layout, Menu, Row } from 'antd';
import { SourceMap } from 'json-source-map';
import styles from './Editor.css';
import CodeEditor, { EditorPosition } from './code-editor/CodeEditor';
import getJsonPathFromPosition from '../services/source-map/get-json-path-from-position';
import avroPathToJsonPath from '../services/source-map/avro-path-to-json-path';

const { Header, Content } = Layout;

type Props = {
  avro: {
    isInError: boolean;
    value: { str: string; parsed: object | null; sourceMap: SourceMap | null };
    position: { line: number; column: number } | null;
  };
  json: {
    value: { str: string; parsed: object | null; sourceMap: SourceMap | null };
  };
  changeJson: (value: string) => void;
  changeAvro: (value: string) => void;
  avroMouseMove: (position: { line: number; column: number }) => void;
};

function getJsonPath(avro: Props['avro'], json: Props['json']): string {
  if (avro.value.sourceMap && avro.position) {
    const avroPath = getJsonPathFromPosition(
      avro.position,
      avro.value.sourceMap
    );
    if (avroPath) {
      return avroPathToJsonPath(avroPath, avro.value.parsed, json.value.parsed);
    }
  }
  return '';
}

function getPositionFromPath(
  path: string,
  sourceMap: SourceMap
): { start: EditorPosition; end: EditorPosition } | null {
  const sourceMapItem = sourceMap[path];
  if (!sourceMapItem) {
    return null;
  }
  const start =
    sourceMapItem.key !== undefined ? sourceMapItem.key : sourceMapItem.value;
  const end = sourceMapItem.valueEnd;

  return {
    start: {
      line: start.line + 1,
      column: start.column + 1
    },
    end: {
      line: end.line + 1,
      column: end.column + 1
    }
  };
}

export default function Editor(props: Props) {
  const { json, changeJson, avro, changeAvro, avroMouseMove } = props;

  const jsonSelection =
    (json.value.sourceMap &&
      getPositionFromPath(getJsonPath(avro, json), json.value.sourceMap)) ||
    undefined;

  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Javro</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className={styles['layout-content']}>
          <Row gutter={16}>
            <Col span={12}>
              <div className={avro.isInError ? styles.malformed : ''}>
                <CodeEditor
                  value={avro.value.str}
                  onChange={value => changeAvro(value)}
                  onMouseMove={position => {
                    avroMouseMove(position);
                  }}
                />
              </div>
            </Col>
            <Col span={12}>
              <CodeEditor
                selection={jsonSelection}
                value={json.value.str}
                onChange={value => changeJson(value)}
                monacoOptions={{ readOnly: true }}
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

Editor.defaultProps = {
  avro: {
    isInError: false,
    value: { str: '', parsed: null, sourceMap: null },
    position: null
  },
  json: {
    value: { str: '', parsed: null, sourceMap: null }
  },
  changeJson: () => {},
  changeAvro: () => {},
  avroMouseMove: () => {}
} as Props;
