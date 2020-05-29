import React, { useEffect, useState } from 'react';
import MonacoEditor, {
  EditorDidMount,
  EditorWillMount
} from 'react-monaco-editor';
import * as monacoEditor from 'monaco-editor';
import schema from '../avro-schema.json';
import { COLORS } from '../../constants/theme';

monacoEditor.editor.defineTheme('javro', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.selectionBackground': COLORS.EXTRA_LIGHT_BLUE,
    'editor.inactiveSelectionBackground': COLORS.LIGHT_BLUE
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

  useEffect(() => {
    if (editor && selection) {
      const monacoSelection = {
        startColumn: selection.start.column,
        startLineNumber: selection.start.line,
        endColumn: selection.end.column,
        endLineNumber: selection.end.line
      };
      editor.setSelection(monacoSelection);
      editor.revealRangeInCenterIfOutsideViewport(monacoSelection);
    }
  }, [selection]);

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
      mountedEditor.focus();
    };
    setEditor(mountedEditor);
  };

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
