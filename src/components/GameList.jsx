import styles from "./GameList.styles";
import { useGameFilters } from "../hooks/useGameFilters";
import { SearchFilters } from "./SearchFilters";

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="100%" height="100%" fill="%230b0b0b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-family="Arial" font-size="14">No image</text></svg>';

function normalizeIgdbId(input) {
  if (!input) return "";
  let s = String(input).trim();
  if (s.startsWith("//")) s = "https:" + s;
  const m = s.match(/\/([^\/?#]+)(?:[?#].*)?$/);
  if (m && m[1]) return m[1].replace(/\.(jpg|jpeg|png)$/i, "");
  const p = s.match(/^([a-z0-9_]+)(?:\.(jpg|jpeg|png))?$/i);
  if (p) return p[1];
  return "";
}

function igdbUrl(idOrUrl, size = "t_cover_small") {
  if (!idOrUrl) return "";
  const s = String(idOrUrl);
  if (/^https?:\/\/images\.igdb\.com\/igdb\/image\/upload\//i.test(s)) {
    if (/\/t_[^/]+\//.test(s)) return s.replace(/\/t_[^/]+\//, `/${size}/`);
    return s.replace("/upload/", `/upload/${size}/`);
  }
  if (/^[a-z0-9_]+$/i.test(s)) {
    return `https://images.igdb.com/igdb/image/upload/${size}/${s}.jpg`;
  }
  return s;
}

export function extractPlatforms(game) {
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
}

function formatReleaseDate(game) {
  const val =
    game?.released_at ??
    game?.release_date ??
    game?.first_release_date ??
    game?.released ??
    "";
  if (val === "" || val == null) return "";
  let d;
  if (typeof val === "number") {
    d = new Date(val > 1e12 ? val : val * 1000);
  } else if (typeof val === "string") {
    const asNum = Number(val);
    if (!Number.isNaN(asNum)) {
      d = new Date(asNum > 1e12 ? asNum : asNum * 1000);
    } else {
      d = new Date(val);
    }
  } else {
    return "";
  }
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

const platformIconMap = {
  pc: "pc.svg",
  windows: "pc.svg",
  steam: "pc.svg",
  playstation: "playstation.svg",
  ps: "playstation.svg",
  xbox: "xbox.svg",
  switch: "switch.svg",
  nintendo: "switch.svg",
  android: "android.svg",
  ios: "ios.svg",
  iphone: "ios.svg",
  ipad: "ios.svg",
  mac: "mac.svg",
  macos: "mac.svg",
  linux: "linux.svg",
};

function platformIconSrc(name) {
  const defaultIcon = "/icons/default.svg";
  if (!name) return defaultIcon;
  const s = String(name).toLowerCase();
  for (const key of Object.keys(platformIconMap)) {
    if (s.includes(key)) return `/icons/${platformIconMap[key]}`;
  }
  const slug = s.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (slug) return `/icons/${slug}.svg`;
  return defaultIcon;
}

export default function GameList({
  games = [],
  onCardClick,
  selectedGame,
  lastGameRef,
}) {
  const { filteredGames, searchTerm, filters, setSearchTerm, setFilters } =
    useGameFilters(games);
  if (!Array.isArray(filteredGames) || filteredGames.length === 0) {
    return (
      <div>
        <SearchFilters
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={setSearchTerm}
          onFilterChange={(newFilters) => setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))}
        />
        <div style={{ color: "#ccc", padding: 12 }}>No games found</div>
      </div>
    );
  }

  return (
    <div>
      <SearchFilters
        searchTerm={searchTerm}
        filters={filters}
        onSearchChange={setSearchTerm}
        onFilterChange={(newFilters) => setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }))}
      />
      <ul style={styles.grid}>
        {filteredGames.map((game, idx) => {
          const key = game?.id ?? game?.name ?? idx;
          const isSelected = selectedGame?.id === game?.id;
          const isLast = idx === filteredGames.length - 1;

          const rawCandidate =
            game?.background_image ||
            (Array.isArray(game?.screenshots) &&
              game.screenshots[0]?.image_id) ||
            game?.cover?.image_id ||
            game?.cover?.url ||
            game?.image_id ||
            game?.url ||
            game?.thumbnail ||
            "";

          const igdbId = normalizeIgdbId(rawCandidate);
          const thumb = igdbId
            ? igdbUrl(igdbId, "t_720p")
            : typeof rawCandidate === "string" &&
                /^https?:\/\//i.test(rawCandidate)
              ? rawCandidate
              : "";

          const imgSrc = thumb || PLACEHOLDER;
          const date = formatReleaseDate(game);
          const platforms = extractPlatforms(game);

          return (
            <li
              key={key}
              ref={isLast ? lastGameRef : null}
              style={{
                position: "relative",
                zIndex: 0,
                listStyle: "none",
                background: "#1a1a2e",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                border: isSelected ? "2px solid #0ff" : "2px solid transparent",
                transition: "transform 0.2s, border-color 0.2s",
              }}
              onClick={() => onCardClick?.(game)}
            >
              <img
                src={imgSrc}
                alt={game.name || "Game"}
                style={{ width: "100%", objectFit: "cover" }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = PLACEHOLDER;
                }}
              />
              <div style={{ padding: "12px" }}>
                <h3
                  style={{ color: "#fff", margin: "0 0 8px", fontSize: "1rem" }}
                >
                  {game.name || "Unknown"}
                </h3>
                {date && (
                  <p
                    style={{
                      color: "#888",
                      margin: "0 0 8px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {date}
                  </p>
                )}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {platforms.slice(0, 4).map((p, i) => (
                    <img
                      key={i}
                      src={platformIconSrc(p)}
                      alt={p}
                      title={p}
                      style={{
                        width: "18px",
                        height: "18px",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
