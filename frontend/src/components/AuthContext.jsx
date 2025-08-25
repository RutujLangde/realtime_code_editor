import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
  axios.get('https://realtime-code-editor-ydpw.onrender.com/api/auth/me', {
    withCredentials: true
  })
    .then(res => {
        // console.log('✅ /me response:', res.data)
        setUser(res.data)
    })
    .catch(() => setUser(null));

    console.log()
}, []);


  const login = async (email, password) => {
  const res = await axios.post('https://realtime-code-editor-ydpw.onrender.com/api/auth/signin', { email, password }, {
    withCredentials: true,
  });

  localStorage.setItem('token', res.data.token);

  // Get user from /me
  const me = await axios.get('https://realtime-code-editor-ydpw.onrender.com/api/auth/me', { withCredentials: true });
  setUser(me.data); // ✅ set actual user data
};


 const register = async (formData) => {
  try {
    const res = await axios.post('https://realtime-code-editor-ydpw.onrender.com/api/auth/signup', formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data', 
        
      },
    });
    localStorage.setItem('token', res.data.token);
    setUser({ username: formData.get('username'), profilePic: res.data.profilePic });
  } catch (err) {
    console.error('Registration error:', err.response?.data || err.message);
    throw err;
  }
};
  

  return (
    <AuthContext.Provider value={{ user, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
