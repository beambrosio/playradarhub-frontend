import './SearchFilters.css';

export function SearchFilters({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
}) {
  return (
    <div className="search-filters">
      <div className="search-bar">
        <label htmlFor="search" className="visually-hidden">
          Search games
        </label>
        <input
          id="search"
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filters-row">
        <label htmlFor="genre">Genres</label>
        <select
          id="genre"
          value={filters.genre}
          onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
        >
          <option value="">All Genres</option>
          <option value="rpg">RPG</option>
          <option value="strategy">Strategy</option>
          <option value="adventure">Adventure</option>
          <option value="action">Action</option>
          <option value="shooter">Shooter</option>
          <option value="puzzle">Puzzle</option>
          <option value="simulation">Simulation</option>
          <option value="sports">Sports</option>
        </select>

        <label htmlFor="platform">Platforms</label>
        <select
          id="platform"
          value={filters.platform}
          onChange={(e) =>
            onFilterChange({ ...filters, platform: e.target.value })
          }
        >
          <option value="">All Platforms</option>
          <option value="pc">PC</option>
          <option value="playstation">PlayStation</option>
          <option value="xbox">Xbox</option>
          <option value="nintendo">Nintendo</option>
          <option value="mobile">Mobile</option>
        </select>

        <label htmlFor="ordering">Order By</label>
        <select
          id="ordering"
          value={filters.ordering}
          onChange={(e) =>
            onFilterChange({ ...filters, ordering: e.target.value })
          }
        >
          <option value="">Default Order</option>
          <option value="name">Name (A-Z)</option>
          <option value="-name">Name (Z-A)</option>
{/*           <option value="-first_release_date">Newest First</option> */}
{/*           <option value="first_release_date">Oldest First</option> */}
        </select>
      </div>
    </div>
  );
}