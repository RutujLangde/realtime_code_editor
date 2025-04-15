import React, { useState, useEffect } from 'react'
import './App.css';
import io from 'socket.io-client';
import Editor from '@monaco-editor/react'




const socket = io("https://realtime-code-editor-ydpw.onrender.com", { transports: ["websocket"] });



const App = () => {

  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setlanguage] = useState("javascript");
  const [code, setCode] = useState("// start coding here");
  const [copySuccesfull, setcopySuccesfull] = useState("");
  const [users, setusers] = useState([]);
  const [typing, settyping] = useState("");
  const [output, setOutput] = useState("");
  const [version, setVersion] = useState("*");
  const [Running, setRunning] = useState(false);



  useEffect(() => {

    socket.on("UserJoined", (users) => {
      setusers(users);
    })

    socket.on("codeUpdate", (newCode) => {
      setCode(newCode);
    })

    socket.on("userTyping", (user) => {
      settyping(user);
      setTimeout(() => {
        settyping("");
      }, 2000);
    })

    socket.on("languageUpdate", (newLanguage) => {
      setlanguage(newLanguage);
    })



    socket.on("codeResponse", (response) => {
      setRunning(false);
      setOutput(response.run.output);
    })

    return () => {
      socket.off("UserJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");

    }


  }, []);


  useEffect(() => {
    const handelBeforUnload = () => {
      socket.emit("leaveRoom");

      window.addEventListener("beforeunloade", handelBeforUnload);

      return () => {
        window.removeEventListener("beforeunloade", handelBeforUnload);
      }
    }
  }, []);





  const joinRoom = () => {
    console.log(`Joining Room: ${roomId}, Username: ${userName}`);
    socket.emit("join", { roomId, userName });
    setJoined(true);
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("");
    setlanguage("javascript")
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setcopySuccesfull("Copied!");
    setTimeout(() => setcopySuccesfull(""), 2000);
  };

  const handelCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  }

  const handelLanguageChange = e => {
    const newLanguage = e.target.value
    setlanguage(newLanguage);
    socket.emit("languageChangde", { roomId, language: newLanguage })
  }

  const runCode = () => {
    setRunning(true);
    socket.emit("compileCode", { code, roomId, language, version });

  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${language === "javascript" ? "js" : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };






  if (!joined) {
    return (
      <div className='join-container'>
        <div className='join-form'>
          <h1>Join code room</h1>
          <input type="text"
            placeholder='Room Id'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input type="text"
            placeholder='User Name'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button onClick={joinRoom}> Create room </button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen'>
      <div className="w-[250px] p-2 bg-[#2c3e50] text-[#ecf0f1]">
        <div className='flex flex-col justify-center items-center mb-1'>
          <h2 className='mb-1 text-lg'>Room Code: {roomId}</h2>
          <button onClick={copyRoomId} className="btn btn-blue">
            Copy Id
          </button>
          {copySuccesfull && <span className='ml-0.5 text-[green] text-sm'>{copySuccesfull}</span>}
        </div>


        <h3 className='mt-5 mb-0.5 text-lg'>Users in Room:</h3>


        <ul className='list-none'>
          {users.map((user, index) => (
            <li key={index} className='p-0.5 text-sm bg-[gray] mt-0.5 rounded-md'>{user.length > 8 ? `${user.slice(0, 8)}...` : user}</li>
          ))}

        </ul>


        {typing && <p className='mt-1 text-lg text-[white]'>{typing} is typing...</p>}




        <select className='mt-1 w-[100%] p-1 bg-[#34495e] text-[white] border-0 rounded-md'
          value={language}
          onChange={handelLanguageChange}>
          <option value="javascript">Javascript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={leaveRoom} className='mt-[50%] w-[100%] p-1 bg-[#e74c3c] text-[white] border-0 rounded-md text-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#ab2a1c]'>Leave Room</button>
        <button
          onClick={downloadCode}
          className='mt-2 w-[100%] p-1 bg-[#27ae60] text-[white] border-0 rounded-md text-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#1e8449]'>
          Download Code
        </button>

      </div>
      <div className='w-[100%]'>
        <Editor
          height={"65%"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handelCodeChange}
          theme='vs-dark'
          options={
            {
              minimap: { enabled: false },
              fontSize: 14,
            }
          }
        />
        <button
          className="flex justify-center items-center mt-2 w-[10%] p-1 ml-[10px] bg-[#27ae60] text-white border-0 rounded-md text-md cursor-pointer transition-colors duration-300 ease-in-out hover:bg-[#1e8449]"
          onClick={runCode}>{Running ? 'Running..' : ' Run'}</button>
        <textarea 
        className='w-[100%] mt-3.5 p-2.5 text-md '
          value={output}
          readOnly
          placeholder='Output will be displayed here..'
        />
      </div>
    </div>
  );


}

export default App