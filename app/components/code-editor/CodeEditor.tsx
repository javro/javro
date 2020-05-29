import React, { useState } from 'react';
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

monacoEditor.editor.defineTheme('javro', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.selectionBackground': '#88000015',
    'editor.inactiveSelectionBackground': '#88000015'
  }
});

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

  const valueOnChange = (v: string) => {
    onValueChange(v);

    if (editor) {
      const { setModelMarkers } = monacoEditor.editor;
      monacoEditor.editor.setModelMarkers = function(model, owner, rawMarkers) {
        setModelMarkers.call(monacoEditor.editor, model, owner, rawMarkers);
        const markers = rawMarkers.map(
          marker =>
            ({
              message: marker.message,
              line: marker.startLineNumber
            } as Marker)
        );
        onError(markers);
      };
    }
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
      theme="javro"
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
