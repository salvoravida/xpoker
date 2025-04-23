// Define the possible suits
export enum Suit {
  // Original C++ mapping: 1=MAGENTA(Hearts?), 2=RED(Diamonds?), 3=BLUE(Clubs?), 4=BLACK(Spades?) - Needs verification/mapping
  // Let's use standard suits for now and map colors later in CSS
  Hearts = 'H',
  Diamonds = 'D',
  Clubs = 'C',
  Spades = 'S',
  Joker = 'JOKER', // Representing the Jolly card
}

// Define the possible card ranks (values)
// Original C++: 1 (Ace), 2-10, 11 (Jack), 12 (Queen), 13 (King), 0 (Jolly)
export enum Rank {
  Ace = 'A', // Representing 1
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10', // Representing 10 (Changed from 'T')
  Jack = 'J', // Representing 11
  Queen = 'Q', // Representing 12
  King = 'K', // Representing 13
  Joker = 'JOKER', // Representing 0
}

// Define the structure of a single card
export interface Card {
  suit: Suit;
  rank: Rank;
  // Add a unique ID for React list keys
  id: string;
}

// Define the structure for a player's hand
export interface Hand {
  cards: Card[];
}

// Define the structure for the deck
export type Deck = Card[];

// Define the possible hand rankings and their names/values from C++
export enum HandRank {
  Nothing = 'NENTI', // -1 in C++? Let's use a string identifier
  HighPair = 'ALTA_COPPIA', // 2
  DoublePair = 'DOPPIA_COPPIA', // 4
  Tris = 'TRIS', // 6 (Three of a Kind)
  Straight = 'SCALA', // 10
  Color = 'COLOR', // 20 (Flush)
  Full = 'FULL', // 40 (Full House)
  Poker = 'POKER', // 100 (Four of a Kind)
  StraightColor = 'STRAIGHT_COLOR', // 200 (Straight Flush)
  RoyalColor = 'ROYAL_COLOR', // 500 (Royal Flush)
  Pokerissimo = 'POKERISSIMO', // 1000 (Five of a Kind - Poker with Joker)
}

// Structure to hold evaluation result
export interface EvaluationResult {
  rank: HandRank;
  value: number; // Payout multiplier before bet
  name: string; // Display name
}
