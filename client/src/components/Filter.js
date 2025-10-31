// components/Filter.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { createClient } from "@supabase/supabase-js";

// 🧩 Supabase setup (CRA uses process.env.REACT_APP_...)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables are missing. Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🎯 Filter options
const occasionsList = ["Casual", "College", "Dinner", "Streetwear", "Party", "Wedding", "Gym"];
const colorList = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Brown"];

const Filter = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("weather");
  const [weatherSelected, setWeatherSelected] = useState(false);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🌀 Toggle multi-select buttons
  const toggleMultiSelect = (item, list, setter) => {
    setter(
      list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item]
    );
  };

  // 📤 Apply filters -> fetch data from Supabase
  const applyFilters = async () => {
    if (!supabaseUrl || !supabaseAnonKey) {
      alert("Supabase not configured properly!");
      return;
    }

    setLoading(true);

    let query = supabase.from("clothing_items").select("*");

    if (selectedOccasions.length > 0) {
      query = query.in("occasion", selectedOccasions);
    }

    if (selectedColors.length > 0) {
      query = query.in("color", selectedColors);
    }

    if (weatherSelected) {
      query = query.eq("weather_based", true);
    }

    const { data, error } = await query;

    setLoading(false);

    if (error) {
      console.error("❌ Error fetching filtered clothes:", error);
      alert("Error fetching data");
    } else {
      console.log("✅ Filtered clothes:", data);
      // 🔁 Pass data to previous page (example)
      navigate("/wardrobe", { state: { results: data } });
    }
  };

  // 🧱 Render button group for multi-selects
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
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Back Button */}
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <AiOutlineArrowLeft size={28} color="#ff7f50" /> Back
      </button>

      <h2 style={styles.title}>Filter Clothes</h2>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["weather", "occasion", "color"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
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
      {selectedTab === "color" &&
        renderMultiSelect(colorList, selectedColors, setSelectedColors)}

      {/* Apply Button */}
      <button
        onClick={applyFilters}
        style={styles.applyButton}
        disabled={loading}
      >
        {loading ? "Applying..." : "Apply Filters"}
      </button>
    </div>
  );
};

// 🎨 Inline Styles
const styles = {
  container: {
    padding: 20,
    paddingBottom: 100,
    fontFamily: "Arial, sans-serif",
    maxWidth: 500,
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
};

export default Filter;
