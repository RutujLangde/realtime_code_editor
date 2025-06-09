import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import socket from '../socket';

const Compiler = ({ code, roomId, language, handelCodeChange }) => {
  const [output, setOutput] = useState('');
  const [version, setVersion] = useState('*');
  const [Running, setRunning] = useState(false);

  useEffect(() => {
    socket.on('codeResponse', (response) => {
      setRunning(false);
      setOutput(response.run.output);
    });

    return () => {
      socket.off('codeResponse');
    };
  }, []);

  const runCode = () => {
    setRunning(true);
    socket.emit('compileCode', { code, roomId, language, version });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1">
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={handelCodeChange}
        />
      </div>

      <div className="p-2">
        <button
          className="mt-2 w-[10%] p-1 bg-[#27ae60] text-white border-0 rounded-md text-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#1e8449]"
          onClick={runCode}
        >
          {Running ? 'Running..' : 'Run'}
        </button>

        <textarea
          className="w-full mt-3.5 p-2.5 text-md text-amber-50 rounded resize-none bg-[#1e293b]"
          rows={5}
          value={output}
          readOnly
          placeholder="Output will be displayed here.."
        />
      </div>
    </div>
  );
};

export default Compiler;
