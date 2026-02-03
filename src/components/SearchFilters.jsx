import React, { useId, useRef } from 'react';
import './SearchFilters.css';

export function SearchFilters({
  searchTerm,
  filters,
  onSearchChange,
  onFilterChange,
  idPrefix,
}) {
  // Use React's useId when available for stable, unique IDs; fallback to a random id per instance
  const reactIdAvailable = typeof useId === 'function';
  const baseId = reactIdAvailable ? useId() : undefined;
  const uidRef = useRef(baseId || Math.random().toString(36).slice(2, 8));
  const prefix = idPrefix ? `${idPrefix}-` : `${uidRef.current}-`;

  const searchId = `${prefix}search`;
  const genreId = `${prefix}genre`;
  const platformId = `${prefix}platform`;
  const orderingId = `${prefix}ordering`;

  return (
    <div className="search-filters">
      <div className="search-bar">
        <label htmlFor={searchId} className="visually-hidden">
          Search games
        </label>
        <input
          id={searchId}
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filters-row">
        <label htmlFor={genreId}>Genres</label>
        <select
          id={genreId}
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

        <label htmlFor={platformId}>Platforms</label>
        <select
          id={platformId}
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

        <label htmlFor={orderingId}>Order By</label>
        <select
          id={orderingId}
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
