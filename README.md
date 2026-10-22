# Photo Gallery Web App

> A minimal, editorial photography gallery built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## 📋 Table of Contents
1. [Overview & Requirements](#overview--requirements)
2. [Tech Stack](#tech-stack)
3. [Data Source & Image Delivery Optimization](#data-source--image-delivery-optimization)
4. [Key Implementation Highlights](#key-implementation-highlights)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [5-Minute Screen Recording Script & Walkthrough](#5-minute-screen-recording-script--walkthrough)

---

## 🎯 Overview & Requirements

This web app implements a responsive photo gallery adhering strictly to the assignment specifications:

| # | Requirement | Implementation Details |
|---|---|---|
| **1** | **Project Setup** | Pure React + Vite + Tailwind CSS. Zero external UI component libraries (no MUI, no AntD, no Bootstrap). |
| **2** | **Fetch Photos from API** | Fetches 30 photos on initial load from `https://picsum.photos/v2/list?limit=30`. Features a minimal loading indicator and graceful error handling. |
| **3** | **Responsive Grid** | Desktop: 4 columns (`lg:grid-cols-4`), Tablet: 2 columns (`md:grid-cols-2`), Mobile: 1 column (`grid-cols-1`). Each card displays the 4:3 photo, author name, and heart icon button. |
| **4** | **Real-Time Search** | Real-time filtering by author name as the user types. Case-insensitive and trimmed. No page reload and no duplicate API requests. |
| **5** | **Favourites with `useReducer`** | Toggles photos as favourites using `useReducer` (not `useState`). Persists favourite photo IDs across page refreshes via `localStorage`. |
| **6** | **Custom Hook** | `useFetchPhotos` encapsulates API logic and returns `{ photos, loading, error, refetch }`. Used directly by `Gallery`. |
| **7** | **`useCallback` + `useMemo`** | `useCallback` memoizes the search change handler. `useMemo` computes the filtered photos list efficiently. |

---

## 🛠️ Tech Stack

- **React 19**: Modern functional components and React hooks.
- **Vite 8**: Fast module bundling and hot module replacement.
- **Tailwind CSS v4**: Utility-first styling with a warm neutral editorial aesthetic.
- **Oxlint**: Modern linter ensuring clean hooks and zero warnings.

---

## 🖼️ Data Source & Image Delivery Optimization

### 1. Data Source — Picsum Photos API
We use the Picsum Photos API, as required by Requirement 2 of the assignment.
- **Endpoint**: `https://picsum.photos/v2/list?limit=30`
- **Implementation**: `src/hooks/useFetchPhotos.js`

The custom `useFetchPhotos` hook fetches 30 photo records when the application loads. Each record includes:
- `id`: A unique identifier for the photo.
- `author`: The photographer's name, used by the search filter.
- `width` and `height`: The source image dimensions.
- `url`: A link to the photo's Picsum page.
- `download_url`: The full-resolution image URL provided by the API.

### 2. Image Delivery Optimization
Instead of loading unnecessarily large source images (often $5000 \times 3333$ pixels, which can be 5–10 MB per image), we request appropriately sized images for the gallery using Picsum's image URL format:

```jsx
<img
  src={`https://picsum.photos/id/${photo.id}/800/600`}
  alt={`Photo by ${photo.author}`}
  loading="lazy"
/>
```

This requests an $800 \times 600$ image for each photo, which is suitable for a gallery card with a 4:3 aspect ratio. Resizing images significantly reduces network bandwidth and accelerates initial rendering while preserving high-DPI clarity.

### 3. Why We Chose This Approach
The application fetches photo metadata once on initial load through the custom hook. Search filtering operates entirely on the already-fetched data without making additional API requests.

The combination of appropriately sized images, reusable fetching logic, and client-side filtering keeps the application responsive and performant across all devices.

---

## 🧠 Key Implementation Highlights

### 1. Custom Hook (`useFetchPhotos`)
- Fetches data once on component mount with an `AbortController` to cancel active requests if unmounted.
- Validates `response.ok` and checks that the payload is a valid array of items.
- Returns `{ photos, loading, error, refetch }`.

### 2. State Management with `useReducer` & `localStorage`
- Reducer is kept **pure** (free of side effects).
- **Lazy Initialization (`loadStoredFavourites`)**: Reads and validates saved IDs from `localStorage` once during initial render.
- **Persistence Effect (`useEffect`)**: Synchronizes changes to `localStorage` whenever the `favourites` array updates.
- Reducer supports `TOGGLE_FAVOURITE` and `RESTORE_FAVOURITES`.

### 3. Performance Optimization (`useCallback` & `useMemo`)
- **`useCallback` on `handleSearchChange`**: Prevents recreating the handler function on every render, allowing the memoized `SearchBar` (`React.memo`) to avoid redundant re-renders when other states (like toggling a favourite) update.
- **`useMemo` on `filteredPhotos`**: Recomputes the filtered array **only** when `photos`, `searchTerm`, `favourites`, or `activeTab` changes.

---

## 📁 Project Structure

```text
Celebrare/
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx    # Minimalist error state with retry
│   │   ├── Gallery.jsx          # Core gallery container managing hooks & grid
│   │   ├── LoadingSpinner.jsx   # Accessible animated loading indicator
│   │   ├── PhotoCard.jsx        # 4:3 Aspect ratio card with image, author & heart toggle
│   │   └── SearchBar.jsx        # Memoized search input with clear button
│   ├── hooks/
│   │   └── useFetchPhotos.js    # Custom data-fetching hook returning { photos, loading, error, refetch }
│   ├── reducers/
│   │   └── favouritesReducer.js # Pure reducer + localStorage lazy initializer
│   ├── App.jsx                  # Root layout with warm neutral palette
│   ├── index.css                # Tailwind CSS base styles & typography
│   └── main.jsx                 # Application entry point
├── index.html                   # Clean HTML template
├── package.json
├── vite.config.js               # Vite configuration with Tailwind CSS plugin
└── README.md
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Run build check:**
   ```bash
   npm run build
   ```

4. **Run linter:**
   ```bash
   npm run lint
   ```

---

## 📹 5-Minute Screen Recording Script & Walkthrough

### Step 1: Show the App Working (~1 minute)
- **Open the browser at `http://localhost:5173`:**
  - Notice the loading spinner appears initially while the Picsum API is fetching 30 photographs.
  - The photographs appear in a responsive grid (show resizing from Desktop 4 columns, to Tablet 2 columns, to Mobile 1 column).
  - Type in the search box (e.g., `"Alejandro"` or `"Paul"`) — notice the live count updates (e.g. *"Showing 2 of 30 photographs"*) and results filter instantaneously in real-time.
  - Click the heart icon on several photos — notice the heart fills with a refined rose color and the accessible aria state toggles.
  - Switch to the **Favourites** tab to show only saved items.
  - Refresh the page (`F5`) — point out that favorited photos persist after refresh via `localStorage`.

### Step 2: Open `useFetchPhotos` Custom Hook (~45 seconds)
- Open `src/hooks/useFetchPhotos.js`.
- **Key points to say:**
  - *"Our custom hook encapsulates all data fetching logic away from UI components. It returns `photos`, `loading`, `error`, and `refetch`."*
  - *"Inside `useEffect`, we invoke the Picsum API with an `AbortController`. If the component unmounts, the signal cancels any pending fetch to avoid memory leaks."*
  - *"We check `response.ok` and validate that the payload is an array. If an HTTP error or network failure occurs, the catch block sets the error state, loading is cleared in `finally`, and the Gallery renders an accessible `ErrorMessage`."*

### Step 3: Open `useReducer` Code (~1 minute)
- Open `src/reducers/favouritesReducer.js` and `src/components/Gallery.jsx`.
- **Key points to say:**
  - *"We manage favourites using `useReducer` instead of `useState`."*
  - *"The reducer handles `TOGGLE_FAVOURITE` and `RESTORE_FAVOURITES`. When toggling, if the photo ID already exists, it filters it out; otherwise, it appends it immutably."*
  - *"Why `useReducer`? It decouples 'what happened' from 'how state transitions', keeping state transitions pure, predictable, and maintainable."*
  - *"For persistence, we use a lazy initializer `loadStoredFavourites` to safely parse `localStorage` once on initial mount without crashing if data is corrupted. Then, `useEffect` synchronizes any state updates back to `localStorage`, keeping side effects strictly outside of the pure reducer."*

### Step 4: Open Component with `useCallback` and `useMemo` (~1 minute)
- Open `src/components/Gallery.jsx`.
- **Key points to say:**
  - *"**`useCallback`** is applied to `handleSearchChange`. Because `SearchBar` is wrapped in `React.memo`, passing a memoized callback ensures that typing or toggling favourites does not cause unnecessary re-renders of the search component."*
  - *"**`useMemo`** computes `filteredPhotos`. The case-insensitive filtering only re-runs when either `photos` or `searchTerm` changes. When a user clicks the heart icon to toggle a favourite, `filteredPhotos` is not re-computed."*
  - *"**What would break if removed?** The app would still visually function, but it would waste CPU cycles re-running array filters and re-rendering child components on every single state change."*

### Step 5: Explain One Thing That Was Difficult & How You Solved It (~45 seconds)
- **Key points to say:**
  - *"An important technical challenge was handling `localStorage` synchronization with `useReducer` without introducing side effects into the reducer function. Placing storage writes directly inside a reducer breaks React's purity rules and leads to duplicate writes during React 19's StrictMode double-invocations. I solved this by using a lazy initializer function `loadStoredFavourites` as the third argument to `useReducer` to safely hydrate stored IDs on mount, and synchronizing state to `localStorage` in a separate `useEffect` hook."*
