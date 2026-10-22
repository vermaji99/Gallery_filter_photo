export const FAVOURITES_STORAGE_KEY = 'photo_gallery_favourites';

/**
 * Action Types for Favourites Reducer
 */
export const FAVOURITES_ACTIONS = {
  TOGGLE_FAVOURITE: 'TOGGLE_FAVOURITE',
  RESTORE_FAVOURITES: 'RESTORE_FAVOURITES',
};

/**
 * Initial empty state before hydration
 */
export const initialFavouritesState = [];

/**
 * Safely loads and validates stored favourite IDs from localStorage.
 * Prevents invalid JSON, missing keys, or corrupted types from crashing the application.
 *
 * @returns {string[]} Array of valid string IDs
 */
export function loadStoredFavourites() {
  try {
    const raw = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Ensure all stored items are strings to prevent type mismatches
    return parsed.filter((id) => typeof id === 'string' || typeof id === 'number').map(String);
  } catch (err) {
    console.warn('Failed to load favourites from localStorage (corrupted data):', err);
    return [];
  }
}

/**
 * Pure reducer function managing favourite photo IDs.
 *
 * @param {string[]} state - Current list of favourite photo IDs
 * @param {{ type: string, payload?: any }} action
 * @returns {string[]} Next list of favourite photo IDs
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case FAVOURITES_ACTIONS.TOGGLE_FAVOURITE: {
      const id = String(action.payload);
      const isFav = state.includes(id);

      if (isFav) {
        return state.filter((existingId) => existingId !== id);
      } else {
        return [...state, id];
      }
    }

    case FAVOURITES_ACTIONS.RESTORE_FAVOURITES: {
      if (!Array.isArray(action.payload)) return state;
      return action.payload.map(String);
    }

    default:
      return state;
  }
}
