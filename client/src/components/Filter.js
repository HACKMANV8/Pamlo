// components/Filter.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const Filter = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: 20 }}
      >
        <AiOutlineArrowLeft size={28} color="#ff7f50" /> Back
      </button>

      <h2 style={{ textAlign: 'center', color: '#6a5d7b', marginBottom: 20 }}>Filter Clothes</h2>

      {/* Example Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <select style={selectStyle}>
          <option value="">Select Season</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="rainy">Rainy</option>
        </select>

        <select style={selectStyle}>
          <option value="">Select Color</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>

        <select style={selectStyle}>
          <option value="">Select Event</option>
          <option value="college">College</option>
          <option value="dinner">Dinner</option>
          <option value="casual">Casual</option>
        </select>

        <button style={buttonStyle}>Apply Filters</button>
      </div>
    </div>
  );
};

const selectStyle = {
  padding: 10,
  borderRadius: 10,
  border: '1px solid #ccc',
  fontSize: 14
};

const buttonStyle = {
  padding: 12,
  borderRadius: 10,
  border: 'none',
  background: '#ff7f50',
  color: '#fff',
  cursor: 'pointer',
  fontSize: 16
};

export default Filter;
