import { Suit, Rank, Card, Deck } from '../types/card';
import { v4 as uuidv4 } from 'uuid'; // Using uuid for unique card IDs

/**
 * Creates a standard 52-card deck plus one Joker.
 * @returns {Deck} An array of Card objects representing the deck.
 */
export function createDeck(): Deck {
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];
  const ranks = [
    Rank.Ace, Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven,
    Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King
  ];
  const deck: Deck = [];

  // Add standard cards
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, id: uuidv4() });
    }
  }

  // Add the Joker (Jolly)
  deck.push({ suit: Suit.Joker, rank: Rank.Joker, id: uuidv4() });

  return deck;
}

/**
 * Shuffles a deck of cards using the Fisher-Yates (Knuth) algorithm.
 * Creates a new shuffled array, does not mutate the original.
 * @param {Deck} deck - The deck to shuffle.
 * @returns {Deck} A new array containing the shuffled deck.
 */
export function shuffleDeck(deck: Deck): Deck {
  // Create a copy to avoid mutating the original deck
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements shuffledDeck[i] and shuffledDeck[j]
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

/**
 * Deals a specified number of cards from the top of the deck.
 * Mutates the original deck by removing the dealt cards.
 * @param {Deck} deck - The deck to deal from (will be mutated).
 * @param {number} numCards - The number of cards to deal.
 * @returns {Card[]} An array of the dealt cards.
 */
export function dealCards(deck: Deck, numCards: number): Card[] {
    if (deck.length < numCards) {
        throw new Error("Not enough cards in the deck to deal.");
    }
    // splice removes cards from the original deck and returns them
    return deck.splice(0, numCards);
}
