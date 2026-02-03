import React, { useEffect, useState, useRef } from "react";
import { useGameFilters } from "../hooks/useGameFilters";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Carousel from "../components/Carousel";
import GameList from "../components/GameList";
import Sidebar from "../components/Sidebar";
import { FaBars, FaSearch } from "react-icons/fa";
import styles from "../styles";
import { getPlatformIcon } from "../utils/platformIcons";
import { getHighResImage } from "../utils/igdbImage";
import { Helmet } from "react-helmet-async";
import Games from "../pages/Games";
import About from "../pages/About";

import "../global.css";
import { ThemeProvider } from "../context/ThemeContext";
import { HelmetProvider } from 'react-helmet-async';
import ThemeToggle from "../components/ThemeToggle";
import "../styles/responsive.css";
import GameModal from "../components/GameModal";
import { SearchFilters } from "../components/SearchFilters";
import SlideOver from "../components/SlideOver";
import "../components/SlideOver.css";

function App() {
  const [games, setGames] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  // Use the hook's persistence; delegate storage to useGameFilters
  // Delegate filter state and persistence to the useGameFilters hook
  const { filteredGames, searchTerm: hookSearchTerm, filters: hookFilters, setSearchTerm: setHookSearchTerm, setFilters: setHookFilters } = useGameFilters(games);
  const [searchTerm, setSearchTerm] = useState(hookSearchTerm);
  const [filters, setFilters] = useState(hookFilters);
  const [filterOpen, setFilterOpen] = useState(false);

  // Keep local state in sync with hook state
  useEffect(() => { setSearchTerm(hookSearchTerm); }, [hookSearchTerm]);
  useEffect(() => { setFilters(hookFilters); }, [hookFilters]);

  // When UI updates local search/filter, propagate back to hook
  useEffect(() => { setHookSearchTerm(searchTerm); }, [searchTerm]);
  useEffect(() => { setHookFilters(filters); }, [filters]);
  const observer = useRef();

  const criticalStyles = {
    body: {
      margin: 0,
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#181818",
      color: "#fff",
    },
  };

  useEffect(() => {
    Object.assign(document.body.style, criticalStyles.body);
  }, []);


  const fetchGames = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://playradarhub-backend-54816317792.us-central1.run.app/api/next_week_release?limit=20&offset=${offset}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setGames((prevGames) => {
          // Deduplicate by id/_id/name while preserving order
          const seen = new Set(prevGames.map((g) => g.id ?? g._id ?? g.name));
          const unique = [];
          for (const game of data) {
            const id = game.id ?? game._id ?? game.name ?? JSON.stringify(game);
            if (!seen.has(id)) {
              seen.add(id);
              unique.push(game);
            }
          }
          return [...prevGames, ...unique];
        });
      setHasMore(data.length > 0); // Stop loading if no more games
        if (data.length > 0) {
          setOffset((prevOffset) => prevOffset + 20); // Increment offset only if new data is fetched
        }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [offset]);

  const lastGameRef = useRef();
  useEffect(() => {
    if (loading) return;

    const handleObserver = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset((prevOffset) => prevOffset + 20);
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (lastGameRef.current) {
      observer.current.observe(lastGameRef.current);
    }

    return () => {
      if (observer.current && lastGameRef.current) {
        observer.current.unobserve(lastGameRef.current);
      }
    };
  }, [loading, hasMore]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const gamesToday = games.filter((game) => {
    if (!game.first_release_date) return false;
    const releaseDate = new Date(game.first_release_date * 1000);
    releaseDate.setHours(0, 0, 0, 0);
    return releaseDate.getTime() === today.getTime();
  });

  let carouselGames = [];
  if (gamesToday.length > 0) {
    carouselGames = gamesToday.slice(0, 5);

    if (carouselGames.length < 5) {
      const futureGames = games
        .filter(
          (game) =>
            game.first_release_date &&
            game.first_release_date * 1000 > Date.now() &&
            !carouselGames.some((g) => g.id === game.id),
        )
        .sort((a, b) => a.first_release_date - b.first_release_date)
        .slice(0, 6 - carouselGames.length);

      carouselGames = [...carouselGames, ...futureGames];
    }
  } else {
    const futureGames = games
      .filter(
        (game) =>
          game.first_release_date &&
          game.first_release_date * 1000 > Date.now(),
      )
      .sort((a, b) => a.first_release_date - b.first_release_date)
      .slice(0, 5);

    if (futureGames.length > 0) {
      carouselGames = futureGames;
    } else {
      const pastGames = games
        .filter(
          (game) =>
            game.first_release_date &&
            game.first_release_date * 1000 <= Date.now(),
        )
        .sort((a, b) => b.first_release_date - a.first_release_date)
        .slice(0, 5);
      carouselGames = pastGames;
    }
  }

  const restGames = games.filter((game) => !carouselGames.includes(game));

  const handleCardClick = (game) => setSelectedGame(game);
  const handleCloseModal = () => setSelectedGame(null);
  const closeModal = () => setSelectedGame(null);

  const uniquePlatforms = [];
  const seen = new Set();
  for (const game of games) {
    for (const plat of game.platforms || []) {
      const name = plat.name || plat;
      if (!seen.has(name)) {
        seen.add(name);
        uniquePlatforms.push(plat);
      }
    }
  }

  const filteredRestGames = (searchTerm || filters.genre || filters.platform || filters.ordering || selectedPlatform)
    ? restGames.filter((game) => {
        // searchTerm filter
        if (searchTerm && !(game.name || "").toLowerCase().includes(searchTerm.toLowerCase())) return false;
        // genre filter
        if (filters.genre) {
          if (!Array.isArray(game.genres) || !game.genres.some((g)=> (typeof g==="string"?g:g.name||g.slug||"").toLowerCase().includes(filters.genre.toLowerCase()))) return false;
        }
        // platform filter
        if (filters.platform || selectedPlatform) {
          const wanted = (filters.platform || selectedPlatform).toLowerCase();
          const plats = (game.platforms||[]).map(p=> typeof p==='string'?p:(p && (p.name||p.abbreviation||p.slug))||"");
          if (!plats.some(p=>p.toLowerCase().includes(wanted))) return false;
        }
        return true;
      })
    : restGames;

  return (
    <HelmetProvider>
    <ThemeProvider>
      <Router>
        <Helmet>
          <link
            rel="preload"
            href="/fonts/orbitron.woff2"
            as="font"
            type="font/woff2"
            crossorigin="anonymous"
          />
          <title>PlayRadarHub — Upcoming Game Releases</title>
          <meta
            name="description"
            content="PlayRadarHub — discover upcoming game releases, platforms and release dates."
          />
          <link rel="canonical" href="https://playradarhub.com/" />
          <meta
            property="og:title"
            content="PlayRadarHub — Upcoming Game Releases"
          />
          <meta
            property="og:description"
            content="Discover upcoming game releases, platform support and release dates."
          />
        </Helmet>
        <header className="app-header">
          <button
            onClick={() => setSidebarOpen((open) => !open)}
            style={{
              background: "none",
              border: "none",
              color: "#0ff",
              fontSize: 28,
              marginLeft: -25,
              marginRight: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 56,
              width: 56,
              padding: 0,
            }}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <FaBars />
          </button>

          <span className="app-brand" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 26, fontWeight: 700 }}>
            PlayRadarHub
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
            <button aria-label="Open search" onClick={() => setFilterOpen(true)} style={{ background: "none", border: "none", color: "#0ff", fontSize: 20, cursor: "pointer", padding: 8 }}>
              <FaSearch />
            </button>
            <ThemeToggle aria-label="Toggle theme" />
          </div>
        </header>
        <Sidebar
          expanded={sidebarOpen}
          onToggle={() => setSidebarOpen((open) => !open)}
        />

        <div
          style={{
            ...styles.container,
            paddingLeft: sidebarOpen ? 180 : 56,
            paddingTop: 56,
          }}
        >
          <div style={{ display: 'none' }}>
            <div style={{ flex: 1 }}>
              <SearchFilters
                searchTerm={searchTerm}
                filters={filters}
                onSearchChange={(v) => setSearchTerm(v)}
                onFilterChange={(newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }))}
              />
            </div>
          </div>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div style={{ ...styles.carouselWrapper, marginTop: 32 }}>
                    <Carousel
                        games={carouselGames}
                        getPlatformIcon={getPlatformIcon}
                        title="Next games"
                        setSelectedGame={setSelectedGame}
                        selectedGame={selectedGame}
                        onCardClick={handleCardClick}
                        keyExtractor={(game, index) => `${game.id || 'unknown'}-${index}`}

                    />
                    {selectedGame && (
                        <GameModal game={selectedGame} onClose={closeModal} />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      margin: "32px 0 16px 8px",
                    }}
                  >
                    <h2
                      style={{
                        color: "#0ff",
                        fontFamily: "'Orbitron', sans-serif",
                        margin: 0,
                      }}
                    >
                      Next week
                    </h2>
                  </div>
                  <GameList
                    games={filteredRestGames}
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    getPlatformIcon={getPlatformIcon}
                    onCardClick={handleCardClick}
                    lastGameRef={lastGameRef}
                    keyExtractor={(game, index) => `${game.id}-${index}`}
                  />

                </>
              }
            />
            <Route path="/games" element={<Games />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <footer style={styles.footer}>
          Made in 2025 | Contact: PlayRadarHub@gmail.com
        </footer>
        <SlideOver
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={(v)=>setSearchTerm(v)}
          onFilterChange={(newFilters)=>setFilters((prev)=>({ ...prev, ...newFilters }))}
        />
        {selectedGame && (
          <GameModal game={selectedGame} onClose={handleCloseModal} />
        )}
      </Router>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
