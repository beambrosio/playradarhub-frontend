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

  // Use centralized filter hook and expose UI setters
  const { filteredGames, searchTerm: hookSearchTerm, filters: hookFilters, setSearchTerm: setHookSearchTerm, setFilters: setHookFilters } = useGameFilters(games);
  const [searchTerm, setSearchTerm] = useState(hookSearchTerm);
  const [filters, setFilters] = useState(hookFilters);
  useEffect(() => { setSearchTerm(hookSearchTerm); }, [hookSearchTerm]);
  useEffect(() => { setFilters(hookFilters); }, [hookFilters]);
  useEffect(() => { setHookSearchTerm(searchTerm); }, [searchTerm]);
  useEffect(() => { setHookFilters(filters); }, [filters]);

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
            `/api/all_games?limit=20&offset=${offset}&sort_by=hypes%20desc`
          );
          if (!response.ok) {
            const errText = await response.text().catch(()=>'<no body>');
            throw new Error(`Error fetching games: ${response.status} - ${errText}`);
          }
          const text = await response.text();
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error('Failed parsing JSON from /api/all_games:', text);
            throw new Error('Invalid JSON response from server');
          }

          const gamesArray = Array.isArray(data)
            ? data
            : data.games || data.results || [];
          // Deduplicate incoming items using id/_id/name and avoid duplicates across pages
          const existingIds = new Set((games || []).map((g) => g.id ?? g._id ?? g.name));
          const uniqueGames = [];
          for (const game of gamesArray) {
            const id = game.id ?? game._id ?? game.name ?? JSON.stringify(game);
            if (!existingIds.has(id)) {
              existingIds.add(id);
              uniqueGames.push(game);
            }
          }
          setGames((prevGames) => {
            // second-level guard: ensure items in prevGames are unique by id
            const prevIds = new Set(prevGames.map((g) => g.id ?? g._id ?? g.name));
            const filteredNew = uniqueGames.filter((g) => {
              const id = g.id ?? g._id ?? g.name ?? JSON.stringify(g);
              if (prevIds.has(id)) return false;
              prevIds.add(id);
              return true;
            });
            return [...prevGames, ...filteredNew];
          });
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
