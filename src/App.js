import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Card, CardContent } from "@mui/material";
import { Grid } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

import Typography from "@mui/material/Typography";
const API_URL = "https://emojihub.yurace.pro/api/all";

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(2); // Set initial currentPage to 1
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
      console.error("Error fetching emojis:", error);
    }
  };

  
  const handleCategoryFilterChange = (event) => {
    const category = event.target.value;
    setCategoryFilter(category);
    setCurrentPage(1); // Reset currentPage to 1
    filterEmojis(category);
  };

  const filterEmojis = (category) => {
    if (category === "" || category === "All") {
      setFilteredEmojis(emojis);
    } else {
      const filtered = emojis.filter(
        (emoji) => emoji.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredEmojis(filtered);
    }
  };

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected + 1); // Subtract 1 from selected index
  };

  const offset = (currentPage - 1) * emojisPerPage; // Adjust offset calculation
  const currentEmojis = filteredEmojis.slice(
    offset,
    offset + emojisPerPage
  );

  return (
    <div className="App">
      <h1>Emoji Hub</h1>
      <div className="filter">
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel htmlFor="categoryFilter">Filter by category</InputLabel>
          <Select
            id="categoryFilter"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            label="Filter by category"
          >
            <MenuItem value="All">Select All</MenuItem>
            {filteredCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="emoji-list">
        <Grid container spacing={2}>
          {currentEmojis.map((emoji, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {emoji.htmlCode}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{ mb: 1 }}
                    dangerouslySetInnerHTML={{ __html: emoji.htmlCode }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {emoji.name}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {emoji.category}
                  </Typography>
                  <Typography variant="subtitle2">{emoji.group}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div className="pagination">
        {filteredEmojis.length > emojisPerPage && (
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(filteredEmojis.length / emojisPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination-container"}
            activeClassName={"active"}
            initialPage={currentPage - 1} // Set initial page index
          />
        )}
      </div>
    </div>
  );
};

export default App;
