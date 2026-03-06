import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getWishlist, removeFromWishlist } from '../utils/wishlist';
import { FaTrash, FaGamepad } from 'react-icons/fa';
import Breadcrumb from '../components/Breadcrumb';
import BackToTop from '../components/BackToTop';
import { ToastContainer, useToast } from '../components/Toast';
import GameModal from '../components/GameModal';
import './Wishlist.css';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const items = getWishlist();
    setWishlist(items);
  };

  const handleRemove = (gameId) => {
    removeFromWishlist(gameId);
    loadWishlist();
    addToast('Removed from wishlist', 'info');
  };

  const handleCardClick = (item) => {
    // Convert wishlist item to full game object format
    const game = {
      id: item.id,
      name: item.name,
      cover: item.cover,
      first_release_date: item.first_release_date,
      platforms: item.platforms,
      summary: item.summary || `${item.name} - Check out this game!`,
    };
    setSelectedGame(game);
  };

  if (wishlist.length === 0) {
    return (
      <>
        <Helmet>
          <title>My Wishlist - PlayRadarHub</title>
          <meta name="description" content="Your saved games wishlist" />
        </Helmet>
        <Breadcrumb />
        <div className="wishlist-page">
          <div className="wishlist-empty">
            <FaGamepad className="wishlist-empty-icon" />
            <h1>Your Wishlist is Empty</h1>
            <p>Start adding games you're interested in by clicking the heart icon on any game!</p>
            <a href="/" className="wishlist-cta">Browse Games</a>
          </div>
        </div>
        <BackToTop />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - PlayRadarHub</title>
        <meta name="description" content={`Your wishlist with ${wishlist.length} saved games`} />
      </Helmet>
      <Breadcrumb />
      <div className="wishlist-page">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <span className="wishlist-count">{wishlist.length} {wishlist.length === 1 ? 'game' : 'games'}</span>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-card-image" onClick={() => handleCardClick(item)}>
                {item.cover?.url ? (
                  <img
                    src={item.cover.url.replace('t_thumb', 't_cover_big')}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => (e.target.src = '/icons/default.svg')}
                  />
                ) : (
                  <div className="wishlist-card-placeholder">
                    <FaGamepad />
                  </div>
                )}
              </div>
              <div className="wishlist-card-content">
                <h3 className="wishlist-card-title" onClick={() => handleCardClick(item)}>
                  {item.name}
                </h3>
                {item.first_release_date && (
                  <p className="wishlist-card-date">
                    {new Date(item.first_release_date * 1000).toLocaleDateString()}
                  </p>
                )}
                <button
                  className="wishlist-remove-btn"
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onToast={addToast}
        />
      )}

      <BackToTop />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

