// Wishlist/Favorites utility functions using localStorage

const WISHLIST_KEY = 'playradarhub_wishlist';

export function getWishlist() {
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error reading wishlist:', e);
    return [];
  }
}

export function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    return true;
  } catch (e) {
    console.error('Error saving wishlist:', e);
    return false;
  }
}

export function isInWishlist(gameId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === gameId);
}

export function addToWishlist(game) {
  const wishlist = getWishlist();
  if (!isInWishlist(game.id)) {
    const item = {
      id: game.id,
      name: game.name,
      cover: game.cover,
      first_release_date: game.first_release_date,
      platforms: game.platforms,
      addedAt: Date.now(),
    };
    wishlist.push(item);
    saveWishlist(wishlist);
    return true;
  }
  return false;
}

export function removeFromWishlist(gameId) {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.id !== gameId);
  saveWishlist(filtered);
  return true;
}

export function toggleWishlist(game) {
  if (isInWishlist(game.id)) {
    removeFromWishlist(game.id);
    return false; // removed
  } else {
    addToWishlist(game);
    return true; // added
  }
}

