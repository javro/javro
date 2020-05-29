import React, { useLayoutEffect, useState } from 'react';
import MonacoEditor, {
  EditorDidMount,
  EditorWillMount
} from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';
import schema from '../avro-schema.json';

function triggerOnValueChange<T>(callback: (value: T) => void, value: T): void {
  const [lastValueInJson, setLastValueInJson] = useState('');
  const currentValueInJson = JSON.stringify(value);
  if (currentValueInJson !== lastValueInJson) {
    setLastValueInJson(currentValueInJson);
    callback(value);
  }
}

export type EditorPosition = { line: number; column: number };
export type EditorPositonRange = {
  start: EditorPosition;
  end: EditorPosition;
};

export type EditorError = {
  message: string;
  line: number;
};

type Props = {
  value: string;
  selection?: EditorPositonRange;
  onMouseMove?: (position: EditorPosition) => void;
  onValueChange?: (value: string) => void;
  onError?: (messages: EditorError[]) => void;
  monacoOptions?: monacoEditor.editor.IEditorConstructionOptions;
};

interface Marker {
  message: string;
  line: number;
}

export default function CodeEditor(props: Props) {
  const {
    value,
    onMouseMove,
    onValueChange,
    onError,
    monacoOptions,
    selection
  } = props as Required<Omit<Props, 'selection'>> & Props;

  const [editor, setEditor] = useState();
  const [lastMarkers, setLastMarkers] = useState([] as Marker[]);

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

  useLayoutEffect(() => {
    if (editor) {
      const model = editor.getModel();
      const owner = model.getModeId();
      const markers = monacoEditor.editor.getModelMarkers({ owner }).map(
        marker =>
          ({
            message: marker.message,
            line: marker.startLineNumber
          } as Marker)
      );

      if (JSON.stringify(lastMarkers) !== JSON.stringify(markers)) {
        setLastMarkers(markers);
        onError(markers);
      }
    }
  });

  const valueOnChange = (v: string) => {
    onValueChange(v);
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
      height="100%"
      language="json"
      theme="vs-light"
      options={computedMonacoOptions}
      value={value}
      editorWillMount={editorWillMount}
      editorDidMount={editorDidMount}
      onChange={v => valueOnChange(v)}
    />
  );
}

CodeEditor.defaultProps = {
  value: '',
  onMouseMove: () => {},
  onValueChange: () => {},
  onError: () => {},
  monacoOptions: {}
} as Required<Omit<Props, 'selection'>>;
