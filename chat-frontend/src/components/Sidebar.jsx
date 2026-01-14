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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-3 font-semibold transition ${
            activeTab === 'chats'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-3 font-semibold transition ${
            activeTab === 'groups'
              ? 'text-green-500 border-b-2 border-green-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Groups
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'chats' && (
          <ul className="divide-y divide-gray-100">
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => onSelectChat({ type: 'user', id: user.id, name: user.name })}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'groups' && (
          <div>
            <form onSubmit={handleCreateGroup} className="p-4 border-b border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold text-sm"
                >
                  Create
                </button>
              </div>
            </form>
            <ul className="divide-y divide-gray-100">
              {groups.map((group) => (
                <li key={group.groupId} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div
                      onClick={() => onSelectChat({ type: 'group', id: group.groupId, name: group.groupName })}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {group.groupName.charAt(0).toUpperCase()}
                        </div>
                        <p className="ml-3 font-semibold text-gray-800">{group.groupName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinGroup(group.groupId)}
                      className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition text-sm font-semibold"
                    >
                      Join
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
