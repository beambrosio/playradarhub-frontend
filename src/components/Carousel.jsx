import React, { useRef } from "react";
import "./Carousel.css";
import "./srOnly.css";
import platformIconsUtil from "../utils/platformIcons";
import getIgdbImage, { getHighResImage } from "../utils/igdbImage";

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="720"><rect width="100%" height="100%" fill="%23000000"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23FFFFFF" font-family="Arial" font-size="20" font-weight="bold">No image</text></svg>';

function buildSrcSet(input) {
  if (!input) return "";
  const sizes = [
    ["cover_small", 320],
    ["cover_big", 640],
    ["720p", 960],
    ["1080p", 1280],
  ];
  return sizes
    .map(([token, w]) => `${getIgdbImage(input, { size: token })} ${w}w`)
    .filter(Boolean)
    .join(", ");
}

function extractPlatforms(game) {
  if (!game) return [];
  if (Array.isArray(game.platforms) && game.platforms.length) {
    return game.platforms
      .map((p) => {
        if (!p) return null;
        if (typeof p === "string") return { id: undefined, name: p };
        return {
          id: p.id,
          name: p.name || p.abbreviation || p.slug || String(p.id || ""),
        };
      })
      .filter(Boolean);
  }
  if (Array.isArray(game.platforms_names) && game.platforms_names.length) {
    return game.platforms_names.map((n) => ({ name: n }));
  }
  if (game.platform) {
    if (Array.isArray(game.platform)) {
      return game.platform.map((p) =>
        typeof p === "string"
          ? { name: p }
          : { id: p.id, name: p.name || p.abbreviation || p.slug },
      );
    }
    if (typeof game.platform === "string") return [{ name: game.platform }];
    if (typeof game.platform === "object")
      return [
        {
          id: game.platform.id,
          name:
            game.platform.name ||
            game.platform.abbreviation ||
            game.platform.slug,
        },
      ];
  }
  return [];
}

const GENERIC_ICON_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" font-size="10" fill="%23fff" dominant-baseline="middle" text-anchor="middle">?</text></svg>',
  );

function normalizeIconPath(s) {
  if (!s) return `/icons/platform-generic.svg`;
  if (React.isValidElement(s)) return s;
  if (typeof s !== "string") s = String(s);
  s = s.trim();
  if (/^https?:\/\//i.test(s) || s.startsWith("data:") || s.startsWith("/"))
    return s;
  return s.includes("/") ? s : `/icons/${s}`;
}

function iconFileNameFromName(name) {
  if (!name) return "platform-generic.svg";
  const lower = String(name).toLowerCase();
  const ICON_MAP = {
    pc: "computer.png",
    windows: "pc.svg",
    playstation: "playstation.svg",
    ps5: "playstation.svg",
    ps4: "playstation.svg",
    xbox: "xbox.svg",
    switch: "switch.svg",
    android: "android.svg",
    ios: "ios.svg",
    stadia: "stadia.svg",
    mac: "mac.svg",
    linux: "linux.svg",
    steamvr: "steamvr.svg",
  };
  for (const key in ICON_MAP) {
    if (
      Object.prototype.hasOwnProperty.call(ICON_MAP, key) &&
      lower.includes(key)
    )
      return ICON_MAP[key];
  }
  return lower.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".svg";
}

export default function Carousel({
  games = [],
  getPlatformIcon = () => null,
  title,
  selectedGame,
  setSelectedGame,
  featured = false,
}) {
  // Wrap setSelectedGame to log attempts and then call the provided setter
  const safeSetSelectedGame = (g) => {
    if (typeof setSelectedGame === 'function') setSelectedGame(g);
  };
  const trackRef = useRef(null);
  const isDraggingRef = useRef(false);
  const maybeDraggingRef = useRef(false);
  const pointerCapturedRef = useRef(false);
  const pointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  function handleKeySelect(game, e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      safeSetSelectedGame(game);
    }
  }

  // Debug helper: log click attempts
  function logClickAttempt(game, reason) {
    try {
      
    } catch (e) {}
  }

  function resolveIconSource(platform) {
    const platformName =
      typeof platform === "string"
        ? platform
        : (platform && platform.name) || "";

    try {
      const provided = getPlatformIcon?.(platform);
      if (provided) return normalizeIconPath(provided);
    } catch (e) {}

    try {
      const utilResult =
        typeof platformIconsUtil === "function"
          ? platformIconsUtil(platformName)
          : platformIconsUtil &&
            platformIconsUtil[String((platformName || "").toLowerCase())];
      if (utilResult) return normalizeIconPath(utilResult);
    } catch (e) {}

    return normalizeIconPath(`/icons/${iconFileNameFromName(platformName)}`);
  }

  function renderPlatformIcon(platform, idx) {
    const srcOrElement = resolveIconSource(platform);
    if (React.isValidElement(srcOrElement)) return srcOrElement;

    const name =
      typeof platform === "string"
        ? platform
        : (platform && platform.name) || "";
    const src = srcOrElement || GENERIC_ICON_DATA_URI;

    return (
      <img
        src={src}
        alt={name || ""}
        title={name || ""}
        className="platform-icon-img"
        width={22}
        height={22}
        draggable={false}
        loading="lazy"
        onError={(e) => {
          const cur = e.currentTarget;
          cur.onerror = null;
          cur.src = GENERIC_ICON_DATA_URI;
          cur.classList.add("broken");
        }}
      />
    );
  }

  // Pointer drag handlers for click-and-drag scrolling (threshold-based)
  function onPointerDown(e) {
    const el = trackRef.current;
    if (!el) return;
    maybeDraggingRef.current = false;
    pointerDownRef.current = true;
    el.classList.remove("dragging");
    startXRef.current = e.clientX;
    scrollLeftRef.current = el.scrollLeft;

    // Attach global pointerup/pointercancel to ensure endDrag cleanup
    document.addEventListener("pointerup", endDragGlobal, true);
    document.addEventListener("pointercancel", endDragGlobal, true);
  }

  function onPointerMove(e) {
    const el = trackRef.current;
    if (!el) return;
    if (!pointerDownRef.current) return;
    const x = e.clientX;
    const walk = x - startXRef.current;
    // Only treat as dragging when movement exceeds threshold
    if (!isDraggingRef.current && Math.abs(walk) > 6) {
      isDraggingRef.current = true;
      maybeDraggingRef.current = true;
      el.classList.add("dragging");
      try {
        el.setPointerCapture(e.pointerId);
        pointerCapturedRef.current = true;
      } catch (err) {}
    }
    if (isDraggingRef.current) {
      e.preventDefault();
      el.scrollLeft = scrollLeftRef.current - walk;
    }
  }

  function endDrag(e) {
    const el = trackRef.current;
    if (!el) return;
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      el.classList.remove("dragging");
    }
    if (pointerCapturedRef.current) {
      try {
        el.releasePointerCapture(e.pointerId);
        pointerCapturedRef.current = false;
      } catch (err) {}
    }
    pointerDownRef.current = false;
    maybeDraggingRef.current = false;
  }

  function endDragGlobal(e) {
    endDrag(e);
    document.removeEventListener("pointerup", endDragGlobal, true);
    document.removeEventListener("pointercancel", endDragGlobal, true);
  }

  return (
    <div className={`carousel ${featured ? "carousel--featured" : ""}`}>
      {title ? <h2 className="carousel-title">{title}</h2> : null}
      <div className="sr-only" aria-hidden="true">Use left and right arrow keys to navigate</div>

      <div
        ref={trackRef}
        className="carousel-track"
        role="list"
        aria-label={title || "Games carousel"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        {games.map((game, idx) => {
          const key = (game?.id ?? game?.name ?? idx) + '-' + idx;
          const isSelected = selectedGame?.id === game?.id;
          const platforms = extractPlatforms(game);
          const date = game?.released_at
            ? new Date(game.released_at).toLocaleDateString()
            : game?.release_date || "Jan, 20 2026";

          const thumbSrc =
            getIgdbImage(game, { size: "cover_big" }) || PLACEHOLDER;
          const thumbSrcSet = buildSrcSet(game);

          return (
            <div
              key={key}
              className={`carousel-item ${isSelected ? "selected" : ""}`}
              role="button"
              tabIndex={0}
              onClick={(e) => { if (!isDraggingRef.current) { safeSetSelectedGame(game); } else { try {  } catch(e) {} } }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); safeSetSelectedGame(game); } }}
              aria-pressed={!!isSelected}
            >
            <button aria-hidden style={{position:'absolute', zIndex:0, opacity:0, inset:0, width:'100%', height:'100%', border:'none', padding:0, margin:0}} onClick={(e)=>{ e.stopPropagation(); safeSetSelectedGame(game); }} />
              <div className="carousel-thumb-wrap" style={{cursor: 'pointer'}}>
                <img
                  className="carousel-thumb"
                  src={thumbSrc}
                  srcSet={thumbSrcSet}
                  sizes="(max-width:480px) 320px, (max-width:900px) 640px, 1280px"
                  alt={game?.name ?? "game"}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.onerror = null;
                    img.src = PLACEHOLDER;
                    img.removeAttribute("srcset");
                  }}
                  onPointerUp={(e)=>{ if(!isDraggingRef.current){ try{ }catch(err){}; safeSetSelectedGame(game);} else { try{ }catch(err){} } }}
                />

                <div className="thumb-meta">
                  <div className="meta-row">
                    <a
                      className="meta-title"
                      href="#"
                      onClick={(ev) => ev.preventDefault()}
                    >
                      {game.name}
                    </a>
                    <div className="meta-right">
                      <span className="meta-date">{date}</span>
                      <div className="platform-row">
                        {platforms.length ? (
                          platforms.map((p, i) => (
                            <span
                              key={p.id ?? p.name ?? i}
                              className="platform-pill"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                              aria-label={p.name || "platform"}
                            >
                              {renderPlatformIcon(p, i)}
                            </span>
                          ))
                        ) : (
                          <span className="platform-pill">
                            {renderPlatformIcon("Unknown")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
