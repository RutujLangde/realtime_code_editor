import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const EditorComponent = ({ socket, roomId, language, code, onCodeChange }) => {
  const editorRef = useRef(null);
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    socket.on("cursorUpdate", ({ userName, position }) => {
      setCursors((prevCursors) => ({
        ...prevCursors,
        [userName]: position,
      }));
    });

    return () => {
      socket.off("cursorUpdate");
    };
  }, [socket]);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const monaco = editor._modelData.viewModel.model;

      const decorations = Object.entries(cursors).map(([user, pos]) => ({
        range: new monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column + 1),
        options: {
          className: "cursor-marker",
          afterContentClassName: "cursor-label",
        },
      }));

      editor.deltaDecorations([], decorations);
    }
  }, [cursors]);

  return (
    <div className="w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={code}
        onChange={onCodeChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
        onMount={(editor) => {
          editorRef.current = editor;
          editor.onDidChangeCursorPosition((e) => {
            const position = { lineNumber: e.position.lineNumber, column: e.position.column };
            socket.emit("cursorMove", { roomId, position });
          });
        }}
      />
    </div>
  );
};

export default EditorComponent;
