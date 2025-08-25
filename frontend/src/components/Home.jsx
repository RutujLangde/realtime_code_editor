import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Typewriter } from 'react-simple-typewriter';

import { AuthProvider, AuthContext  } from './AuthContext';

import Navbar from './Navbar';

import logomain from "../assets/image.png";


const Home = () => {
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [recentRooms, setRecentRooms] = useState([]);
  const navigate = useNavigate();

  // user infromation retrival from AuthContext
  const {user} = useContext(AuthContext);

  // console.log("this one is from home",user);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('recentRooms') || '[]');
    setRecentRooms(stored.slice(0, 5));
  }, []);

  useEffect(() => {
    document.title = "Dashboard - NebNews";
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = {logomain}; // Put your new icon in `public/`
    }

  }, []);


  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        roomId ? handleJoin() : handleCreate();
      } else if (e.key === 'Escape') {
        setRoomId('');
        setUserName('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Save room info
  const saveToRecent = (id, name) => {
    const existing = JSON.parse(localStorage.getItem('recentRooms') || '[]');
    const updated = [
      { id, name, timestamp: new Date().toISOString() },
      ...existing.filter((r) => r.id !== id),
    ];
    localStorage.setItem('recentRooms', JSON.stringify(updated.slice(0, 5)));
  };

  const handleJoin = () => {
    if (!userName || !roomId) {
      alert('Please enter Room ID and Your Name.');
      return;
    }
    saveToRecent(roomId, userName);
    navigate(`/editor/${roomId}`, { state: { userName } });
  };

  const handleCreate = () => {
    if (!userName) {
      alert('Please enter your name.');
      return;
    }
    const id = uuidv4();
    saveToRecent(id, userName);
    navigate(`/editor/${id}`, { state: { userName } });
  };

  const rejoinRoom = (id, name) => {
    navigate(`/editor/${id}`, { state: { userName: name }});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar user ={user}/>


      <div className="text-center mt-10 text-green-400 font-mono text-xl">
        <Typewriter
          words={[
            '> Initializing...',
            '> Connecting to server...',
            '> Room ready for collaboration 🚀',
            '> Share. Code. Create. 💻',
          ]}
          loop={0} // Loop infinitely
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1200}
        />
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 mt-20 px-4">
        {/* Join Room Card */}
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-xl w-full max-w-md text-white min-h-[300px] flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-400">Join a Room</h2>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
            />
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
            />
          </div>
          <button
            onClick={handleJoin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg transition duration-300 font-semibold"
          >
            Join Room
          </button>
        </div>

        {/* Divider */}
        <div className="w-[2px] h-[340px] bg-gray-600 hidden lg:block"></div>

        {/* Create Room Card */}
        <div className="bg-gray-800 border border-gray-700 p-8 rounded-xl shadow-xl w-full max-w-md text-white min-h-[300px] flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center text-green-400">Create a Room</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
            />
          </div>
          <button
            onClick={handleCreate}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg transition duration-300 font-semibold"
          >
            Create & Enter
          </button>
        </div>
      </div>

      {/* Recent Rooms */}
      {recentRooms.length > 0 && (
        <div className="max-w-4xl mx-auto mt-16 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-white">🕘 Recently Accessed Rooms</h3>
          <ul className="space-y-2">
            {recentRooms.map((room) => (
              <li
                key={room.id}
                onClick={() => rejoinRoom(room.id, room.name)}
                className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-indigo-300">Room ID: <span className="text-white">{room.id}</span></p>
                  <p className="text-sm text-gray-400">Name: {room.name}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(room.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-700 bg-gray-900 text-gray-400 py-6 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm">
            © {new Date().getFullYear()} CodeSync. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs">
            <a href="#" className="hover:text-indigo-400 transition">About</a>
            <a href="#" className="hover:text-indigo-400 transition">Contact</a>
            <a href="#" className="hover:text-indigo-400 transition">Privacy</a>
          </div>
          <p className="mt-2 text-xs text-gray-600">Crafted for dev community by Rutuj Langde with Love ❤️</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
