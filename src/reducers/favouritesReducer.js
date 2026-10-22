export const FAVOURITES_STORAGE_KEY = 'celebrare_gallery_favourites';

/**
 * Action Types for Favourites Reducer
 */
export const FAVOURITES_ACTIONS = {
  TOGGLE_FAVOURITE: 'TOGGLE_FAVOURITE',
};

/**
 * Lazy initializer function for useReducer.
 * Loads previously favourited photo IDs from localStorage.
 * 
 * @returns {string[]} Array of saved favourite photo IDs
 */
export function initFavourites() {
  try {
    const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to retrieve favourites from localStorage:', err);
    return [];
  }
}

/**
 * Favourites Reducer
 * Pure function to manage favourites state.
 *
 * @param {string[]} state - Current array of favourite photo IDs
 * @param {{ type: string, payload: string }} action
 * @returns {string[]} Next array of favourite photo IDs
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case FAVOURITES_ACTIONS.TOGGLE_FAVOURITE: {
      const photoId = action.payload;
      const isAlreadyFav = state.includes(photoId);

      if (isAlreadyFav) {
        // Remove from favourites
        return state.filter((id) => id !== photoId);
      } else {
        // Add to favourites
        return [...state, photoId];
      }
    }
    default:
      return state;
  }
}
