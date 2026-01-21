import React from 'react';


export function SearchFilters({ searchTerm, filters, onSearchChange, onFilterChange }) {
  const handleFilterChange = (key, value) => {
    onFilterChange(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{ padding: '0.5rem', minWidth: '200px' }}
      />

      <select
        value={filters.genre}
          onChange={(e) => onFilterChange({ ...filters, genre: e.target.value })}
        style={{ padding: '0.5rem' }}
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

      <select
        value={filters.platform}
        onChange={(e) => onFilterChange({ ...filters, platform: e.target.value })}
      >
        <option value="">All Platforms</option>
        <option value="pc">PC</option>
        <option value="playstation">PlayStation</option>
        <option value="xbox">Xbox</option>
        <option value="nintendo">Nintendo</option>
        <option value="mobile">Mobile</option>
      </select>

      <select
        value={filters.ordering}
        onChange={(e) => onFilterChange({ ...filters, ordering: e.target.value })}

      >
        <option value="">Default Order</option>
        <option value="name">Name (A-Z)</option>
        <option value="-name">Name (Z-A)</option>
        <option value="-first_release_date">Newest First</option>
        <option value="first_release_date">Oldest First</option>
      </select>
    </div>
  );
}
