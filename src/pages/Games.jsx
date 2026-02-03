import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { useGameFilters } from "../hooks/useGameFilters";
import { Helmet } from "react-helmet-async";

const GameList = lazy(() => import("../components/GameList"));
const GameModal = lazy(() => import("../components/GameModal"));

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const { filteredGames, searchTerm, filters, setSearchTerm, setFilters } =
    useGameFilters(games);

  useEffect(() => {
      const handleResize = () => {
        const elements = document.querySelectorAll(".game-card");

        // Batch reads
        const widths = Array.from(elements).map((el) => el.offsetWidth);

        // Batch writes
        requestAnimationFrame(() => {
          elements.forEach((el, index) => {
            el.style.width = `${widths[index]}px`;
          });
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const criticalStyles = {
      margin: 0,
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#181818",
      color: "#fff",
    };
    Object.assign(document.body.style, criticalStyles);

    let cancelled = false;

    const fetchGames = async () => {
        try {
          const response = await fetch(
            `https://playradarhub-backend-54816317792.us-central1.run.app/api/all_games?limit=20&offset=${offset}&sort_by=hypes%20desc`
          );
          if (!response.ok) throw new Error("Error fetching games");
          const data = await response.json();

          const gamesArray = Array.isArray(data)
            ? data
            : data.games || data.results || [];
          const uniqueGames = [];
          const seenIds = new Set(games.map((game) => game.id ?? game._id));
          for (const game of gamesArray) {
            const id = game.id ?? game._id;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              uniqueGames.push(game);
            }
          }
          setGames((prevGames) => [...prevGames, ...uniqueGames]);
          setHasMore(gamesArray.length > 0);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

    fetchGames();

    return () => {
      cancelled = true;
    };
  }, [offset]);


  const lastGameRef = useRef();
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset((prevOffset) => prevOffset + 20);
      }
    });

    if (lastGameRef.current) {
      observer.current.observe(lastGameRef.current);
    }
  }, [loading, hasMore]);

  if (loading && games.length === 0) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "100px" }}
      >
        <p style={{ color: "#0ff" }}>Loading games...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <link
          rel="preload"
          href="/fonts/orbitron.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        <div style={{ padding: "32px 16px" }}>
          <h1 style={{ color: "#0ff", fontFamily: "'Orbitron', sans-serif" }}>
            All Games
          </h1>

          <GameList
            games={filteredGames}
            selectedGame={selectedGame}
            setSelectedGame={setSelectedGame}
            onCardClick={(game) => setSelectedGame(game)}
            lastGameRef={lastGameRef}
            searchTerm={searchTerm}
            filters={filters}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilters}
            imageProps={{ loading: "lazy" }}
          />

          {games.length === 0 && !loading && (
            <p style={{ color: "#aaa", textAlign: "center" }}>No games found.</p>
          )}

          <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
        </div>
      </Suspense>
    </>
  );
}
