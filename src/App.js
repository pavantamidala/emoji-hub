import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

const API_URL = 'https://emojihub.yurace.pro/api/all';

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
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
    setCurrentPage(0);
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

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const offset = currentPage * emojisPerPage;
  const currentEmojis = filteredEmojis.slice(offset, offset + emojisPerPage);

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
        {currentEmojis.map((emoji, index) => (
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
        ))}
      </div>
      <div className="pagination">
        <ReactPaginate
          previousLabel={'Prev'}
          nextLabel={'Next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(filteredEmojis.length / emojisPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={'pagination-container'}
          activeClassName={'active'}
        />
      </div>
    </div>
  );
};

export default App;
