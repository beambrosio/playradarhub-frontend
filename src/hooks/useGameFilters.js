import { useState, useMemo, useEffect } from "react";

export function useGameFilters(games) {
  const STORAGE_KEY = "gameFilters";

  const [searchTerm, setSearchTerm] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return "";
      const parsed = JSON.parse(raw);
      return parsed.searchTerm || "";
    } catch (e) {
      return "";
    }
  });

  const [filters, setFilters] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { genre: "", platform: "", ordering: "" };
      const parsed = JSON.parse(raw);
      return parsed.filters || { genre: "", platform: "", ordering: "" };
    } catch (e) {
      return { genre: "", platform: "", ordering: "" };
    }
  });

  const filteredGames = useMemo(() => {
    let result = [...games];

    // Search filter
    if (searchTerm) {
      result = result.filter((game) =>
        game.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Genre filter
    if (filters.genre) {
      result = result.filter((game) => {
        if (Array.isArray(game.genres)) {
          return game.genres.some((g) =>
            (typeof g === "string" ? g : g.name || g.slug || "")
              .toLowerCase()
              .includes(filters.genre.toLowerCase()),
          );
        }
        return false;
      });
    }

    // Platform filter - matches your extractPlatforms logic
    if (filters.platform) {
      result = result.filter((game) => {
        let platforms = [];
        if (Array.isArray(game.platforms)) {
          platforms = game.platforms.map((p) =>
            typeof p === "string"
              ? p
              : p.name || p.abbreviation || p.slug || "",
          );
        } else if (Array.isArray(game.platforms_names)) {
          platforms = game.platforms_names;
        } else if (game.platform) {
          if (Array.isArray(game.platform)) {
            platforms = game.platform.map((p) =>
              typeof p === "string" ? p : p.name || "",
            );
          } else if (typeof game.platform === "string") {
            platforms = [game.platform];
          }
        }
        return platforms.some((p) =>
          p.toLowerCase().includes(filters.platform.toLowerCase()),
        );
      });
    }

    // Ordering
    if (filters.ordering === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (filters.ordering === "-name") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return result;
  }, [games, searchTerm, filters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ searchTerm, filters }));
    } catch (e) {}
  }, [searchTerm, filters]);

  return {
    filteredGames,
    searchTerm,
    filters,
    setSearchTerm,
    setFilters,
  };
}
