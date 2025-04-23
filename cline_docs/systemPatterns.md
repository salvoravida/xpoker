# System Patterns: X Poker React Remake

## Architecture Overview

The application will be a single-page application (SPA) built with React and TypeScript, managed by Vite.

## Key Technical Decisions & Patterns

1.  **UI Framework:** React will be used for building the user interface components.
2.  **Language:** TypeScript will provide static typing for better code quality and maintainability.
3.  **Build Tool:** Vite will be used for fast development server startup and optimized builds.
4.  **State Management:**
    *   For simple component-level state, React's built-in `useState` and `useReducer` hooks will be sufficient.
    *   For global game state (like credit, points, current hand, game phase), React Context API or a lightweight state management library (like Zustand or Jotai) might be considered if complexity grows. Initially, Context API seems appropriate.
5.  **Component Structure:**
    *   Break down the UI into reusable components (e.g., `Card`, `Hand`, `PayoutTable`, `GameInfo`, `Controls`).
    *   A main `Game` component will likely orchestrate the overall game flow and state.
6.  **Game Logic:**
    *   Encapsulate core game logic (deck creation, shuffling, dealing, hand evaluation, payout calculation) in separate TypeScript modules/functions or potentially a class (`PokerGameLogic`). This keeps the logic separate from the UI components.
    *   Hand evaluation logic will need careful implementation to match the original C++ code, including handling the Joker.
7.  **Styling:**
    *   CSS Modules or a utility-first CSS framework (like Tailwind CSS) will be used for styling to ensure scoped styles and maintainability. The goal is to visually approximate the original game's look and feel. Basic CSS will be used initially.
8.  **Data Persistence:**
    *   The original game saved options (`pokopz.dat`). For the web version, `localStorage` can be used to persist simple settings like the player's credit/points between sessions, simulating the save functionality.
9.  **No Backend:** This will be a purely frontend application. All game logic runs in the browser.

## Original C++ Code Mapping (Conceptual)

*   **`poker.cpp`:** Contains the main game loop (`main`), high-level game functions (`mano`, `secondamano`, `Raddoppio`), UI drawing (`stampacarta`, `DisegnaTavolo`), event handling (keyboard input), scoring (`CalcolaPunteggio`, `StampaVincita`), options (`SalvaOpzioni`, `CaricaOpzioni`), and constants.
    *   _React Equivalent:_ Main `App` or `Game` component, state management for game flow, UI components for rendering, event handlers for user interactions, utility functions/modules for scoring and options.
*   **`POKER2.CPP`:** Contains lower-level graphics functions (`IniziaGrafica`, `finestra`, `pulsante`, `edit`) using the Borland Graphics Interface (BGI).
    *   _React Equivalent:_ These will be replaced entirely by standard HTML elements, CSS styling, and React components. The BGI-specific drawing logic is not directly translatable but serves as a reference for the desired UI layout and elements.

This structure aims for separation of concerns, making the codebase easier to understand, test, and maintain.
