import { useState } from "react";
import "../styles/searchbar.css";

function Searchbar({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleChange(e) {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  }

  return (
    <div className="searchbar-container">
      <input
        type="text"
        className="searchbar-input"
        placeholder="Search by Title or Description"
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}

export default Searchbar;

