import platformIcons, { getPlatformIcon } from "../utils/platformIcons.jsx";
import { extractPlatforms } from "../components/GameList";
import React, { useEffect, useState } from "react";
import Button from "./Button";


export default function GameModal({ game, onClose }) {
  if (!game) return null;

  const modalRef = React.useRef(null);
  const previouslyFocusedRef = React.useRef(null);

  React.useEffect(() => {
    // store the previously focused element so we can restore focus when modal closes
    previouslyFocusedRef.current = document.activeElement;
    // move focus into the modal
    try { modalRef.current?.focus?.(); } catch (e) {}

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      if (e.key === 'Tab') {
        // trap focus inside the modal
        const container = modalRef.current;
        if (!container) return;
        const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      try { previouslyFocusedRef.current?.focus?.(); } catch (e) {}
    };
  }, [onClose]);

  const coverUrl = game?.cover?.url
    ? game.cover.url.replace("t_thumb", "t_cover_big")
    : "/icons/default-cover.svg";

  const platforms = extractPlatforms(game);

  const [icsUrl, setIcsUrl] = useState(null);
  useEffect(() => {
    if (!game) { setIcsUrl(null); return; }
    const ts = game.first_release_date ? Number(game.first_release_date) * 1000 : Date.now();
    const d = new Date(ts);
    const dtStart = formatIcsDateUTC(d);
    const d2 = new Date(d);
    d2.setUTCDate(d2.getUTCDate() + 1);
    const dtEnd = formatIcsDateUTC(d2);
    const uid = `playradarhub-${game.id || Math.random().toString(36).slice(2)}`;
    const dtstamp = new Date().toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
    const escapeIcs = (s = '') => String(s).replace(/\r?\n/g, '\\n').replace(/,/g, '\\,');
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
    const url = URL.createObjectURL(blob);
    setIcsUrl(url);
    return () => { try { URL.revokeObjectURL(url); } catch (e) {} };
  }, [game]);

  function pad(n) { return String(n).padStart(2, '0'); }
  function formatIcsDateUTC(d) { const yyyy = d.getUTCFullYear(); const mm = pad(d.getUTCMonth() + 1); const dd = pad(d.getUTCDate()); return `${yyyy}${mm}${dd}`; }
  function createGoogleUrl(game) { const ts = game.first_release_date ? Number(game.first_release_date) * 1000 : Date.now(); const d = new Date(ts); const dtStart = formatIcsDateUTC(d); const d2 = new Date(d); d2.setUTCDate(d2.getUTCDate() + 1); const dtEnd = formatIcsDateUTC(d2); const gSummary = encodeURIComponent(`Release — ${game.name}`); const gDates = `${dtStart}/${dtEnd}`; const gDetails = encodeURIComponent(game.summary || ''); return `https://www.google.com/calendar/render?action=TEMPLATE&text=${gSummary}&dates=${gDates}&details=${gDetails}`; }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="game-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1a1a2e",
          borderRadius: "12px",
          maxWidth: "1400px",
          width: "min(98%, 1400px)",
          maxHeight: "98vh",
          overflow: "auto",
          padding: "12px",
          border: "1px solid #0ff",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "10px",
            right: "12px",
            background: "transparent",
            border: "none",
            color: "var(--accent)",
            fontSize: "20px",
            cursor: "pointer",
            padding: 6,
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          ✕
        </button>

        <div className="modal-body">
          {coverUrl && (
            <img
              className="modal-cover"
              src={coverUrl}
              alt={game.name}
              loading="lazy"
              onError={(e) => (e.target.src = "/icons/default.svg")}
            />
          )}

          <div className="modal-content" style={{ flex: 1, minWidth: "200px" }}>
            <h2
              style={{
                color: "#0ff",
                fontFamily: "'Orbitron', sans-serif",
                marginTop: 0,
              }}
            >
              {game.name}
            </h2>

            {game.first_release_date && (
              <p style={{ color: "#aaa" }}>
                Release:{" "}
                {new Date(game.first_release_date * 1000).toLocaleDateString()}
              </p>
            )}

            {game.summary && (
              <p style={{ color: "#ccc", marginTop: "12px" }}>{game.summary}</p>
            )}

            {platforms && (
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                {platforms.map((platform, index) => {
                  const Icon = getPlatformIcon(platform);
                  return (
                    <span
                      key={index}
                      title={platform}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {Icon ? (
                        <img
                          src={Icon}
                          alt={platform}
                          loading="lazy"
                          onError={(e) => (e.target.src = "/icons/default.svg")}
                          style={{ width: "24px", height: "24px" }}
                        />
                      ) : (
                        platform
                      )}
                    </span>
                  );
                })}
              </div>
            )}
            <div className="calendar-actions" style={{ marginTop: "16px" }}>
              <Button
                variant="secondary"
                href={icsUrl}
                download={`${(game.name||'game').replace(/\s+/g,'_')}.ics`}
                aria-label="Download .ics"
                style={{ background: 'rgba(0,0,0,0.14)', color: 'var(--accent)' }}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M5 20h14v-2H5v2zm7-18L5.33 9h4.34v6h4.66V9h4.34L12 2z" />
                  </svg>
                }
              >
                Download .ics
              </Button>
              <Button
                variant="secondary"
                href={createGoogleUrl(game)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Add to Google"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path fill="currentColor" d="M21.6 12.23c0-.72-.06-1.41-.16-2.08H12v3.94h5.48c-.23 1.25-.92 2.3-1.96 3.01v2.5h3.17c1.85-1.71 2.91-4.24 2.91-7.37z"/>
                    <path fill="currentColor" d="M12 22c2.43 0 4.46-.8 5.95-2.17l-3.17-2.5c-.88.6-2.02.96-3.08.96-2.36 0-4.36-1.59-5.08-3.72H3.59v2.33C5.09 19.9 8.33 22 12 22z"/>
                    <path fill="currentColor" d="M6.92 13.9c-.21-.6-.33-1.24-.33-1.9 0-.66.12-1.3.33-1.9V7.77H3.59C2.62 9.52 2 11.62 2 13.99c0 2.36.62 4.47 1.59 6.22l3.33-2.31z"/>
                    <path fill="currentColor" d="M12 6.99c1.32 0 2.5.45 3.43 1.32l2.58-2.58C16.47 3.9 14.43 3 12 3 8.33 3 5.09 5.1 3.59 7.77l3.33 2.32C7.64 8.58 9.64 6.99 12 6.99z"/>
                  </svg>
                }
              >
                Add to Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
