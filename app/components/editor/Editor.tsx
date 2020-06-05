import fs from 'fs';
import React from 'react';
import { Col, Layout, message, Row, Tag } from 'antd';
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
import ErrorFeedback from '../error-feedback/ErrorFeedback';

const { Header, Content } = Layout;

type Props = {
  avro: {
    isInError: boolean;
    errorMessage: string | null;
    value: { str: string; parsed: object | null; sourceMap: SourceMap | null };
    position: { line: number; column: number } | null;
    pristine: boolean;
  };
  json: {
    value: { str: string; parsed: object | null; sourceMap: SourceMap | null };
  };
  changeJson: (value: string) => void;
  changeAvro: (value: string) => void;
  changeAvroPristine: (value: boolean) => void;
  avroMouseMove: (position: { line: number; column: number }) => void;
  editing: {
    path: string | null;
  };
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

export default class Editor extends React.Component<
  Props,
  { errors: EditorError[] }
> {
  static defaultProps = {
    avro: {
      isInError: false,
      value: { str: '', parsed: null, sourceMap: null },
      errorMessage: null,
      position: null,
      pristine: true
    },
    json: {
      value: { str: '', parsed: null, sourceMap: null }
    },
    changeJson: () => {},
    changeAvro: () => {},
    changeAvroPristine: () => {},
    avroMouseMove: () => {}
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      errors: []
    };
  }

  saveAvro(path: string | null, value: string) {
    if (path) {
      fs.writeFileSync(path, value);
      message.success('File is saved');
      this.props.changeAvroPristine(true);
    }
  }

  render() {
    const {
      avro,
      changeAvro,
      json,
      editing,
      changeJson,
      avroMouseMove
    } = this.props;
    const { errors } = this.state;

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
                  <h3 style={{ color: COLORS.DARK_BLUE }}>
                    Avro&nbsp;
                    {editing.path && !avro.pristine && (
                      <Tag color="purple">Editing mode</Tag>
                    )}
                  </h3>

                  <div className={classNames.codeEditor}>
                    <CodeEditor
                      value={avro.value.str}
                      onValueChange={value => changeAvro(value)}
                      onMouseMove={position => {
                        avroMouseMove(position);
                      }}
                      onError={messages => {
                        this.setState({ errors: messages });
                      }}
                      onSave={() => {
                        this.saveAvro(
                          this.props.editing.path,
                          this.props.avro.value.str
                        );
                      }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <h3 style={{ color: COLORS.DARK_BLUE }}>JSON</h3>

                  <div className={classNames.codeEditor}>
                    <CodeEditor
                      selection={jsonSelection}
                      value={json.value.str}
                      onValueChange={value => changeJson(value)}
                      monacoOptions={{ readOnly: true }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Content>
          <ErrorFeedback
            isInError={avro.isInError || errors.length > 0}
            avroError={avro.errorMessage}
            editorErrors={errors}
          />
        </Layout>
      </>
    );
  }
}
