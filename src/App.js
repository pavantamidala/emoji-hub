import React, { useState, useEffect } from 'react';

const API_URL = 'https://emojihub.yurace.pro/api/all';

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    fetchEmojis();
  }, []);

  const fetchEmojis = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmojis(data);
         // Extract unique categories
      const uniqueCategories = new Set(data.map((emoji) => emoji.category));
      setFilteredCategories(Array.from(uniqueCategories));
      setFilteredEmojis(data);
      setCategoryFilter('');
      
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  const handleCategoryFilterChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    filterEmojis(category);
  };

  const filterEmojis = (category) => {
    if (category === '') {
      setFilteredEmojis(emojis);
    } else {
      const filtered = emojis.filter((emoji) =>
        emoji.category.toLowerCase().includes(category.toLowerCase())
      );
      setFilteredEmojis(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Emoji Hub</h1>
      <div className="filter">
        <label htmlFor="categoryFilter">Filter by category:</label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
        >
          <option value="">All</option>
          {filteredCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="emoji-list">
        {filteredEmojis.map((emoji,index) => (
          <div key={index} className="emoji-card">
            <div className="emoji">{emoji.htmlCode}</div>
            <div className="details">
              <p>Name: {emoji.name}</p>
              <p>Category: {emoji.category}</p>
              <p>Group: {emoji.group}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
