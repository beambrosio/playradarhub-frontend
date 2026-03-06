import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { isInWishlist, toggleWishlist } from '../utils/wishlist';
import './WishlistButton.css';

export default function WishlistButton({ game, onToggle, size = 'medium' }) {
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (game?.id) {
      setInWishlist(isInWishlist(game.id));
    }
  }, [game?.id]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!game?.id) return;

    const added = toggleWishlist(game);
    setInWishlist(added);
    onToggle?.(added);
  };

  return (
    <button
      className={`wishlist-button wishlist-button--${size} ${inWishlist ? 'wishlist-button--active' : ''}`}
      onClick={handleClick}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {inWishlist ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

