// components/ImageDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const ImageDetail = () => {
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5007/api/clothes`)
      .then(res => {
        const found = res.data.find(item => item._id === id);
        setImage(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!image) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: 20 }}>
        <AiOutlineArrowLeft size={28} color="#ff7f50" /> Back
      </button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img 
          src={`http://localhost:5007/uploads/${image.filename}`} 
          alt={image.originalName} 
          style={{ width: '80%', maxWidth: 400, borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
      </div>
      <p style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>
        Uploaded on: {new Date(image.uploadedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default ImageDetail;
