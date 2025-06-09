import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Compiler from './compiler';
import { useLocation, useParams, useNavigate } from 'react-router-dom';


import logomain from "../assets/image.png";


const Editor = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const userName = location.state?.userName;

    const [joined, setJoined] = useState(false);
    const [language, setlanguage] = useState('javascript');
    const [code, setCode] = useState('// start coding here');
    const [copySuccesfull, setcopySuccesfull] = useState('');
    const [users, setusers] = useState([]);
    const [typing, settyping] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('UserJoined', (users) => {
            setusers(users);
        });

        socket.on('codeUpdate', (newCode) => {
            setCode(newCode);
        });

        socket.on('userTyping', (user) => {
            settyping(user);
            setTimeout(() => {
                settyping('');
            }, 2000);
        });

        socket.on('languageUpdate', (newLanguage) => {
            setlanguage(newLanguage);
        });

        return () => {
            socket.off('UserJoined');
            socket.off('codeUpdate');
            socket.off('userTyping');
            socket.off('languageUpdate');
        };
    }, [joined]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            socket.emit('leaveRoom');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);


//     useEffect(() => {
//     if (!joined || users.length === 0) return;

//     const isUserPresent = users.some((user) => user === userName);

//     if (!isUserPresent) {
//         navigate('/');
//     }
// }, [users, userName, joined, navigate]);


    const joinRoom = () => {
        socket.emit('join', { roomId, userName });
        setJoined(true);
    };

    const leaveRoom = () => {
        socket.emit('leaveRoom');
        setJoined(false);
        setCode('');
        setlanguage('javascript');
        navigate('/');
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        setcopySuccesfull('Copied!');
        setTimeout(() => setcopySuccesfull(''), 2000);
    };

    const handelCodeChange = (newCode) => {
        setCode(newCode);
        socket.emit('codeChange', { roomId, code: newCode });
        socket.emit('typing', { roomId, userName });
    };

    const handelLanguageChange = (e) => {
        const newLanguage = e.target.value;
        setlanguage(newLanguage);
        socket.emit('languageChangde', { roomId, language: newLanguage });
    };

    const downloadCode = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${language === 'javascript' ? 'js' : language}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!joined) {
        joinRoom();
    }

    return (
        <div className="flex h-screen bg-[#1a1a2e] text-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-[270px] p-4 bg-[#0f172a] flex flex-col justify-between">
                <div>
                    {/* Room Info */}
                    <div className="text-center mb-6">

                        <div className="flex items-center space-x-3">
                            <img src={logomain} alt="CodeSync Logo" className="h-10 w-auto" />

                            {/* <span className="text-2xl font-extrabold tracking-wide text-indigo-400">CodeSync</span> */}
                        </div>

                        <div className="flex items-center gap-2 mt-8">
                            <h2 className="text-md font-semibold">Room Code</h2>
                            {/* <span className="bg-[#1e293b] px-3 py-1 rounded text-sm break-all">{roomId}</span> */}
                            <button
                                onClick={copyRoomId}
                                className="text-sm bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded transition"
                            >
                                Copy
                            </button>
                        </div>

                        {copySuccesfull && (
                            <p className="text-green-400 text-xs mt-1">{copySuccesfull}</p>
                        )}
                    </div>

                    {/* Users List */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Participants</h3>
                        <ul className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                            {users.map((user, index) => (
                                <li
                                    key={index}
                                    className="bg-[#1e293b] px-3 py-1 text-sm rounded-md truncate"
                                >
                                    {user.length > 8 ? `${user.slice(0, 8)}...` : user}
                                </li>
                            ))}
                        </ul>

                        {typing && (
                            <p className="text-yellow-400 mt-2 text-sm">{typing} is typing...</p>
                        )}
                    </div>

                    {/* Language Selector */}
                    <div className="mt-4">
                        <label htmlFor="language" className="text-sm font-semibold mb-1 block">
                            Language
                        </label>
                        <select
                            id="language"
                            value={language}
                            onChange={handelLanguageChange}
                            className="w-full p-2 rounded bg-[#1e293b] border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={downloadCode}
                        className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-md font-semibold transition"
                    >
                        Download Code
                    </button>
                    <button
                        onClick={leaveRoom}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-md font-semibold transition"
                    >
                        Leave Room
                    </button>

                </div>
            </div>

            {/* Main Editor Panel */}
            <div className="flex-1 h-full overflow-hidden">
                <Compiler
                    code={code}
                    roomId={roomId}
                    language={language}
                    handelCodeChange={handelCodeChange}
                />
            </div>
        </div>
    );
};

export default Editor;
