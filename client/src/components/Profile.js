// components/Profile.js
import React, { useState } from 'react';

const Profile = () => {
  const [username, setUsername] = useState('John Doe');
  const [bio, setBio] = useState('Love fashion and organizing my wardrobe.');

  const handleSave = () => {
    alert('Profile saved!');
  };

  return (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <h2 style={{ textAlign: 'center', color: '#6a5d7b' }}>Profile</h2>

      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 15 }}>
        <label>Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          style={{ padding: 10, borderRadius: 10, border: '1px solid #ccc' }}
        />

        <label>Bio</label>
        <textarea 
          value={bio} 
          onChange={e => setBio(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: '1px solid #ccc', minHeight: 80 }}
        />

        <button 
          onClick={handleSave} 
          style={{ padding: 10, borderRadius: 10, background: '#ff7f50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Save
        </button>

        <button 
          onClick={() => alert('Logged out!')} 
          style={{ padding: 10, borderRadius: 10, background: '#ccc', color: '#333', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
