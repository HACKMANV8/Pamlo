// components/BottomNav.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlinePlusCircle, AiOutlineUser } from 'react-icons/ai';

const BottomNav = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      background: '#f8f4f0',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '10px 0',
      borderTop: '1px solid #ddd',
      borderRadius: '15px 15px 0 0',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
      <NavLink to="/" style={({ isActive }) => ({ color: isActive ? '#ff7f50' : '#888', textAlign: 'center' })}>
        <AiOutlineHome size={28} />
        <div style={{ fontSize: 12 }}>Home</div>
      </NavLink>
      <NavLink to="/upload" style={({ isActive }) => ({ color: isActive ? '#ff7f50' : '#888', textAlign: 'center' })}>
        <AiOutlinePlusCircle size={28} />
        <div style={{ fontSize: 12 }}>Add</div>
      </NavLink>
      <NavLink to="/profile" style={({ isActive }) => ({ color: isActive ? '#ff7f50' : '#888', textAlign: 'center' })}>
        <AiOutlineUser size={28} />
        <div style={{ fontSize: 12 }}>Profile</div>
      </NavLink>
    </div>
  );
};

export default BottomNav;
