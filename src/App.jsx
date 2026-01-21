import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Carousel from "./components/Carousel";
import GameList from "./components/GameList";
import Sidebar from "./components/Sidebar";
import { FaBars } from "react-icons/fa";
import styles from "./styles";
import { getPlatformIcon } from "./utils/platformIcons";
import { getHighResImage } from "./utils/igdbImage";
import { formatDate } from "./utils/formatDate";
import { Helmet } from "react-helmet";
import Games from "./pages/Games";
import About from "./pages/About";
import './global.css';

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await fetch("https://playradarhub-backend-54816317792.us-central1.run.app/api/games");
        if (!res.ok) throw new Error("Erro ao buscar jogos");
        const data = await res.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGames();
  }, []);

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

    // Se tiver menos de 5, completa com próximos lançamentos futuros (sem repetir)
    if (carouselGames.length < 5) {
      const futureGames = games
        .filter((game) =>
          game.first_release_date &&
          (game.first_release_date * 1000) > Date.now() &&
          !carouselGames.some(g => g.id === game.id)
        )
        .sort((a, b) => a.first_release_date - b.first_release_date)
        .slice(0, 6 - carouselGames.length);

      carouselGames = [...carouselGames, ...futureGames];
    }
  } else {
    const futureGames = games
      .filter((game) => game.first_release_date && (game.first_release_date * 1000) > Date.now())
      .sort((a, b) => a.first_release_date - b.first_release_date)
      .slice(0, 5);

    if (futureGames.length > 0) {
      carouselGames = futureGames;
    } else {
      // Se não houver futuros, pega até 5 jogos passados mais recentes
      const pastGames = games
        .filter((game) => game.first_release_date && (game.first_release_date * 1000) <= Date.now())
        .sort((a, b) => b.first_release_date - a.first_release_date)
        .slice(0, 5);
      carouselGames = pastGames;
    }
  }

  const restGames = games.filter((game) => !carouselGames.includes(game));

  console.log("carouselGames", carouselGames);
  console.log("games", games);

  const handleCardClick = (game) => setSelectedGame(game);
  const handleCloseModal = () => setSelectedGame(null);

  // Get all platforms from all games
  const allPlatforms = Array.from(
    new Set(
      games.flatMap(game => game.platforms || [])
    )
  );

  // Se cada plataforma é um objeto, normalize para array de objetos únicos:
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



  // Filter games by selected platform
  const filteredGames = selectedPlatform
    ? games.filter(game => (game.platforms || []).includes(selectedPlatform))
    : games;

  // Filter carousel and restGames by platform
  const filteredCarouselGames = selectedPlatform
    ? carouselGames.filter(game =>
        (game.platforms || []).some(
          plat => (plat.name || plat) === selectedPlatform
        )
      )
    : carouselGames;

  const filteredRestGames = selectedPlatform
    ? restGames.filter(game =>
        (game.platforms || []).some(
          plat => (plat.name || plat) === selectedPlatform
        )
      )
    : restGames;



  return (
  <Router>
    <Helmet>
        <title>PlayRadarHub — Upcoming Game Releases</title>
        <meta name="description" content="PlayRadarHub — discover upcoming game releases, platforms and release dates." />
        <link rel="canonical" href="https://yourdomain.example/" />
        <meta property="og:title" content="PlayRadarHub — Upcoming Game Releases" />
        <meta property="og:description" content="Discover upcoming game releases, platform support and release dates." />
      </Helmet>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "#181818",
        color: "#0ff",
        height: 56,
        padding: "0 24px",
        boxShadow: "0 2px 8px #0008",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10001,
        textShadow: "0 0 4px #0ff",
      }}
    >
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
        aria-label="Abrir menu"
      >
        <FaBars />
      </button>
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 26, fontWeight: 700 }}>
        PlayRadarHub
      </span>
    </div>

    {/* Sidebar */}
    <Sidebar expanded={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />

    {/* Conteúdo principal */}
    <div style={{ ...styles.container, paddingLeft: sidebarOpen ? 180 : 56, paddingTop: 56 }}>
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
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "32px 0 16px 8px",
                }}
              >
                <h2 style={{ color: "#0ff", fontFamily: "'Orbitron', sans-serif", margin: 0 }}>
                  Next week
                </h2>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  style={{
                    marginLeft: 16,
                    fontSize: 16,
                    padding: "4px 8px",
                    borderRadius: 6,
                    border: "1px solid #222",
                    background: "#181818",
                    color: "#0ff",
                  }}
                >
                  <option value="">All Platforms</option>
                  {uniquePlatforms.map((platform) => (
                    <option key={platform.id || platform} value={platform.name || platform}>
                      {platform.name || platform}
                    </option>
                  ))}
                </select>
              </div>
              <GameList
                games={filteredRestGames}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
                getPlatformIcon={getPlatformIcon}
                onCardClick={handleCardClick}
              />
            </>
          }
        />
        <Route path="/games" element={<Games />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
    <footer style={styles.footer}>Made in 2025 | Contact: PlayRadarHub@gmail.com</footer>
    {selectedGame && (
      <div
        style={{
          position: "fixed",
          top: 56,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: 8,
          boxSizing: "border-box",
          overflowY: "auto",
        }}
        onClick={handleCloseModal}
      >
        <div
          style={{
            background: "#222",
            color: "#fff",
            borderRadius: 12,
            padding: "1.2em",
            maxWidth: 420,
            width: "100%",
            maxHeight: "calc(90vh - 56px)",
            overflowY: "auto",
            boxShadow: "0 0 24px #0ff",
            position: "relative",
            margin: "8px 0 16px 0",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            wordBreak: "break-word",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleCloseModal}
            style={{
              position: "absolute",
              top: 12,
              right: 16,
              background: "none",
              border: "none",
              color: "#0ff",
              fontSize: "1.5em",
              cursor: "pointer",
            }}
            aria-label="Close"
          >
            ×
          </button>
          <h2 style={{ color: "#0ff", fontSize: "1.2em" }}>{selectedGame.name}</h2>
          <p style={{ color: "#aaa", margin: "4px 0 12px 0" }}>
            Release: {formatDate(selectedGame.first_release_date)}
          </p>
          {selectedGame.cover && (
            <img
              src={getHighResImage(selectedGame.cover.url)}
              alt={selectedGame.name}
              style={{
                width: "100%",
                maxWidth: "100%",
                borderRadius: 8,
                marginBottom: 16,
                height: "auto",
                objectFit: "contain",
              }}
            />
          )}
          <p className="modal-description" style={{ fontSize: "1em" }}>
            {selectedGame.summary || "No description available."}
          </p>
        </div>
      </div>
    )}
  </Router>
);
}
export default App;
