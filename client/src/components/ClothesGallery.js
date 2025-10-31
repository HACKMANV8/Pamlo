// components/ClothesGallery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClothesGallery = () => {
  const [clothes, setClothes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5007/api/clothes')
      .then(res => setClothes(res.data))
      .catch(err => console.error(err));
  }, []);

  if (clothes.length === 0) return <p>No clothes uploaded yet.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
      {clothes.map(item => (
        <div 
          key={item._id} 
          style={{ border: '1px solid #ccc', padding: 5, borderRadius: 10, cursor: 'pointer', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          onClick={() => navigate(`/image/${item._id}`)}
        >
          <img
            src={`http://localhost:5007/uploads/${item.filename}`}
            alt={item.originalName}
            style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 10 }}
          />
          <p style={{ textAlign: 'center', marginTop: 5, fontSize: 12, color: '#555' }}>{item.originalName}</p>
        </div>
      ))}
    </div>
  );
};

export default ClothesGallery;
