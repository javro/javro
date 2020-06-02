import React from 'react';
import { Badge, Collapse, Tag } from 'antd';
import { EditorError } from '../code-editor/CodeEditor';
import classNames from './EditorFeedback.css';

const { Panel } = Collapse;

type Props = {
  isInError: boolean;
  avroError: string | null;
  editorErrors: EditorError[];
};

export default function ErrorFeedback(props: Props) {
  const { editorErrors, isInError, avroError } = props;

  const editorErrorAlerts = editorErrors.map((error, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <p key={`${error.line}_${error.message}_${i}`}>
      <Tag color="magenta" className={classNames.tag}>
        syntax
      </Tag>
      <strong>{`L${error.line}:`}</strong>
      {` ${error.message}`}
    </p>
  ));

  const avroErrorAlert = (
    <p>
      <Tag color="purple" className={classNames.tag}>
        Avro
      </Tag>
      {`Avro error: ${avroError}`}
    </p>
  );

  const badge = (
    <Badge count={Math.max(editorErrors.length, isInError ? 1 : 0)}>
      <p style={{ marginBottom: 0, marginRight: '1rem' }}>Avro errors</p>
    </Badge>
  );

  return (
    <div
      className={classNames.errorFeedback}
      style={{ display: isInError ? 'initial' : 'none' }}
    >
      <Collapse
        defaultActiveKey={[1]}
        className={classNames.errorFeedbackCollapse}
      >
        <Panel header={badge} key="1" className={classNames.errorFeedbackPanel}>
          {editorErrors.length > 0 ? editorErrorAlerts : null}
          {avroErrorAlert}
        </Panel>
      </Collapse>
    </div>
  );
}
