import { Card, HandRank, Rank, Suit, EvaluationResult } from '../types/card';

// --- Payout Mapping (Based on C++ constants) ---
const PAYOUTS: { [key in HandRank]: number } = {
  [HandRank.Pokerissimo]: 1000,
  [HandRank.RoyalColor]: 500,
  [HandRank.StraightColor]: 200,
  [HandRank.Poker]: 100,
  [HandRank.Full]: 40,
  [HandRank.Color]: 20,
  [HandRank.Straight]: 10,
  [HandRank.Tris]: 6,
  [HandRank.DoublePair]: 4,
  [HandRank.HighPair]: 2,
  [HandRank.Nothing]: 0, // No payout for nothing
};

// --- Display Names Mapping (Using original names) ---
const HAND_NAMES: { [key in HandRank]: string } = {
    [HandRank.Pokerissimo]: "X Poker", // Original name
    [HandRank.RoyalColor]: "Royal Color", // Original name
    [HandRank.StraightColor]: "Straight Color", // Original name
    [HandRank.Poker]: "Poker", // Original name
    [HandRank.Full]: "Full", // Original name
    [HandRank.Color]: "Color", // Original name
    [HandRank.Straight]: "Straight", // Original name
    [HandRank.Tris]: "Tris", // Original name
    [HandRank.DoublePair]: "Double Pairs", // Original name
    [HandRank.HighPair]: "High Pairs", // Original name
    [HandRank.Nothing]: "Nothing", // Keep as Nothing for no win message
};


// --- Helper Functions ---

/**
 * Converts Rank enum to a numerical value for comparison/sorting.
 * Ace = 1, J=11, Q=12, K=13, Joker=0.
 */
export function getRankValue(rank: Rank): number { // Added export
  switch (rank) {
    case Rank.Ace: return 1;
    case Rank.Two: return 2;
    case Rank.Three: return 3;
    case Rank.Four: return 4;
    case Rank.Five: return 5;
    case Rank.Six: return 6;
    case Rank.Seven: return 7;
    case Rank.Eight: return 8;
    case Rank.Nine: return 9;
    case Rank.Ten: return 10;
    case Rank.Jack: return 11;
    case Rank.Queen: return 12;
    case Rank.King: return 13;
    case Rank.Joker: return 0; // Joker has lowest numerical value for sorting like C++
    default: throw new Error(`Unknown rank: ${rank}`);
  }
}

/**
 * Sorts a hand primarily by rank value (ascending, Joker first), then suit (secondary, less important).
 */
function sortHand(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => {
    const rankDiff = getRankValue(a.rank) - getRankValue(b.rank);
    if (rankDiff !== 0) return rankDiff;
    // Optional: Secondary sort by suit if ranks are equal (not strictly needed for evaluation)
    return a.suit.localeCompare(b.suit);
  });
}

/**
 * Counts occurrences of each rank in the hand.
 * @returns Map<Rank, number>
 */
function countRanks(hand: Card[]): Map<Rank, number> {
    const counts = new Map<Rank, number>();
    for (const card of hand) {
        counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
    }
    return counts;
}

/**
 * Counts occurrences of each suit in the hand (excluding Joker).
 * @returns Map<Suit, number>
 */
function countSuits(hand: Card[]): Map<Suit, number> {
    const counts = new Map<Suit, number>();
    for (const card of hand) {
        if (card.suit !== Suit.Joker) {
            counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
        }
    }
    return counts;
}

/**
 * Checks if a hand is a straight, considering Jokers and Ace high/low.
 * Assumes the hand is sorted by rank value.
 * @param sortedHand - The sorted hand (5 cards).
 * @param numJokers - The number of Jokers in the hand.
 * @returns boolean - True if the hand is a straight.
 */
function checkStraight(sortedHand: Card[], numJokers: number): boolean {
    const rankValues = sortedHand.map(card => getRankValue(card.rank)).filter(val => val !== 0); // Get non-joker numerical ranks

    if (rankValues.length + numJokers < 5) return false; // Not enough cards/jokers to form a 5-card sequence

    // Create unique, sorted numerical ranks (non-joker)
    const uniqueSortedRanks = [...new Set(rankValues)].sort((a, b) => a - b);

    if (uniqueSortedRanks.length === 0 && numJokers >= 5) return true; // 5 Jokers is a straight

    // Check Ace-low straight (A-2-3-4-5) possibility
    const aceLowRanks = [1, 2, 3, 4, 5];
    let jokersNeededAceLow = 0;
    const presentRanksAceLow = new Set(uniqueSortedRanks);
    for (const rankVal of aceLowRanks) {
        if (!presentRanksAceLow.has(rankVal)) {
            jokersNeededAceLow++;
        }
    }
    if (jokersNeededAceLow <= numJokers) {
        // Ensure no high cards (like K) are present if using Jokers for Ace-low
        const nonAceLowRanks = uniqueSortedRanks.filter(r => !aceLowRanks.includes(r));
        if (nonAceLowRanks.length === 0) {
             return true; // It's an Ace-low straight
        }
    }

    // Check for standard straights (including Ace-high: 10-J-Q-K-A)
    // Need to check all possible starting points for a 5-card sequence
    const possibleStartRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Ace (1) can start A-5, Ten (10) can start 10-A

    for (const startRank of possibleStartRanks) {
        let currentConsecutive = 0;
        let jokersAvailable = numJokers;
        for (let i = 0; i < 5; i++) {
             // Calculate the target rank for the current position in the potential straight
             let currentTargetRank = startRank + i;
             // Handle Ace-high sequence (10, J, Q, K, A) where A is 1
             if (startRank === 10 && currentTargetRank > 13) {
                 currentTargetRank = 1;
             }
             // Note: No need for `else if (startRank !== 10 && currentTargetRank > 13)` check here,
             // as the outer loop `possibleStartRanks` only goes up to 10.

            if (uniqueSortedRanks.includes(currentTargetRank)) {
                currentConsecutive++;
            } else if (jokersAvailable > 0) {
                currentConsecutive++;
                jokersAvailable--;
            } else {
                break; // Not enough cards or jokers for this sequence
            }
        }
        if (currentConsecutive === 5) {
            return true; // Found a 5-card straight sequence
        }
    }


    return false; // No 5-card straight sequence found
}


// --- Evaluation Logic ---

/**
 * Evaluates a 5-card poker hand and determines its rank and payout value.
 * Follows the logic from the C++ CalcolaPunteggio function, including Joker rules.
 * @param hand - An array of 5 Card objects.
 * @returns EvaluationResult - The rank, payout multiplier, and display name.
 */
export function evaluateHand(hand: Card[]): EvaluationResult {
  if (hand.length !== 5) {
    throw new Error("Hand must contain exactly 5 cards.");
  }

  const sortedHand = sortHand(hand);
  const rankCounts = countRanks(sortedHand);
  const suitCounts = countSuits(sortedHand);
  const numJokers = rankCounts.get(Rank.Joker) || 0;

  // TODO: Implement the detailed checks for each hand rank,
  // starting from highest (Pokerissimo/Royal Flush) down to High Pair,
  // carefully considering the numJokers.
  // This requires translating the complex conditional logic from C++.

  // Placeholder: Default to Nothing
  let rank = HandRank.Nothing;

  // --- Start Hand Rank Checks (Highest to Lowest) ---

  // Check Flush variations (including Joker)
  const isFlush = (suitCounts.size === 1 && numJokers === 0) || // Natural flush
                  (suitCounts.size === 1 && numJokers > 0 && hand.filter(c => c.rank !== Rank.Joker).every(c => c.suit === suitCounts.keys().next().value)) || // Flush with Joker(s)
                  (numJokers === 5); // 5 Jokers is technically a flush of Jokers? C++ logic needs checking here. Let's assume it counts.
                  // C++ logic: checks if first 4 non-joker suits match, or if joker exists and other 4 match.

  // Check Straight variations (including Joker)
  const isStraight = checkStraight(sortedHand, numJokers);

  // Check Royal Flush / Straight Flush
  if (isFlush && isStraight) {
      // Check if it's Royal (Ace high straight flush: 10, J, Q, K, A)
      // Check if the necessary high cards are present (Joker can fill gaps)
      const royalRanks = new Set([1, 10, 11, 12, 13]); // Ace, 10, J, Q, K
      let presentRoyalCount = 0;
      sortedHand.forEach(card => {
          if (card.rank !== Rank.Joker && royalRanks.has(getRankValue(card.rank))) {
              presentRoyalCount++;
          }
      });

      const isRoyal = (presentRoyalCount + numJokers >= 5);

      rank = isRoyal ? HandRank.RoyalColor : HandRank.StraightColor;
  }
  // Check Pokerissimo (5 of a Kind)
  else if (numJokers > 0 && Array.from(rankCounts.values()).some(count => count + numJokers >= 5)) {
      rank = HandRank.Pokerissimo;
  }
  // Check Poker (4 of a Kind)
  else if (Array.from(rankCounts.values()).some(count => count === 4) || // Natural 4oak
           (numJokers > 0 && Array.from(rankCounts.values()).some(count => count + numJokers >= 4))) { // 4oak with Joker(s)
      rank = HandRank.Poker;
   }
   // Check Full House
   else if (
       // Natural Full House (XXX YY)
       (numJokers === 0 && rankCounts.size === 2 && Array.from(rankCounts.values()).some(count => count === 3)) ||
       // Full House with 1 Joker (XX YY + J -> XXX YY or XX YYY)
       (numJokers === 1 && rankCounts.size === 3 && Array.from(rankCounts.values()).filter(count => count === 2).length === 2) || // Two pairs + Joker = Full House
       // Full House with 1 Joker (XXX Y + J -> XXX YY) - This is covered by Tris check later, but Full is higher rank
       (numJokers === 1 && rankCounts.size === 2 && Array.from(rankCounts.values()).some(count => count === 3)) || // Three of a kind + pair rank + Joker = Full House
       // Full House with 2 Jokers (XX Y + JJ -> XXX YY)
       (numJokers === 2 && rankCounts.size === 2 && Array.from(rankCounts.values()).some(count => count === 2)) || // Pair + single + 2 Jokers = Full House
        // Full House with 3 Jokers (X Y + JJJ -> XXX YY)
       (numJokers === 3 && rankCounts.size === 2) // Two distinct ranks + 3 Jokers = Full House
       // Note: 4 or 5 Jokers would be Pokerissimo
   ) {
       rank = HandRank.Full;
   }
   // Check Flush (if not straight flush)
  else if (isFlush) {
      rank = HandRank.Color;
  }
  // Check Straight (if not straight flush)
  else if (isStraight) {
      rank = HandRank.Straight;
  }
  // Check Tris (3 of a Kind)
  else if (Array.from(rankCounts.values()).some(count => count === 3) || // Natural 3oak
           (numJokers > 0 && Array.from(rankCounts.values()).some(count => count + numJokers >= 3))) { // 3oak with Joker(s)
      rank = HandRank.Tris;
   }
   // Check Double Pair
   else if (
       // Natural Two Pair (XX YY Z)
       (numJokers === 0 && rankCounts.size === 3 && Array.from(rankCounts.values()).filter(count => count === 2).length === 2) ||
       // One Pair + Joker making second pair (XX Y Z + J -> XX YY Z)
       (numJokers === 1 && rankCounts.size === 4 && Array.from(rankCounts.values()).some(count => count === 2))
       // Note: 3 singles + 2 Jokers would make Tris, which is checked earlier/higher.
   ) {
       rank = HandRank.DoublePair;
   }
   // Check High Pair (Jacks or Better)
   else {
        const pairs = Array.from(rankCounts.entries()).filter(([rank, count]) => rank !== Rank.Joker && count >= 2);
        // Filter for pairs that are Jacks or Better (Ace = 1, J=11, Q=12, K=13)
        const highPairs = pairs.filter(([rank]) => { // Removed unused 'count'
            const rankVal = getRankValue(rank);
            return rankVal >= 11 || rankVal === 1;
        });

        if (highPairs.length > 0) {
            // Found a natural high pair
            rank = HandRank.HighPair;
        } else if (numJokers > 0) {
            // Check if Joker makes a high pair with any existing J, Q, K, A
            const highCards = sortedHand.filter(card => {
                if (card.rank === Rank.Joker) return false;
                const rankVal = getRankValue(card.rank);
                return rankVal >= 11 || rankVal === 1;
            });
            if (highCards.length > 0) {
                 // Joker pairs with an existing high card
                 rank = HandRank.HighPair;
            }
            // C++ logic also seemed to count Joker + any pair as high pair? Re-check needed if this isn't sufficient.
            // For now, sticking to standard Jacks or Better logic enhanced by Joker.
            // If a natural low pair exists (e.g., two 7s) and there's a Joker,
            // it becomes Tris, which is handled above. If it's 4 singles + Joker,
            // the Joker must pair with a J, Q, K, or A to qualify here.
        }
   }


  // --- Return Result ---
  return {
    rank: rank,
    value: PAYOUTS[rank],
    name: HAND_NAMES[rank],
  };
}

// TODO: Implement detailed checks for:
// - Straight logic (Ace high/low, Joker gaps)
// - Royal Flush check within Straight Flush
// - Full House logic (with Joker)
// - Two Pair logic (with Joker)
// - High Pair logic (Jacks or Better, with Joker)
// Need to carefully translate C++ conditions, especially Joker handling.
