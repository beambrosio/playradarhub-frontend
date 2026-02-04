// utils/gameUtils.js

// Fetch games from the API
export const fetchGames = async (setGames) => {
  try {
    const response = await fetch(
      "/api/all_games"
    );
    if (!response.ok) {
      const errText = await response.text().catch(()=>'<no body>');
      throw new Error(`Failed to fetch games: ${response.status} - ${errText}`);
    }
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed parsing JSON from /api/all_games:', text);
      return;
    }
    setGames(data);
  } catch (error) {
    console.error("Error fetching games:", error);
  }
};

// utils/gameUtils.js

// Extract platforms from a game object
export const extractPlatforms = (game) => {
  if (!game) return [];
  if (Array.isArray(game.platforms) && game.platforms.length) {
    return game.platforms
      .map((p) =>
        typeof p === "string"
          ? p
          : (p && (p.name || p.abbreviation || p.slug)) || "",
      )
      .filter(Boolean);
  }
  if (Array.isArray(game.platforms_names) && game.platforms_names.length)
    return game.platforms_names.slice();
  if (game.platform) {
    if (Array.isArray(game.platform))
      return game.platform.map((p) =>
        typeof p === "string" ? p : p.name || "",
      );
    if (typeof game.platform === "string") return [game.platform];
    if (typeof game.platform === "object")
      return [game.platform.name || game.platform.abbreviation || ""];
  }
  return [];
};



// Filter games by release date
export const filterGamesByDate = (games) => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  const carouselGames = games.filter((game) => {
    const releaseDate = new Date(game.releaseDate);
    return releaseDate >= now && releaseDate <= nextWeek;
  });

  const restGames = games.filter((game) => {
    const releaseDate = new Date(game.releaseDate);
    return releaseDate > nextWeek;
  });

  return { carouselGames, restGames };
};

// Get unique platforms from the games list
export const getUniquePlatforms = (games) => {
  const platforms = new Set();
  games.forEach((game) => {
    (game.platforms || []).forEach((platform) => {
      platforms.add(platform.name || platform);
    });
  });
  return Array.from(platforms);
};
