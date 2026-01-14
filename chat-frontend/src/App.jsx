import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const savedUsername = localStorage.getItem('chatUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = (name) => {
    setUsername(name);
    localStorage.setItem('chatUsername', name);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('chatUsername');
  };

  return (
    <div className="h-screen bg-white">
      {username ? (
        <Chat username={username} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
