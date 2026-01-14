import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './Sidebar';
import MessageWindow from './MessageWindow';
import MessageInput from './MessageInput';

const Chat = ({ username, onLogout }) => {
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('https://stun-xzeu.onrender.com');

    socket.current.on('connect', () => {
      console.log('Socket.IO connected');
      socket.current.emit('authenticate', { userId: username });
    });

    socket.current.on('authenticated', (data) => {
      console.log('Authenticated as:', data.userId);
    });

    socket.current.on('group_message', (payload) => {
      console.log('🔔 Received group message:', payload);
      const chatKey = `group_${payload.groupId}`;
      setMessages((prev) => {
        console.log('📦 Current messages state:', prev);
        const existing = prev[chatKey] || [];
        const isDuplicate = existing.some(m => m.id === payload.id);
        
        if (isDuplicate) {
          console.log('⚠️ Skipping duplicate message');
          return prev;
        }
        
        const newMessage = {
          id: payload.id,
          text: payload.message,
          sender: payload.sender,
          timestamp: payload.timestamp,
          isOwn: payload.isOwn
        };
        
        const updated = {
          ...prev,
          [chatKey]: [...existing, newMessage]
        };
        console.log('✅ Updated messages state:', updated);
        return updated;
      });
    });

    socket.current.on('private_message', (payload) => {
      console.log('🔔 Received private message:', payload);
      const otherUser = payload.isOwn ? payload.recipientId : payload.sender;
      const chatKey = `user_${otherUser}`;
      setMessages((prev) => {
        console.log('📦 Current messages state:', prev);
        const existing = prev[chatKey] || [];
        const isDuplicate = existing.some(m => m.id === payload.id);
        
        if (isDuplicate) {
          console.log('⚠️ Skipping duplicate message');
          return prev;
        }
        
        const newMessage = {
          id: payload.id,
          text: payload.message,
          sender: payload.sender,
          timestamp: payload.timestamp,
          isOwn: payload.isOwn
        };
        
        const updated = {
          ...prev,
          [chatKey]: [...existing, newMessage]
        };
        console.log('✅ Updated messages state:', updated);
        return updated;
      });
    });

    socket.current.on('group_message_history', (data) => {
      const chatKey = `group_${data.groupId}`;
      const formattedMessages = data.messages.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender,
        timestamp: msg.timestamp,
        isOwn: msg.sender === username
      }));
      setMessages((prev) => ({ ...prev, [chatKey]: formattedMessages }));
    });

    socket.current.on('private_message_history', (data) => {
      const chatKey = `user_${data.userId}`;
      const formattedMessages = data.messages.map(msg => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender,
        timestamp: msg.timestamp,
        isOwn: msg.sender === username
      }));
      setMessages((prev) => ({ ...prev, [chatKey]: formattedMessages }));
    });

    socket.current.on('user_list', (payload) => {
      console.log('Received user list:', payload.users);
      setUsers(payload.users.filter(u => u !== username).map(u => ({ id: u, name: u })));
    });

    socket.current.on('user_joined', (payload) => {
      console.log('User joined:', payload.userId);
      if (payload.userId !== username) {
        setUsers((prev) => {
          const exists = prev.find(u => u.id === payload.userId);
          if (!exists) {
            return [...prev, { id: payload.userId, name: payload.userId }];
          }
          return prev;
        });
      }
    });

    socket.current.on('user_left', (payload) => {
      console.log('User left:', payload.userId);
      setUsers((prev) => prev.filter(u => u.id !== payload.userId));
    });

    socket.current.on('group_created', (payload) => {
      console.log('Group created:', payload);
      setGroups((prev) => {
        const exists = prev.find(g => g.groupId === payload.groupId);
        if (!exists) {
          return [...prev, payload];
        }
        return prev;
      });
    });

    socket.current.on('groups_list', (data) => {
      console.log('Received groups list:', data.groups);
      setGroups(data.groups);
    });

    socket.current.on('group_joined', (data) => {
      console.log('Successfully joined group:', data);
    });

    socket.current.on('notification', (payload) => {
      console.log('Received notification:', payload);
      const chatKey = `group_${payload.groupId}`;
      setMessages((prev) => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), {
          id: Date.now(),
          text: payload.message,
          sender: 'System',
          timestamp: new Date(),
          isSystem: true
        }]
      }));
    });

    socket.current.on('error', (error) => {
      console.error('❌ Socket error:', error);
      alert(`Error: ${error.message || JSON.stringify(error)}`);
    });

    socket.current.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    return () => {
      socket.current.disconnect();
    };
  }, [username]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    const chatKey = `${chat.type}_${chat.id}`;
    
    if (!messages[chatKey]) {
      if (chat.type === 'group') {
        socket.current.emit('get_group_messages', { groupId: chat.id });
      } else {
        socket.current.emit('get_private_messages', { userId: chat.id });
      }
    }
  };

  const getCurrentMessages = () => {
    if (!selectedChat) return [];
    const chatKey = `${selectedChat.type}_${selectedChat.id}`;
    return messages[chatKey] || [];
  };

  const handleReload = () => {
    setMessages({});
    setUsers([]);
    setGroups([]);
    setSelectedChat(null);
    if (socket.current) {
      socket.current.disconnect();
      socket.current = io('https://stun-xzeu.onrender.com');
      socket.current.emit('authenticate', { userId: username });
    }
  };

  const handleLeaveGroup = () => {
    if (socket.current && selectedChat && selectedChat.type === 'group') {
      socket.current.emit('leave_group', { groupId: selectedChat.id });
      setSelectedChat(null);
    }
  };

  const handleSendMessage = (message) => {
    console.log('Sending message:', message, 'to chat:', selectedChat);
    if (socket.current && selectedChat) {
      const tempMessage = {
        id: Date.now(),
        text: message,
        sender: username,
        timestamp: new Date(),
        isOwn: true
      };
      
      const chatKey = `${selectedChat.type}_${selectedChat.id}`;
      setMessages((prev) => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), tempMessage]
      }));
      
      const messageData = { message };

      if (selectedChat.type === 'group') {
        messageData.groupId = selectedChat.id;
        console.log('Emitting group_message:', messageData);
        socket.current.emit('group_message', messageData);
      } else if (selectedChat.type === 'user') {
        messageData.recipientId = selectedChat.id;
        console.log('Emitting private_message:', messageData);
        socket.current.emit('private_message', messageData);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar users={users} groups={groups} onSelectChat={handleSelectChat} socket={socket.current} username={username} />
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="text-sm font-semibold text-gray-800">{username}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedChat && selectedChat.type === 'group' && (
              <button
                onClick={handleLeaveGroup}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium shadow-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Leave Group
              </button>
            )}
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          
          {selectedChat && (
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-xs text-gray-500">Chatting with</p>
              <p className="text-lg font-semibold text-gray-800">{selectedChat.name}</p>
            </div>
          )}
        </div>
        <MessageWindow messages={getCurrentMessages()} selectedChat={selectedChat} username={username} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Chat;
