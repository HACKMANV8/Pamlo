import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Home from './components/Home';
import Upload from './components/UploadClothes';
import Profile from './components/Profile';
import ImageDetail from './components/ImageDetail';
import Filter from './components/Filter';
function App() {
  return (
    <Router>
      <div style={{ paddingBottom: 80 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/image/:id" element={<ImageDetail />} />
          <Route path="/filter" element={<Filter />} />

        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
