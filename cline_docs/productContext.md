# Product Context: X Poker React Remake

## Project Goal

The primary goal of this project is to recreate the classic C++ video poker game, "X Poker 2001 v1.08 beta", as a modern web application using React and TypeScript.

## Problem Solved

This project aims to modernize a legacy game, making it accessible on web browsers without requiring specific old operating systems or graphics libraries (like Borland Graphics Interface). It preserves the original game's logic and core experience while leveraging current web technologies.

## How it Should Work

The application should replicate the core gameplay loop of the original "X Poker 2001":

1.  **Dealing:** The player is dealt an initial hand of 5 cards.
2.  **Holding:** The player chooses which cards to hold.
3.  **Drawing:** Cards not held are replaced with new cards from the deck.
4.  **Evaluation:** The final hand is evaluated based on standard poker hand rankings (High Pair, Two Pair, Tris, Straight, Flush, Full House, Poker, Straight Flush, Royal Flush, X Poker/Five of a Kind with Jolly).
5.  **Payout:** Winnings are awarded based on the hand ranking and the current bet ("Puntata").
6.  **Credit/Points:** The player manages their credits ("Credito") and points ("Punti").
7.  **Betting:** The player can adjust the bet amount.
8.  **Doubling (Raddoppio):** After a win, the player might have an option to double their winnings through a high/low card guessing game.
9.  **Options/Settings:** Allow viewing/modifying settings like initial credit (though saving might be simplified in the web version).
10. **Visuals:** The UI should resemble the original game's layout, including the payout table, player stats (Credit, Points, Bet), the card display area, and controls. The original used specific colors and text styles which should be approximated.

The game uses a standard 52-card deck plus one Joker ("Jolly").
