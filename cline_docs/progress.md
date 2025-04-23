# Progress: X Poker React Remake

## Current Status: Initialization

The project is currently in the initial setup phase. The Memory Bank documentation files are being created.

## What Works

*   Memory Bank files created:
    *   `productContext.md`
    *   `activeContext.md`
    *   `systemPatterns.md`
    *   `techContext.md`
    *   `progress.md` (this file)

## What's Left to Build (High-Level)

1.  **Project Scaffolding:** Create the Vite project structure (`xpoker`).
2.  **Core Game Logic:**
    *   Define card/deck structures (TypeScript interfaces/types).
    *   Implement deck creation, shuffling, and dealing.
    *   Implement hand evaluation logic (including Joker).
    *   Implement payout calculation based on hand rank and bet.
    *   Implement credit/points management.
    *   Implement betting logic.
    *   Implement the "Raddoppio" (Double Up) feature logic.
3.  **UI Components:**
    *   `Card` component (displaying suit, rank, held status, potentially basic styling/images).
    *   `Hand` component (displaying the 5 player cards).
    *   `PayoutTable` component (displaying winning hands and their payouts).
    *   `GameInfo` component (displaying Credit, Points, Bet).
    *   `Controls` component (Deal/Draw button, Hold buttons/toggles, Bet adjustment buttons, Double Up controls).
    *   Main `Game` or `App` component to orchestrate the UI and state.
4.  **State Management:** Implement state handling for the game flow (dealing, holding, drawing, evaluating, doubling).
5.  **Styling:** Apply CSS to approximate the original game's visual layout and appearance.
6.  **Persistence:** Implement saving/loading of credit/points using `localStorage`.
7.  **Refinement:** Add minor features like help text, options display (if needed), and improve styling/animations.

## Next Immediate Steps

1.  Create the Vite project named `xpoker`.
2.  Install dependencies.
3.  Start basic implementation of core types (Card, Deck) and the main `App` component structure.
