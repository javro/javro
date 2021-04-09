import React from 'react';
import { Breadcrumb, Layout, Tag } from 'antd';
import { SourceMap } from 'json-source-map';
import { takeRight } from 'lodash';
import { EditOutlined } from '@ant-design/icons';
import Split from 'react-split';
import classNames from './Editor.module.css';
import CodeEditor, {
  EditorError,
  EditorPosition,
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
    isPristine: boolean;
  };
  json: {
    value: { str: string; parsed: object | null; sourceMap: SourceMap | null };
  };
  changeJson: (value: string) => void;
  changeAvro: (value: string) => void;
  saveAvro: (path: string, value: string) => void;
  avroMouseMove: (position: { line: number; column: number }) => void;
  editing: {
    path: string | null;
  };
};

function getJsonPath(avro: Props['avro']): string {
  if (avro.value.sourceMap && avro.position) {
    const avroPath = getJsonPathFromPosition(
      avro.position,
      avro.value.sourceMap
    );
    if (avroPath) {
      return avroPathToJsonPath(avroPath, avro.value.parsed);
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
      column: sourceMapPositionValueToMonacoPositionValue(start.column),
    },
    end: {
      line: sourceMapPositionValueToMonacoPositionValue(end.line),
      column: sourceMapPositionValueToMonacoPositionValue(end.column),
    },
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
      isPristine: true,
    },
    json: {
      value: { str: '', parsed: null, sourceMap: null },
    },
    changeJson: () => {},
    changeAvro: () => {},
    saveAvro: () => {},
    avroMouseMove: () => {},
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      errors: [],
    };
  }

  handleSaveAvro(path: string | null, value: string) {
    if (path) {
      this.props.saveAvro(path, value);
    }
  }

  render() {
    const {
      avro,
      changeAvro,
      json,
      editing,
      changeJson,
      avroMouseMove,
    } = this.props;
    const { errors } = this.state;

    const jsonSelection =
      (json.value.sourceMap &&
        getPositionFromPath(getJsonPath(avro), json.value.sourceMap)) ||
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
              {editing.path && (
                <Breadcrumb>
                  {takeRight(editing.path.split('/'), 3).map((value, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Breadcrumb.Item key={`${value}_${index}`}>
                      {value}
                    </Breadcrumb.Item>
                  ))}
                  {!avro.isPristine && (
                    <Breadcrumb.Item>
                      <Tag icon={<EditOutlined />} color="processing">
                        edited
                      </Tag>
                    </Breadcrumb.Item>
                  )}
                </Breadcrumb>
              )}
              <Split cursor="col-resize" className={classNames.split}>
                <div>
                  <h3 style={{ color: COLORS.DARK_BLUE }}>Avro</h3>

                  <div className={classNames.codeEditor}>
                    <CodeEditor
                      value={avro.value.str}
                      onValueChange={(value) => changeAvro(value)}
                      onMouseMove={(position) => {
                        avroMouseMove(position);
                      }}
                      onError={(messages) => {
                        this.setState({ errors: messages });
                      }}
                      onSave={() => {
                        this.handleSaveAvro(
                          this.props.editing.path,
                          this.props.avro.value.str
                        );
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 style={{ color: COLORS.DARK_BLUE }}>JSON</h3>

                  <div className={classNames.codeEditor}>
                    <CodeEditor
                      selection={jsonSelection}
                      value={json.value.str}
                      onValueChange={(value) => changeJson(value)}
                      monacoOptions={{ readOnly: true }}
                    />
                  </div>
                </div>
              </Split>
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
