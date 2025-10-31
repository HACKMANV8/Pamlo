// components/Filter.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const occasionsList = ["Casual", "College", "Dinner", "Streetwear", "Party", "Wedding", "Gym"];
const colorList = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Brown"];

const Filter = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("weather");
  const [weatherSelected, setWeatherSelected] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const toggleMultiSelect = (item, list, setter) => {
    if (list.includes(item)) setter(list.filter(i => i !== item));
    else setter([...list, item]);
  };

  const renderMultiSelect = (items, selected, setter) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 15 }}>
      {items.map(item => (
        <button
          key={item}
          onClick={() => toggleMultiSelect(item, selected, setter)}
          style={{
            padding: 10,
            borderRadius: 10,
            border: selected.includes(item) ? '2px solid #ff7f50' : '1px solid #ccc',
            background: selected.includes(item) ? '#ff7f50' : '#f1f1f1',
            color: selected.includes(item) ? '#fff' : '#000',
            cursor: 'pointer',
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ padding: 20, paddingBottom: 100 }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginBottom: 20 }}
      >
        <AiOutlineArrowLeft size={28} color="#ff7f50" /> Back
      </button>

      <h2 style={{ textAlign: 'center', color: '#6a5d7b', marginBottom: 20 }}>Filter Clothes</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        {["weather", "occasion", "color"].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: 20,
              border: selectedTab === tab ? '2px solid #ff7f50' : '1px solid #ccc',
              background: selectedTab === tab ? '#ff7f50' : '#f1f1f1',
              color: selectedTab === tab ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "weather" && (
        <button
          onClick={() => setWeatherSelected(!weatherSelected)}
          style={{
            padding: 12,
            borderRadius: 10,
            border: weatherSelected ? '2px solid #ff7f50' : '1px solid #ccc',
            background: weatherSelected ? '#ff7f50' : '#f1f1f1',
            color: weatherSelected ? '#fff' : '#000',
            width: '100%'
          }}
        >
          Weather Based Suggestions ✅
        </button>
      )}

      {selectedTab === "occasion" && renderMultiSelect(occasionsList, selectedOccasions, setSelectedOccasions)}
      {selectedTab === "color" && renderMultiSelect(colorList, selectedColors, setSelectedColors)}

      {/* Apply Button */}
      <button
        style={{
          marginTop: 30,
          padding: 12,
          borderRadius: 10,
          border: 'none',
          background: '#ff7f50',
          color: '#fff',
          cursor: 'pointer',
          width: '100%'
        }}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default Filter;
