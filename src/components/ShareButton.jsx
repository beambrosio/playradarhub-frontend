import React, { useState } from 'react';
import { FaShare, FaTwitter, FaFacebook, FaReddit, FaLink } from 'react-icons/fa';
import './ShareButton.css';

export default function ShareButton({ game, onShare, size = 'medium' }) {
  const [showMenu, setShowMenu] = useState(false);

  if (!game) return null;

  const shareUrl = `${window.location.origin}${window.location.pathname}#game=${game.id}`;
  const shareText = `Check out ${game.name} on PlayRadarHub!`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      onShare?.('Link copied!', 'success');
      setShowMenu(false);
    } catch (err) {
      onShare?.('Failed to copy link', 'error');
    }
  };

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setShowMenu(false);
    onShare?.(`Shared to ${platform}`, 'success');
  };

  return (
    <div className="share-button-container">
      <button
        className={`share-button share-button--${size}`}
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Share game"
        title="Share"
      >
        <FaShare />
      </button>

      {showMenu && (
        <>
          <div className="share-backdrop" onClick={() => setShowMenu(false)} />
          <div className="share-menu">
            <button
              className="share-menu-item"
              onClick={() => handleShare('twitter')}
              aria-label="Share on Twitter"
            >
              <FaTwitter /> Twitter
            </button>
            <button
              className="share-menu-item"
              onClick={() => handleShare('facebook')}
              aria-label="Share on Facebook"
            >
              <FaFacebook /> Facebook
            </button>
            <button
              className="share-menu-item"
              onClick={() => handleShare('reddit')}
              aria-label="Share on Reddit"
            >
              <FaReddit /> Reddit
            </button>
            <button
              className="share-menu-item"
              onClick={copyLink}
              aria-label="Copy link"
            >
              <FaLink /> Copy Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}

