import React from 'react';
import { Alert, Drawer } from 'antd';
import { COLORS } from '../../constants/theme';
import { EditorError } from '../code-editor/CodeEditor';

type Props = {
  isInError: boolean;
  avroError: string | null;
  editorErrors: EditorError[];
};

export default function ErrorDrawer(props: Props) {
  const { editorErrors, isInError, avroError } = props;

  const editorErrorAlerts = editorErrors.map(error => (
    <Alert
      key={`L${error.line}: ${error.message}`}
      message={`L${error.line}: ${error.message}`}
      style={{
        marginTop: '1rem',
        borderColor: COLORS.ORANGE,
        backgroundColor: COLORS.LIGHT_ORANGE
      }}
      type="warning"
    />
  ));

  const avroErrorAlert = (
    <Alert
      message={`Avro error: ${avroError}`}
      style={{
        marginTop: '1rem',
        borderColor: COLORS.ORANGE,
        backgroundColor: COLORS.LIGHT_ORANGE
      }}
      type="warning"
    />
  );

  return (
    <Drawer
      title="Avro errors"
      placement="right"
      closable={false}
      visible={isInError}
      getContainer={false}
      width="60%"
      style={{ position: 'absolute' }}
    >
      {editorErrors.length > 0 ? (
        <>
          <h2>Syntax analysis report</h2>
          {editorErrorAlerts}
          <br />
        </>
      ) : null}
      <h2>Avro specification analysis report</h2>
      {avroErrorAlert}
    </Drawer>
  );
}
