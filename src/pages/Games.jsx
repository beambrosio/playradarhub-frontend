import React, { useEffect, useState } from 'react';
import { useGameFilters } from '../hooks/useGameFilters';
import GameList from '../components/GameList';
import GameModal from '../components/GameModal';

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  const { filteredGames, searchTerm, filters, setSearchTerm, setFilters } = useGameFilters(games);

  useEffect(() => {
    let cancelled = false;

    async function fetchGames() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://playradarhub-backend-54816317792.us-central1.run.app/api/next_week_release`
        );
        if (!res.ok) throw new Error("Error fetching games");
        const data = await res.json();

        if (cancelled) return;

        const gamesArray = Array.isArray(data) ? data : (data.games || data.results || []);
        const uniqueGames = [];
        const seenIds = new Set();
        for (const game of gamesArray) {
          const id = game.id ?? game._id;
          if (id && !seenIds.has(id)) {
            seenIds.add(id);
            uniqueGames.push(game);
          }
        }
        setGames(uniqueGames);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGames();
    return () => { cancelled = true; };
  }, []);

  if (loading && games.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <p style={{ color: '#0ff' }}>Loading games...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 16px' }}>
      <h1 style={{ color: '#0ff', fontFamily: "'Orbitron', sans-serif" }}>All Games</h1>

      <GameList
        games={filteredGames}
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        onCardClick={(game) => setSelectedGame(game)}
        lastGameRef={null}
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={setFilters}
      />

      {games.length === 0 && !loading && (
        <p style={{ color: '#aaa', textAlign: 'center' }}>No games found.</p>
      )}

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
