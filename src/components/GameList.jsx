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

import React, { useState, useEffect } from 'react';
import Button from "./Button";


export default function GameList({
  games = [],
  onCardClick,
  selectedGame,
  lastGameRef,
}) {

  const { filteredGames, searchTerm, filters, setSearchTerm, setFilters } =
    useGameFilters(games);

  const [activeCalendar, setActiveCalendar] = useState(null);

  function pad(n) { return String(n).padStart(2, '0'); }
  function formatIcsDateUTC(d) { const yyyy = d.getUTCFullYear(); const mm = pad(d.getUTCMonth()+1); const dd = pad(d.getUTCDate()); return `${yyyy}${mm}${dd}`; }
  function escapeIcs(s='') { return String(s).replace(/\r?\n/g, '\\n').replace(/,/g,'\\,'); }
  function createIcsUrl(game) {
    const ts = game.first_release_date ? Number(game.first_release_date) * 1000 : Date.now();
    const d = new Date(ts);
    const dtStart = formatIcsDateUTC(d);
    const d2 = new Date(d);
    d2.setUTCDate(d2.getUTCDate() + 1);
    const dtEnd = formatIcsDateUTC(d2);
    const uid = `playradarhub-${game.id || Math.random().toString(36).slice(2)}`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PlayRadarHub//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${dtStart}`,
      `DTEND;VALUE=DATE:${dtEnd}`,
      `SUMMARY:Release — ${escapeIcs(game.name || 'Game')}`,
      `DESCRIPTION:${escapeIcs(game.summary || '')}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsLines], { type: 'text/calendar' });
    return URL.createObjectURL(blob);
  }
  function createGoogleUrl(game) {
    const ts = game.first_release_date ? Number(game.first_release_date) * 1000 : Date.now();
    const d = new Date(ts);
    const dtStart = formatIcsDateUTC(d);
    const d2 = new Date(d);
    d2.setUTCDate(d2.getUTCDate() + 1);
    const dtEnd = formatIcsDateUTC(d2);
    const gSummary = encodeURIComponent(`Release — ${game.name}`);
    const gDates = `${dtStart}/${dtEnd}`;
    const gDetails = encodeURIComponent(game.summary || '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${gSummary}&dates=${gDates}&details=${gDetails}`;
  }

  useEffect(() => {
    return () => {
      if (activeCalendar && activeCalendar.icsUrl) {
        try { URL.revokeObjectURL(activeCalendar.icsUrl); } catch (e) {}
      }
    };
  }, [activeCalendar]);
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
      <ul style={styles.grid} role="list">
        {filteredGames.map((game, idx) => {
          // Ensure stable and unique key even if backend returns duplicate ids
          const baseId = game?.id ?? game?._id ?? game?.name ?? String(idx);
          const key = `${baseId}-${idx}`;
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
            ? igdbUrl(igdbId, "t_1080p")
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
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCardClick?.(game);
                }
              }}
              className="game-card"
              style={{
                ...styles.card,
                border: isSelected ? "2px solid #0ff" : styles.card.border,
              }}
              onMouseEnter={(e)=>{ try{ e.currentTarget.style.transform = styles.cardHover.transform; e.currentTarget.style.boxShadow = styles.cardHover.boxShadow; }catch(err){} }}
              onMouseLeave={(e)=>{ try{ e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = styles.card.boxShadow; }catch(err){} }}
              onFocus={(e)=>{ try{ e.currentTarget.style.outline = styles.cardFocus.outline; e.currentTarget.style.boxShadow = styles.cardFocus.boxShadow; }catch(err){} }}
              onBlur={(e)=>{ try{ e.currentTarget.style.outline = ''; e.currentTarget.style.boxShadow = styles.card.boxShadow; }catch(err){} }}
              onClick={() => onCardClick?.(game)}
            >
              <div style={styles.thumbWrapper}>
                <img
                  src={imgSrc}
                  alt={game.name || "Game"}
                  style={styles.thumb}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER;
                  }}
                />
              </div>
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
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
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
              </div>
              {activeCalendar && activeCalendar.id === key && (
                <div className="in-card-calendar-popover" role="dialog" aria-label={`Calendar options for ${game.name}`}>
                  <Button variant="secondary" href={activeCalendar.icsUrl} download={`${(game.name || 'game').replace(/\s+/g, '_')}.ics`} style={{background:'rgba(0,0,0,0.14)', color:'var(--accent)'}} icon={<img src="/icons/download.svg" alt="download" style={{width:16,height:16}}/>}>
                    Download .ics
                  </Button>
                  <Button variant="secondary" href={createGoogleUrl(game)} target="_blank" rel="noopener noreferrer" style={{background:'rgba(0,0,0,0.14)', color:'var(--accent)'}} icon={<img src="/icons/google.svg" alt="google" style={{width:16,height:16}}/>}>
                    Add to Google
                  </Button>
                  <Button onClick={async ()=>{ try{ await navigator.clipboard.writeText(activeCalendar.icsUrl); }catch(e){} }} icon={<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>}>
                      Copy link
                    </Button>
                  <Button onClick={()=>{ setActiveCalendar(null); }}>
                    Close
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
