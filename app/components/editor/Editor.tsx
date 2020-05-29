import React, { useState } from 'react';
import { Badge, Col, Layout, Row } from 'antd';
import { SourceMap } from 'json-source-map';
import classNames from './Editor.css';
import CodeEditor, {
  EditorError,
  EditorPosition
} from '../code-editor/CodeEditor';
import getJsonPathFromPosition from '../../services/source-map/get-json-path-from-position';
import avroPathToJsonPath from '../../services/source-map/avro-path-to-json-path';
import logo from './javro-white.png';
import { COLORS } from '../../constants/theme';
import ErrorDrawer from '../error-drawer/ErrorDrawer';

const { Header, Content } = Layout;

type Props = {
  avro: {
    isInError: boolean;
    errorMessage: string | null;
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

function sourceMapPositionValueToMonacoPositionValue(positionValue: number) {
  return positionValue + 1;
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
      line: sourceMapPositionValueToMonacoPositionValue(start.line),
      column: sourceMapPositionValueToMonacoPositionValue(start.column)
    },
    end: {
      line: sourceMapPositionValueToMonacoPositionValue(end.line),
      column: sourceMapPositionValueToMonacoPositionValue(end.column)
    }
  };
}

function getAvroEditorCssClasses(isInError: boolean) {
  return (isInError ? `${classNames.malformed} ` : '') + classNames.codeEditor;
}

export default function Editor(props: Props) {
  const { json, changeJson, avro, changeAvro, avroMouseMove } = props;
  const [errors, setErrors] = useState([] as EditorError[]);

  const jsonSelection =
    (json.value.sourceMap &&
      getPositionFromPath(getJsonPath(avro, json), json.value.sourceMap)) ||
    undefined;

  return (
    <>
      <Header
        style={{ backgroundColor: COLORS.DARK_BLUE, textAlign: 'center' }}
      >
        <img src={logo} style={{ height: '3.5rem' }} alt="Javro Logo" />
      </Header>
      <Layout>
        <Content style={{ padding: '0 50px' }}>
          <div className={classNames.layoutContent}>
            <Row gutter={16}>
              <Col span={12}>
                <Badge count={Math.max(errors.length, avro.isInError ? 1 : 0)}>
                  <h3 style={{ color: COLORS.DARK_BLUE, paddingRight: '10px' }}>
                    Avro
                  </h3>
                </Badge>

                <div
                  className={getAvroEditorCssClasses(
                    avro.isInError && errors.length > 0
                  )}
                >
                  <CodeEditor
                    value={avro.value.str}
                    onValueChange={value => changeAvro(value)}
                    onMouseMove={position => {
                      avroMouseMove(position);
                    }}
                    onError={messages => {
                      setErrors(messages);
                    }}
                  />
                </div>
              </Col>
              <Col span={12}>
                <Badge count={0}>
                  <h3 style={{ color: COLORS.DARK_BLUE }}>JSON</h3>
                </Badge>

                <div className={classNames.codeEditor}>
                  <div
                    style={{
                      position: 'relative',
                      height: 'calc(90vh - 7rem)',
                      overflow: 'hidden'
                    }}
                  >
                    <CodeEditor
                      selection={jsonSelection}
                      value={json.value.str}
                      onValueChange={value => changeJson(value)}
                      monacoOptions={{ readOnly: true }}
                    />
                    <ErrorDrawer
                      isInError={avro.isInError}
                      avroError={avro.errorMessage}
                      editorErrors={errors}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </>
  );
}

Editor.defaultProps = {
  avro: {
    isInError: false,
    value: { str: '', parsed: null, sourceMap: null },
    errorMessage: null,
    position: null
  },
  json: {
    value: { str: '', parsed: null, sourceMap: null }
  },
  changeJson: () => {},
  changeAvro: () => {},
  avroMouseMove: () => {}
} as Props;
