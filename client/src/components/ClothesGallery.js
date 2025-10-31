// components/ClothesGallery.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ClothesGallery = () => {
  const [clothes, setClothes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5007/api/clothes')
      .then(res => setClothes(res.data))
      .catch(err => console.error(err));
  }, []);

  if (clothes.length === 0) return <p>No clothes uploaded yet.</p>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {clothes.map(item => (
        <div key={item._id} style={{ border: '1px solid #ccc', padding: 5 }}>
          <img
            src={`http://localhost:5007/uploads/${item.filename}`}
            alt={item.originalName}
            style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 6 }}
          />
          <p style={{ textAlign: 'center', margin: '5px 0 0 0' }}>{item.originalName}</p>
        </div>
      ))}
    </div>
  );
};

export default ClothesGallery;
