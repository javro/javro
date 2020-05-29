import React, { useState } from 'react';
import MonacoEditor, {
  EditorDidMount,
  EditorWillMount
} from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';
import schema from '../avro-schema.json';

function triggerOnValueChange<T>(callBack: (value: T) => void, value: T): void {
  const [lastValueInJson, setLastValueInJson] = useState('');
  const currentValueInJson = JSON.stringify(value);
  if (currentValueInJson !== lastValueInJson) {
    setLastValueInJson(currentValueInJson);
    callBack(value);
  }
}

export type EditorPosition = { line: number; column: number };
export type EditorPositonRange = {
  start: EditorPosition;
  end: EditorPosition;
};

type Props = {
  value: string;
  selection?: EditorPositonRange;
  onMouseMove?: (position: EditorPosition) => void;
  onChange?: (value: string) => void;
  monacoOptions?: monacoEditor.editor.IEditorConstructionOptions;
};

export default function CodeEditor(props: Props) {
  const {
    value,
    onMouseMove,
    onChange,
    monacoOptions,
    selection
  } = props as Required<Omit<Props, 'selection'>> & Props;

  const [editor, setEditor] = useState();

  triggerOnValueChange(changedSelection => {
    if (editor && changedSelection) {
      const monacoSelection = {
        startColumn: changedSelection.start.column,
        startLineNumber: changedSelection.start.line,
        endColumn: changedSelection.end.column,
        endLineNumber: changedSelection.end.line
      };
      editor.setSelection(monacoSelection);
      editor.revealRangeInCenterIfOutsideViewport(monacoSelection);
    }
  }, selection);

  const editorWillMount: EditorWillMount = monacoInstance => {
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
  };

  const editorDidMount: EditorDidMount = mountedEditor => {
    mountedEditor.onMouseMove(e => {
      if (e.target.position) {
        const { lineNumber, column } = e.target.position;
        onMouseMove({ line: lineNumber, column });
      }
    });
    setEditor(mountedEditor);
  };

  const computedMonacoOptions = {
    selectOnLineNumbers: true,
    automaticLayout: true,
    minimap: {
      enabled: false
    },
    ...monacoOptions
  };

  return (
    <MonacoEditor
      width="100%"
      height="80vh"
      language="json"
      theme="vs-light"
      options={computedMonacoOptions}
      value={value}
      editorWillMount={editorWillMount}
      editorDidMount={editorDidMount}
      onChange={v => onChange(v)}
    />
  );
}

CodeEditor.defaultProps = {
  value: '',
  onMouseMove: () => {},
  onChange: () => {},
  monacoOptions: {}
} as Required<Omit<Props, 'selection'>>;
