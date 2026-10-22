# Photo Gallery Web App

> **Celebrare — Frontend React Internship Pre-Screening Assignment**  
> Built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## 🚀 Live Demo & Repository
- **GitHub Repository**: [Link to your repo]
- **Screen Recording (5 Min)**: [Link to your Google Drive / YouTube video]

---

## 📋 Table of Contents
1. [Overview & Requirements](#overview--requirements)
2. [Tech Stack](#tech-stack)
3. [Key Implementation Highlights](#key-implementation-highlights)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [5-Minute Screen Recording Script & Walkthrough](#5-minute-screen-recording-script--walkthrough)

---

## 🎯 Overview & Requirements

This web app implements a responsive photo gallery adhering strictly to the assignment scope:

| # | Requirement | Implementation Details |
|---|---|---|
| **1** | **Project Setup** | Pure React + Vite + Tailwind CSS. Zero external UI component libraries (no MUI, no AntD, no Bootstrap). |
| **2** | **Fetch Photos from API** | Fetches 30 photos on load from `https://picsum.photos/v2/list?limit=30`. Includes loading spinner and graceful error handling with retry. |
| **3** | **Responsive Grid** | Desktop: 4 columns (`lg:grid-cols-4`), Tablet: 2 columns (`md:grid-cols-2`), Mobile: 1 column (`grid-cols-1`). Each card displays the photo, author name, and heart icon button. |
| **4** | **Search Filter** | Real-time filtering by author name as user types. No page reload and no extra API calls. |
| **5** | **Favourites with `useReducer`** | Toggles photos as favourites using `useReducer` (not `useState`). Persists favourites across page refreshes via `localStorage`. |
| **6** | **Custom Hook** | `useFetchPhotos` encapsulates API logic and returns `{ photos, loading, error, refetch }`. Used directly by `Gallery`. |
| **7** | **`useCallback` + `useMemo`** | `useCallback` memoizes the search change handler. `useMemo` computes the filtered photos list efficiently. |

---

## 🛠️ Tech Stack

- **React 19**: Modern functional components and React hooks.
- **Vite 8**: Ultra-fast module bundling and hot module replacement.
- **Tailwind CSS v4**: Utility-first responsive styling without external component libraries.
- **Oxlint**: Modern high-performance linter ensuring clean hooks and zero warnings.

---

## 🧠 Key Implementation Highlights

### 1. Custom Hook (`useFetchPhotos`)
- Fetches data once on mount with an `AbortController` to handle cleanup and prevent memory leaks.
- Returns `{ photos, loading, error, refetch }` allowing the UI to remain strictly presentation-oriented.
- Catches network/API issues and surfaces a clean error message with a retry trigger.

### 2. State Management with `useReducer` & `localStorage`
- The reducer is kept **pure** (free of side effects).
- **Lazy Initialization (`initFavourites`)**: Reads from `localStorage` once during component initialization.
- **Persistence Effect (`useEffect`)**: Synchronizes changes to `localStorage` whenever the favourites array updates.
- Reducer handles `TOGGLE_FAVOURITE` to either add an ID or remove it if already present.

### 3. Performance Optimization (`useCallback` & `useMemo`)
- **`useCallback` on `handleSearchChange`**: Prevents recreating the handler function on every render, allowing the memoized `SearchBar` component (`React.memo`) to avoid redundant re-renders when other states (like favourites) change.
- **`useMemo` on `filteredPhotos`**: Recomputes the filtered array **only** when `photos` or `searchTerm` changes. Clicking favourite buttons re-renders the gallery without needlessly re-filtering 30 items.

---

## 📁 Project Structure

```text
Celebrare/
├── public/
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx    # Error state banner with retry button
│   │   ├── Gallery.jsx          # Core gallery container managing hooks & grid
│   │   ├── LoadingSpinner.jsx   # Accessible animated loading spinner
│   │   ├── PhotoCard.jsx        # Individual card with image, author, and heart button
│   │   └── SearchBar.jsx        # Memoized search input with clear button
│   ├── hooks/
│   │   └── useFetchPhotos.js    # Custom data-fetching hook
│   ├── reducers/
│   │   └── favouritesReducer.js # Pure reducer + localStorage lazy initializer
│   ├── App.jsx                  # Root layout component
│   ├── index.css                # Tailwind CSS base styles
│   └── main.jsx                 # Entry point
├── index.html                   # HTML template with page title & favicon
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

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd Celebrare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run build check:**
   ```bash
   npm run build
   ```

5. **Run linter:**
   ```bash
   npm run lint
   ```

---

## 📹 5-Minute Screen Recording Script & Walkthrough

Follow this breakdown to confidently record your 5-minute explanation:

### Step 1: Show the App Working (1 Minute)
- **Open the browser at `http://localhost:5173`:**
  - Notice the loading spinner appears initially while the Picsum API is fetching.
  - 30 photos appear in a responsive grid (show resizing from Desktop 4 columns, to Tablet 2 columns, to Mobile 1 column).
  - Type in the search box (e.g., search for "Alejandro" or "Paul") — notice photos filter instantaneously in real-time without page reload.
  - Click the heart icon on several photos — notice the heart turns filled rose/red and the counter badge updates.
  - Refresh the page (`F5`) — point out that favourited photos remain favourited because they are persisted in `localStorage`.

### Step 2: Explain `useFetchPhotos` Custom Hook (45 Seconds)
- Open `src/hooks/useFetchPhotos.js`.
- **Explain:**
  - *"Our custom hook encapsulates all data fetching logic away from UI components. It returns four values: `photos`, `loading`, `error`, and `refetch`."*
  - *"Inside `useEffect`, we invoke the API with an `AbortController`. If the user leaves the page or unmounts the component, the signal cancels pending requests to avoid memory leaks."*
  - *"If the API fails (e.g., status is not ok or network error), the catch block captures the error message, sets `loading` to false, and populates `error`. The Gallery component then renders our `<ErrorMessage />` component with a retry button instead of crashing."*

### Step 3: Explain `useReducer` Code (1 Minute)
- Open `src/reducers/favouritesReducer.js`.
- **Explain:**
  - *"We manage the favourites state with `useReducer` instead of `useState`."*
  - *"The reducer handles the `TOGGLE_FAVOURITE` action. If the photo ID already exists in the state array, it filters it out; if not, it appends it using immutable array spreading."*
  - *"Why `useReducer` instead of `useState`? When state logic becomes more complex or involves multiple sub-values, actions, or future extensions (like clearing all favourites or sorting), `useReducer` decouples 'what happened' (actions) from 'how state updates' (pure reducer function). It keeps the reducer 100% pure and easy to unit-test."*
  - *"Notice we use lazy initialization `initFavourites` to read from `localStorage` once on mount, and `useEffect` in the Gallery component to write updates back to `localStorage`. This keeps side effects strictly out of the reducer."*

### Step 4: Explain `useCallback` and `useMemo` (1 Minute)
- Open `src/components/Gallery.jsx`.
- **Explain:**
  - *"**`useCallback`** is applied to `handleSearchChange`. In React, functions are re-created on every render by default. Because `SearchBar` is wrapped in `React.memo`, passing a memoized callback ensures `SearchBar` does not re-render when other unrelated states (like clicking a favourite heart) change in the gallery."*
  - *"**`useMemo`** is used to compute `filteredPhotos`. It filters the 30 photos by author name. Because of `useMemo`, this filtering calculation ONLY runs when `photos` or `searchTerm` changes. When a user clicks the heart icon to toggle a favourite, `filteredPhotos` is NOT recalculated."*
  - *"**What would break if removed?** The app would still visually work, but it would waste CPU cycles re-running the filter logic and re-rendering child components on every single state change. In larger galleries with hundreds of items, this leads to sluggish input and UI stutter."*

### Step 5: Explain One Thing That Was Difficult & How You Solved It (45 Seconds)
- **Pick this real, technical challenge:**
  - *"One interesting challenge was handling `localStorage` synchronization with `useReducer` without violating React's purity rules. Placing `localStorage.setItem` directly inside the reducer function would make the reducer impure and cause issues with React 19's StrictMode double-rendering. To solve this cleanly, I used a lazy initializer `initFavourites` for reading on initial load, and a dedicated `useEffect` hook watching `favourites` to perform the storage write. This preserves the pure function contract of the reducer while guaranteeing 100% reliable persistence across page refreshes."*
