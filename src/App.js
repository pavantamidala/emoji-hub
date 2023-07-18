import React, { useState, useEffect } from 'react';

const API_URL = 'https://emojihub.yurace.pro/api/all';

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [emojisPerPage] = useState(10);

  useEffect(() => {
    fetchEmojis();
  }, []);

  const fetchEmojis = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmojis(data);

      const uniqueCategories = Array.from(
        new Set(data.map((emoji) => emoji.category))
      );
      setFilteredCategories(uniqueCategories);

      filterEmojis(categoryFilter);
    } catch (error) {
      console.error('Error fetching emojis:', error);
    }
  };

  const handleCategoryFilterChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    setCurrentPage(1);
    filterEmojis(category);
  };

  const filterEmojis = (category) => {
    if (category === '') {
      setFilteredEmojis(emojis);
    } else {
      const filtered = emojis.filter(
        (emoji) => emoji.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredEmojis(filtered);
    }
  };

  const indexOfLastEmoji = currentPage * emojisPerPage;
  const indexOfFirstEmoji = indexOfLastEmoji - emojisPerPage;
  const currentEmojis = filteredEmojis.slice(
    indexOfFirstEmoji,
    indexOfLastEmoji
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        {currentEmojis.length > 0 ?currentEmojis.map((emoji, index) => (
          <div key={index} className="emoji-card">
            <div className="emoji">{emoji.htmlCode}</div>
            <p
              className="emoji-large"
              dangerouslySetInnerHTML={{ __html: emoji.htmlCode }}
            ></p>
            <div className="emoji-details">
              <p className="emoji-name">{emoji.name}</p>
              <p className="emoji-category">{emoji.category}</p>
              <p className="emoji-group">{emoji.group}</p>
            </div>
          </div>
        )):(
          <p>No emojis found.</p>
        )}
      </div>
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={() => paginate(currentPage - 1)}>Prev</button>
        )}
        {currentPage < Math.ceil(filteredEmojis.length / emojisPerPage) && (
          <button onClick={() => paginate(currentPage + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default App;
