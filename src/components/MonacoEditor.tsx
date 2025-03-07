import { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string | number;
}

export function MonacoEditor({
  value,
  onChange,
  placeholder = '',
  height = '10rem'
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // 设置占位符
    if (placeholder && !value) {
      editor.getModel()?.setValue(placeholder);
      editor.getModel()?.onDidChangeContent(() => {
        const currentValue = editor.getValue();
        if (currentValue === placeholder) {
          editor.getModel()?.setValue('');
        }
      });
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== value) {
        model.setValue(value);
      }
    }
  }, [value]);

  return (
    <Editor
      height={height}
      defaultLanguage="plaintext"
      value={value}
      onChange={(value) => onChange(value ?? '')}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        lineNumbers: 'off',
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 0,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        wrappingStrategy: 'advanced',
        fontSize: 14,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        theme: 'vs-light',
      }}
    />
  );
} 