import React from 'react';
import UploadClothes from './components/UploadClothes';
import ClothesGallery from './components/ClothesGallery';

function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1>FitGenie Wardrobe</h1>
      <UploadClothes />
      <hr style={{ margin: '40px 0' }} />
      <h2>My Clothes</h2>
      <ClothesGallery />
    </div>
  );
}

export default App;
