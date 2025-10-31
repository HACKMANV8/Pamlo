// components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClothesGallery from './ClothesGallery';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 80, paddingTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <h2 style={{ color: '#6a5d7b' }}>My Wardrobe</h2>
        <button 
          onClick={() => navigate('/filter')} 
          style={{ 
            padding: '8px 15px', 
            borderRadius: 10, 
            border: 'none', 
            background: '#ff7f50', 
            color: 'white', 
            cursor: 'pointer' 
          }}
        >
          Filter
        </button>
      </div>
      <ClothesGallery />
    </div>
  );
};

export default Home;
