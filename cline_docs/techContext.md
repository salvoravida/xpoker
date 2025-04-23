# Tech Context: X Poker React Remake

## Core Technologies

*   **Runtime Environment:** Node.js (LTS version recommended) for running the development server and build tools.
*   **Package Manager:** npm (comes with Node.js) or yarn. `npm` will be assumed unless specified otherwise.
*   **UI Library:** React (latest stable version).
*   **Language:** TypeScript (latest stable version).
*   **Build Tool / Dev Server:** Vite (latest stable version).

## Development Setup

1.  **Prerequisites:** Node.js and npm installed.
2.  **Project Initialization:** Use Vite to scaffold a new React + TypeScript project:
    ```bash
    npm create vite@latest xpoker --template react-ts
    ```
3.  **Navigate into Project:**
    ```bash
    cd xpoker
    ```
4.  **Install Dependencies:**
    ```bash
    npm install
    ```
5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    This will start a local development server, typically accessible at `http://localhost:5173` (Vite will confirm the exact port).

## Key Libraries/APIs (Planned)

*   **React:** For UI components and hooks (`useState`, `useEffect`, `useContext`, `useReducer`).
*   **TypeScript:** For static typing (`interface`, `type`, enums).
*   **Vite:** For development server and production builds.
*   **Web APIs:**
    *   `localStorage`: For persisting simple game state (credit, points).
    *   Standard DOM APIs: For event handling (button clicks, keyboard input if implemented).
*   **CSS:** Standard CSS, potentially CSS Modules for component-level styling.

## Technical Constraints

*   **Browser Compatibility:** Target modern web browsers that support ES Modules and the latest JavaScript/CSS features used by React and Vite.
*   **No Server-Side Logic:** The game must run entirely in the user's browser.
*   **Performance:** While not a highly complex application, ensure smooth rendering and responsiveness, especially during card animations (if implemented).
*   **Accessibility:** Basic accessibility considerations should be followed (e.g., semantic HTML, keyboard navigation if possible).
*   **Visual Fidelity:** Aim to replicate the *layout* and *feel* of the original game, but direct pixel-perfect replication of the BGI graphics is not feasible or necessary. Modern web styling techniques will be used.
