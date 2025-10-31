// components/Filter.js
import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { createClient } from "@supabase/supabase-js";

// 🧩 Supabase setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🎯 Filter options - using lowercase to match database
const occasionsList = ["casual", "college", "dinner", "streetwear", "party", "wedding", "gym"];
const colorList = ["red", "blue", "green", "black", "white", "yellow", "purple", "brown", "orange", "pink", "grey", "beige"];

// 🎨 Color Palette Matching Rules (bidirectional)
const colorPalette = {
  red: ["black", "white", "blue", "grey"],
  blue: ["white", "black", "grey", "beige", "red"],
  green: ["brown", "black", "white", "beige"],
  black: ["white", "grey", "red", "blue", "yellow", "orange", "pink", "green", "purple"], // black goes with everything
  white: ["black", "blue", "grey", "brown", "red", "green", "yellow", "purple", "orange", "pink"], // white goes with everything
  yellow: ["black", "white", "blue", "grey"],
  purple: ["black", "white", "grey", "beige"],
  brown: ["beige", "white", "black", "green", "orange"],
  orange: ["black", "white", "blue", "brown"],
  pink: ["black", "white", "grey", "blue"],
  grey: ["black", "white", "blue", "red", "yellow", "green", "purple", "pink"], // grey is neutral
  beige: ["brown", "white", "black", "blue", "green"]
};

const Filter = () => {
  const [selectedTab, setSelectedTab] = useState("weather");
  const [weatherSelected, setWeatherSelected] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  
  // 👕 Clothes filter states
  const [clothesType, setClothesType] = useState(""); // "shirt" or "pant"
  const [selectedColor, setSelectedColor] = useState("");
  const [suggestedMatchingColors, setSuggestedMatchingColors] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  // 🌀 Toggle multi-select buttons
  const toggleMultiSelect = (item, list, setter) => {
    setter(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    );
  };

  // 🔄 Handle tab changes and clear results
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setFilteredResults([]);
    
    // Reset clothes filter when switching tabs
    if (tab !== "clothes") {
      setClothesType("");
      setSelectedColor("");
      setSuggestedMatchingColors([]);
    }
  };

  // 🎨 Handle color selection (works for both shirt and pant)
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Get matching colors from palette
    const matchingColors = colorPalette[color] || [];
    setSuggestedMatchingColors(matchingColors);
  };

  // 👔 Handle clothing type selection
  const handleClothesTypeSelect = (type) => {
    setClothesType(type);
    setSelectedColor("");
    setSuggestedMatchingColors([]);
    setFilteredResults([]);
  };

  // 📤 Apply filters -> fetch data from Supabase
  const applyFilters = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      alert("Supabase not configured properly!");
      return;
    }

    if (!clothesType || !selectedColor) {
      alert("Please select both clothing type and color!");
      return;
    }

    setLoading(true);

    let query = supabase.from("outfit_metadata").select("*");

    // Occasion filter
    if (selectedOccasions.length > 0) {
      query = query.in("occasion", selectedOccasions);
    }

    // Get the selected item in the chosen color
    query = query.eq("category", clothesType).eq("color", selectedColor);

    const { data, error } = await query;

    setLoading(false);

    if (error) {
      console.error("❌ Error fetching filtered clothes:", error);
      alert("Error fetching data");
    } else {
      console.log("✅ Filtered clothes:", data);
      setFilteredResults(data);
      // auto scroll to results
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  // 🔍 Find matching opposite items
  const findMatchingItems = async () => {
    if (!clothesType || !selectedColor) {
      alert("Please select both clothing type and color first!");
      return;
    }

    if (suggestedMatchingColors.length === 0) {
      alert("No matching colors found!");
      return;
    }

    setLoading(true);

    // Determine the opposite clothing type
    const oppositeType = clothesType === "shirt" ? "pant" : "shirt";

    let query = supabase.from("outfit_metadata").select("*");

    // Occasion filter
    if (selectedOccasions.length > 0) {
      query = query.in("occasion", selectedOccasions);
    }

    // Get opposite items in matching colors
    query = query.eq("category", oppositeType).in("color", suggestedMatchingColors);

    const { data, error } = await query;

    setLoading(false);

    if (error) {
      console.error("❌ Error fetching matching clothes:", error);
      alert("Error fetching data");
    } else {
      console.log("✅ Matching clothes:", data);
      setFilteredResults(data);
      // auto scroll to results
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  // 🧹 Clear all filters
  const clearFilters = () => {
    setSelectedOccasions([]);
    setWeatherSelected(false);
    setClothesType("");
    setSelectedColor("");
    setSuggestedMatchingColors([]);
    setFilteredResults([]);
  };

  // 🧱 Render button group for multi-selects - capitalize first letter for display
  const renderMultiSelect = (items, selected, setter) => (
    <div style={styles.buttonGrid}>
      {items.map((item) => (
        <button
          key={item}
          onClick={() => toggleMultiSelect(item, selected, setter)}
          style={{
            ...styles.optionButton,
            background: selected.includes(item) ? "#ff7f50" : "#f3f3f3",
            color: selected.includes(item) ? "#fff" : "#000",
            border: selected.includes(item)
              ? "2px solid #ff7f50"
              : "1px solid #ccc",
          }}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </div>
  );

  // 🎨 Render color palette interface
  const renderClothesFilter = () => (
    <div style={styles.clothesContainer}>
      {/* Step 1: Select Shirt or Pant */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>1. Choose Clothing Type</h4>
        <div style={styles.buttonGrid}>
          <button
            onClick={() => handleClothesTypeSelect("shirt")}
            style={{
              ...styles.optionButton,
              background: clothesType === "shirt" ? "#ff7f50" : "#f3f3f3",
              color: clothesType === "shirt" ? "#fff" : "#000",
              border: clothesType === "shirt" ? "2px solid #ff7f50" : "1px solid #ccc",
            }}
          >
            👕 Shirt
          </button>
          <button
            onClick={() => handleClothesTypeSelect("pant")}
            style={{
              ...styles.optionButton,
              background: clothesType === "pant" ? "#ff7f50" : "#f3f3f3",
              color: clothesType === "pant" ? "#fff" : "#000",
              border: clothesType === "pant" ? "2px solid #ff7f50" : "1px solid #ccc",
            }}
          >
            👖 Pant
          </button>
        </div>
      </div>

      {/* Step 2: Select Color */}
      {clothesType && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            2. Select {clothesType === "shirt" ? "Shirt" : "Pant"} Color
          </h4>
          <div style={styles.colorGrid}>
            {colorList.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                style={{
                  ...styles.colorButton,
                  background: selectedColor === color ? "#ff7f50" : "#f3f3f3",
                  color: selectedColor === color ? "#fff" : "#000",
                  border: selectedColor === color 
                    ? "3px solid #ff7f50" 
                    : "2px solid #ccc",
                }}
              >
                <div 
                  style={{
                    width: 30,
                    height: 30,
                    background: color === "grey" ? "#808080" : color === "beige" ? "#F5F5DC" : color,
                    border: "2px solid #333",
                    borderRadius: 5,
                    marginBottom: 5,
                  }}
                />
                {color.charAt(0).toUpperCase() + color.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Show Suggested Matching Colors */}
      {clothesType && selectedColor && suggestedMatchingColors.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            ✨ Suggested {clothesType === "shirt" ? "Pant" : "Shirt"} Colors for {selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)} {clothesType === "shirt" ? "Shirt" : "Pant"}
          </h4>
          <div style={styles.suggestedColors}>
            {suggestedMatchingColors.map((color) => (
              <div key={color} style={styles.suggestedColorChip}>
                <div 
                  style={{
                    width: 24,
                    height: 24,
                    background: color === "grey" ? "#808080" : color === "beige" ? "#F5F5DC" : color,
                    border: "2px solid #333",
                    borderRadius: "50%",
                    marginRight: 8,
                  }}
                />
                <span>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
              </div>
            ))}
          </div>
          <div style={styles.actionButtonsContainer}>
            <button
              onClick={applyFilters}
              style={styles.secondaryButton}
              disabled={loading}
            >
              {loading ? "Loading..." : `Show ${clothesType === "shirt" ? "Shirts" : "Pants"} in ${selectedColor}`}
            </button>
            <button
              onClick={findMatchingItems}
              style={styles.primaryButton}
              disabled={loading}
            >
              {loading ? "Loading..." : `Find Matching ${clothesType === "shirt" ? "Pants" : "Shirts"}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={() => window.history.back()} style={styles.backButton}>
        <AiOutlineArrowLeft size={28} color="#ff7f50" /> Back
      </button>

      <h2 style={styles.title}>Filter Clothes</h2>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["weather", "occasion", "clothes"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              ...styles.tabButton,
              background: selectedTab === tab ? "#ff7f50" : "#f1f1f1",
              color: selectedTab === tab ? "#fff" : "#000",
              border: selectedTab === tab
                ? "2px solid #ff7f50"
                : "1px solid #ccc",
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
            ...styles.weatherButton,
            background: weatherSelected ? "#ff7f50" : "#f1f1f1",
            color: weatherSelected ? "#fff" : "#000",
            border: weatherSelected
              ? "2px solid #ff7f50"
              : "1px solid #ccc",
          }}
        >
          Weather Based Suggestions {weatherSelected ? "✅" : ""}
        </button>
      )}

      {selectedTab === "occasion" &&
        renderMultiSelect(occasionsList, selectedOccasions, setSelectedOccasions)}
      
      {selectedTab === "clothes" && renderClothesFilter()}

      {/* Clear Button */}
      {selectedTab === "clothes" && (
        <button
          onClick={clearFilters}
          style={{
            ...styles.applyButton,
            background: '#6a5d7b',
            marginTop: 20,
          }}
        >
          Clear All Filters
        </button>
      )}

      {/* Apply Button for Weather/Occasion tabs */}
      {(selectedTab === "weather" || selectedTab === "occasion") && (
        <button
          onClick={applyFilters}
          style={styles.applyButton}
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply Filters"}
        </button>
      )}

      {/* 🧥 Filtered Results Section */}
      {filteredResults.length > 0 && (
        <div style={styles.resultsContainer}>
          <h3 style={{ textAlign: "center", marginBottom: 15 }}>
            {clothesType ? `Found ${filteredResults.length} ${clothesType === "shirt" ? "Shirt(s)" : "Pant(s)"}` : "Filtered Outfits"}
          </h3>
          <div style={styles.grid}>
            {filteredResults.map((item) => (
              <div key={item.id} style={styles.card}>
                <img
                  src={item.image_url || item.image || "https://via.placeholder.com/150"}
                  alt={item.category}
                  style={styles.image}
                />
                <div style={styles.textBox}>
                  <p><b>Category:</b> {item.category}</p>
                  <p><b>Color:</b> {item.color}</p>
                  <p><b>Occasion:</b> {item.occasion}</p>
                  <p><b>Style:</b> {item.style}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredResults.length === 0 && loading === false && clothesType && selectedColor && (
        <div style={styles.noResults}>
          <p>No items found. Try different filters!</p>
        </div>
      )}
    </div>
  );
};

// 🎨 Inline Styles
const styles = {
  container: {
    padding: 20,
    paddingBottom: 100,
    fontFamily: "Arial, sans-serif",
    maxWidth: 700,
    margin: "0 auto",
  },
  backButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  title: {
    textAlign: "center",
    color: "#6a5d7b",
    marginBottom: 20,
  },
  tabContainer: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  tabButton: {
    padding: "10px 20px",
    borderRadius: 20,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 15,
  },
  optionButton: {
    padding: 10,
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  weatherButton: {
    padding: 12,
    borderRadius: 10,
    cursor: "pointer",
    width: "100%",
    transition: "all 0.3s ease",
  },
  applyButton: {
    marginTop: 30,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#ff7f50",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    fontSize: 16,
  },
  // 🎨 Clothes Filter Styles
  clothesContainer: {
    marginTop: 20,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    background: "#f9f9f9",
    borderRadius: 10,
  },
  sectionTitle: {
    color: "#6a5d7b",
    marginBottom: 10,
    fontSize: 16,
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: 10,
    marginTop: 10,
  },
  colorButton: {
    padding: 10,
    borderRadius: 10,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 12,
  },
  suggestedColors: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  suggestedColorChip: {
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    background: "#fff",
    border: "2px solid #ff7f50",
    borderRadius: 20,
    fontSize: 14,
  },
  actionButtonsContainer: {
    marginTop: 20,
    display: "flex",
    gap: 10,
    flexDirection: "column",
  },
  primaryButton: {
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#ff7f50",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    padding: 12,
    borderRadius: 10,
    border: "2px solid #ff7f50",
    background: "#fff",
    color: "#ff7f50",
    cursor: "pointer",
    fontSize: 16,
  },
  noResults: {
    textAlign: "center",
    padding: 40,
    color: "#666",
    fontSize: 16,
  },
  // 💅 Result Cards
  resultsContainer: {
    marginTop: 40,
    paddingBottom: 50,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 20,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease",
  },
  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },
  textBox: {
    padding: "10px",
    fontSize: "14px",
    color: "#333",
  },
};

export default Filter;