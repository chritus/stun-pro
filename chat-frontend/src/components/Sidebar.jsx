import React, { useState } from 'react';

const Sidebar = ({ users, groups, onSelectChat, socket, username }) => {
  const [groupName, setGroupName] = useState('');
  const [activeTab, setActiveTab] = useState('chats');

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (groupName.trim() && socket) {
      socket.emit('create_group', { groupName });
      setGroupName('');
    }
  };

  const handleJoinGroup = (groupId) => {
    if (socket) {
      socket.emit('join_group', { groupId });
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-blue-500">
        <h1 className="text-2xl font-bold text-white">Stun Chat</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 font-semibold transition ${
            activeTab === 'chats'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Chats
          </div>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-3 font-semibold transition ${
            activeTab === 'groups'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Groups
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' && (
          <ul className="divide-y divide-gray-100">
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p>No users online</p>
              </div>
            ) : (
              users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => onSelectChat({ type: 'user', id: user.id, name: user.name })}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-green-600">Online</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

        {activeTab === 'groups' && (
          <div>
            <form onSubmit={handleCreateGroup} className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
            <ul className="divide-y divide-gray-100">
              {groups.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p>No groups yet</p>
                </div>
              ) : (
                groups.map((group) => (
                  <li key={group.groupId} className="p-4 hover:bg-blue-50 transition">
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => onSelectChat({ type: 'group', id: group.groupId, name: group.groupName })}
                        className="flex-1 cursor-pointer flex items-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                          {group.groupName.charAt(0).toUpperCase()}
                        </div>
                        <p className="ml-3 font-semibold text-gray-800">{group.groupName}</p>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(group.groupId)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition text-sm font-semibold shadow-sm"
                      >
                        Join
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
