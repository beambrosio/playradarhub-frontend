import React from 'react';
import { getPlatformIcon } from '../utils/platformIcons';

export default function GameModal({ game, onClose }) {
  if (!game) return null;

  const coverUrl = game.cover?.url?.replace('t_thumb', 't_cover_big') || '';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1a2e',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '24px',
          border: '1px solid #0ff'
        }}
      >
        <button
          onClick={onClose}
          style={{
            float: 'right',
            background: 'transparent',
            border: 'none',
            color: '#0ff',
            fontSize: '24px',
            cursor: 'pointer'
          }}
        >✕
        </button>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {coverUrl && (
            <img
              src={`https:${coverUrl}`}
              alt={game.name}
              style={{ borderRadius: '8px', maxWidth: '250px' }}
            />
          )}

          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ color: '#0ff', fontFamily: "'Orbitron', sans-serif", marginTop: 0 }}>
              {game.name}
            </h2>

            {game.first_release_date && (
              <p style={{ color: '#aaa' }}>
                Release: {new Date(game.first_release_date * 1000).toLocaleDateString()}
              </p>
            )}

            {game.platforms && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {game.platforms.map(p => (
                  <span key={p.id} title={p.name}>{getPlatformIcon(p.name)}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {game.summary && (
          <p style={{ color: '#ccc', marginTop: '20px', lineHeight: '1.6' }}>
            {game.summary}
          </p>
        )}
      </div>
    </div>
  );
}
