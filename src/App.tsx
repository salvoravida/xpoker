import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { Card, Deck, EvaluationResult, HandRank, Rank } from './types/card';
import { createDeck, shuffleDeck, dealCards } from './utils/deck';
import { evaluateHand, getRankValue } from './utils/evaluateHand'; // Import getRankValue
import MenuOpzioni from './components/MenuOpzioni';
import HelpWindow from './components/HelpWindow'; // Import HelpWindow component

// Game Constants from C++
const INITIAL_CREDIT = 200;
const INITIAL_BET_MULTIPLIER = 1; // Corresponds to voltepunti=1
const MIN_BET_FOR_PAYOUT = 2; // ALTA_COPPIA payout multiplier

type GamePhase = 'READY' | 'DEALING' | 'HOLDING' | 'DRAWING' | 'EVALUATING' | 'WIN_DECISION' | 'DOUBLING' | 'GAMEOVER'; // Added WIN_DECISION

// C++ String Constants
const GAME_TITLE = "X Poker 2001 v1.08 beta"; // From TITOLO define
const FOOTER_TEXT = "By Xray82 (xray_82@yahoo.com)       F1 for Help"; // From COP define - Reverted

function App() {
  // --- Payout Data (Derived from types/evaluateHand) ---
  // Using original Italian-like names from screenshot
  const PAYOUT_INFO: Array<{ rank: HandRank; name: string; value: number }> = [
      { rank: HandRank.Pokerissimo, name: "X Poker", value: 1000 },
      { rank: HandRank.RoyalColor, name: "Royal Color", value: 500 },
      { rank: HandRank.StraightColor, name: "Straight Color", value: 200 },
      { rank: HandRank.Poker, name: "Poker", value: 100 },
      { rank: HandRank.Full, name: "Full", value: 40 },
      { rank: HandRank.Color, name: "Color", value: 20 },
      { rank: HandRank.Straight, name: "Straight", value: 10 },
      { rank: HandRank.Tris, name: "Tris", value: 6 },
      { rank: HandRank.DoublePair, name: "Double Pairs", value: 4 },
      { rank: HandRank.HighPair, name: "High Pairs", value: 2 },
  ].sort((a, b) => b.value - a.value); // Sort high to low

  // --- State ---
  const [deck, setDeck] = useState<Deck>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [heldCards, setHeldCards] = useState<boolean[]>([false, false, false, false, false]);
  const [credit, setCredit] = useState<number>(INITIAL_CREDIT);
  const [points, setPoints] = useState<number>(0);
  const [betMultiplier, setBetMultiplier] = useState<number>(INITIAL_BET_MULTIPLIER);
  const [gamePhase, setGamePhase] = useState<GamePhase>('READY');
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [message, setMessage] = useState<string>("Click Deal to start!");
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const [showHelpWindow, setShowHelpWindow] = useState<boolean>(false);
  // --- Raddoppio State ---
  const [isDoubling, setIsDoubling] = useState<boolean>(false); // Keep track if double up is active
  const [doublingAmount, setDoublingAmount] = useState<number>(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setDealerCard] = useState<Card | null>(null);
  const [playerDoubleCard, setPlayerDoubleCard] = useState<Card | null>(null);

  // --- LocalStorage Keys ---
  const STORAGE_KEY_CREDIT = 'xpoker_credit';
  const STORAGE_KEY_BET = 'xpoker_betMultiplier';

  // --- Modal Toggles ---
  const toggleOptionsModal = useCallback(() => {
    if (!isDoubling) { // Prevent opening modals during doubling
        setShowOptionsModal(prev => !prev);
    }
  }, [isDoubling]); // Dependency: isDoubling

  const toggleHelpWindow = useCallback(() => {
      if (!isDoubling) { // Prevent opening modals during doubling
          setShowHelpWindow(prev => !prev);
      }
  }, [isDoubling]); // Dependency: isDoubling

  // --- Game Logic Callbacks ---

  // Function for holding/unholding a card
  const toggleHold = useCallback((index: number) => {
    // Can only hold during HOLDING phase and not during doubling
    if (gamePhase !== 'HOLDING' || isDoubling) return;

    setHeldCards(prevHeld => {
        const newHeld = [...prevHeld];
        newHeld[index] = !newHeld[index];
        return newHeld;
    });
  }, [gamePhase, isDoubling]);

  // Function to handle dealing the initial hand
  const handleDeal = useCallback(() => {
    // Can only deal when ready or after win decision/doubling finished
    if (gamePhase !== 'READY' && gamePhase !== 'WIN_DECISION') return;

    // Reset doubling state if applicable
    setIsDoubling(false);
    setDoublingAmount(0);
    setDealerCard(null);
    setPlayerDoubleCard(null);

    const currentBet = MIN_BET_FOR_PAYOUT * betMultiplier;
    if (credit < currentBet) {
        const neededFromPoints = currentBet - credit;
        if (points >= neededFromPoints) {
            setCredit(0);
            setPoints(prev => prev - neededFromPoints);
        } else {
            setMessage("Insufficient credit/points for the current bet!");
            return;
        }
    } else {
        setCredit(prev => prev - currentBet);
    }

    let currentDeck = [...deck];
    if (currentDeck.length < 5) {
      console.log("Reshuffling deck...");
      setMessage("Reshuffling deck...");
      currentDeck = shuffleDeck(createDeck());
    }

    const dealtCards = dealCards(currentDeck, 5);
    setHand(dealtCards);
    setDeck(currentDeck);
    setHeldCards([false, false, false, false, false]);
    setEvaluationResult(null);
    setMessage("Select cards to hold, then click Draw.");
    setGamePhase('HOLDING');
  }, [deck, credit, points, betMultiplier, gamePhase]);

  // Function for drawing new cards and evaluating
  const handleDraw = useCallback(() => {
    if (gamePhase !== 'HOLDING') return;

    setGamePhase('DRAWING');
    setMessage("Drawing new cards...");

    let currentDeck = [...deck];
    const cardsToDraw = heldCards.filter(held => !held).length;

    if (currentDeck.length < cardsToDraw) {
        console.log("Reshuffling deck mid-draw...");
        currentDeck = shuffleDeck(createDeck());
    }

    const newHand = hand.map((card, index) => {
        return heldCards[index] ? card : dealCards(currentDeck, 1)[0];
    });

    setHand(newHand);
    setDeck(currentDeck);

    const result = evaluateHand(newHand);
    setEvaluationResult(result);
    // Don't set gamePhase to EVALUATING here, handle below

    if (result.rank !== HandRank.Nothing) {
        const winnings = result.value * betMultiplier;
        setDoublingAmount(winnings);
        // Don't set isDoubling=true yet
        setGamePhase('WIN_DECISION'); // Go to win decision phase
        setMessage(`You got ${result.name}! Won ${winnings}. Double Up? (A/S=Play, X/Enter=Take)`);
    } else {
        setMessage("No win. Click Deal for next hand.");
        setGamePhase('READY'); // Go back to ready if no win
    }
  }, [gamePhase, hand, deck, heldCards, betMultiplier]);

  // --- Options Logic Handlers ---
  const handleSaveOptions = useCallback(() => {
      try {
          localStorage.setItem(STORAGE_KEY_CREDIT, credit.toString());
          localStorage.setItem(STORAGE_KEY_BET, betMultiplier.toString());
          console.log("Saving options:", { credit, betMultiplier });
          setMessage("Options Saved!");
          toggleOptionsModal();
      } catch (error) {
          console.error("Failed to save options to localStorage:", error);
          setMessage("Error saving options.");
      }
  }, [credit, betMultiplier, toggleOptionsModal]);

  const handleShowAbout = useCallback(() => {
      alert(`${GAME_TITLE}\nWritten by: Xray82\nEmail: xray_82@yahoo.com\nCopyRight 2000-2001 LetoSoft (TM)`);
  }, []);

  // --- Memoized Keyboard Handler ---
  const handleGlobalKeyDown = useCallback((event: KeyboardEvent) => {
    // Handle modal closing first
    if (event.key === 'Escape') {
        if (showOptionsModal) {
          toggleOptionsModal();
          return;
        }
        if (showHelpWindow) {
          toggleHelpWindow();
          return;
        }
        // If doubling, Esc takes win
        if (isDoubling) {
            setPoints(prev => prev + doublingAmount);
            setMessage(`You took ${doublingAmount} points. Click Deal for next hand.`);
            setIsDoubling(false);
            setGamePhase('READY');
            setDealerCard(null);
            setPlayerDoubleCard(null);
            return;
        }
      }

      // Handle modal opening (only if not doubling)
      if (!isDoubling && event.key.toLowerCase() === 'o' && !showHelpWindow) {
        toggleOptionsModal();
        return;
      }
      if (!isDoubling && event.key === 'F1' && !showOptionsModal) {
        event.preventDefault();
        toggleHelpWindow();
        return;
      }

      // Ignore game keys if a modal is open
      if (showOptionsModal || showHelpWindow) return;

      // --- WIN_DECISION Phase ---
      if (gamePhase === 'WIN_DECISION') {
          if (event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 's') {
              // Start Doubling
              setIsDoubling(true);
              setGamePhase('DOUBLING');
              let currentDeck = [...deck];
              if (currentDeck.length < 1) currentDeck = shuffleDeck(createDeck());
              // Don't deal dealer card yet, deal first player card on A/S press in DOUBLING phase
              setDealerCard(null); // No fixed dealer card shown initially
              setPlayerDoubleCard(null);
              setMessage(`Doubling ${doublingAmount}. High (A) or Low (S)?`);
          } else if (event.key.toLowerCase() === 'x' || event.key === 'Enter') {
              // Take Win
              setPoints(prev => prev + doublingAmount);
              setMessage(`You took ${doublingAmount} points. Click Deal for next hand.`);
              setDoublingAmount(0);
              setGamePhase('READY');
          }
          return; // Don't process other keys in this phase
      }

      // --- DOUBLING Phase ---
      if (isDoubling) {
            let currentDeck = [...deck];
            if (currentDeck.length < 1) {
                currentDeck = shuffleDeck(createDeck());
            }

            if (['a', 's', 'x', 'z'].includes(event.key.toLowerCase())) {
                const playerCard = dealCards(currentDeck, 1)[0];
                setDeck(currentDeck);
                setPlayerDoubleCard(playerCard); // Show player's card

                const playerValue = getRankValue(playerCard.rank);
                const isHighWin = playerValue >= 7 && playerValue !== 0;
                const isLowWin = playerValue <= 7 && playerValue !== 0;

                let win = false;
                let lost = false;
                const currentDoublingAmount = doublingAmount;

                if (event.key.toLowerCase() === 'a') { // High
                    if (isHighWin) {
                       const newAmount = currentDoublingAmount * 2;
                       setDoublingAmount(newAmount);
                       setMessage(`High! Won! Current Win: ${newAmount}. Play again? (A/S/X/Z)`);
                       win = true;
                   } else {
                       lost = true;
                   }
               } else if (event.key.toLowerCase() === 's') { // Low
                   if (isLowWin) {
                       const newAmount = currentDoublingAmount * 2;
                       setDoublingAmount(newAmount);
                       setMessage(`Low! Won! Current Win: ${newAmount}. Play again? (A/S/X/Z)`);
                       win = true;
                   } else {
                       lost = true;
                   }
               } else if (event.key.toLowerCase() === 'x') { // Take Win
                   setPoints(prev => prev + currentDoublingAmount);
                   setMessage(`You took ${currentDoublingAmount} points. Click Deal for next hand.`);
                   setIsDoubling(false);
                   setGamePhase('READY');
                   setDealerCard(null);
                   setPlayerDoubleCard(null);
                   return;
               } else if (event.key.toLowerCase() === 'z') { // Half Bet
                   if (currentDoublingAmount <= 1) {
                       setMessage(`Cannot halve ${currentDoublingAmount}. Play again? (A/S/X/Z)`);
                       // Keep player card visible after failed half attempt
                       return;
                   }
                   const halfWin = Math.floor(currentDoublingAmount / 2);
                   const remainder = currentDoublingAmount - halfWin;
                   setPoints(prev => prev + remainder);
                   setDoublingAmount(halfWin);
                   setMessage(`Halved! Took ${remainder} points. Current Win: ${halfWin}. Play again? (A/S/X/Z)`);
                   setPlayerDoubleCard(null); // Reset player card for next guess
                   // No dealer card to deal here
                   return;
               }

               // Handle win/loss outcome for A/S guess
               if (lost) {
                   setMessage(`Lost ${currentDoublingAmount}! Click Deal for next hand.`);
                   setDoublingAmount(0);
                   setIsDoubling(false);
                   setGamePhase('READY');
                   // Keep player card visible after loss until next Deal
               } else if (win) {
                   // Prepare for next double up round
                   setPlayerDoubleCard(null); // Hide player card for next guess
                   // Stay in DOUBLING phase, wait for next A/S
               }
           }
           return; // Prevent other keys processing during doubling
       }

      // --- Game Keys (Not Doubling and not WIN_DECISION) ---
      if (gamePhase === 'HOLDING') {
          if (event.key.toLowerCase() === 'q') toggleHold(0);
          if (event.key.toLowerCase() === 'w') toggleHold(1);
          if (event.key.toLowerCase() === 'e') toggleHold(2);
          if (event.key.toLowerCase() === 'r') toggleHold(3);
          if (event.key.toLowerCase() === 't') toggleHold(4);
      }

      if (event.key === 'Enter') {
          // Enter only works for Deal/Draw when not in WIN_DECISION
          if (gamePhase === 'READY' || gamePhase === 'EVALUATING') {
              handleDeal();
          } else if (gamePhase === 'HOLDING') {
              handleDraw();
          }
      }

      if (event.key.toLowerCase() === 'p' && (gamePhase === 'READY' || gamePhase === 'EVALUATING')) {
          setBetMultiplier(prev => prev >= 49 ? 1 : prev + 1);
      }
      // TODO: Add Z key for decreasing bet (outside doubling)

  }, [isDoubling, gamePhase, showOptionsModal, showHelpWindow, deck, doublingAmount, toggleOptionsModal, toggleHelpWindow, toggleHold, handleDeal, handleDraw,
      setBetMultiplier, setPoints, setMessage, setIsDoubling, setGamePhase, setDoublingAmount, setDealerCard, setPlayerDoubleCard, setDeck]); // Include all dependencies

  // --- Effect to add the global listener ---
  useEffect(() => {
      window.addEventListener('keydown', handleGlobalKeyDown);
      return () => {
          window.removeEventListener('keydown', handleGlobalKeyDown);
      };
  }, [handleGlobalKeyDown]); // Re-add listener if the callback changes


  return (
    <div className="app-container">
      {/* Header */}
      <div className="header-placeholder">
        {GAME_TITLE}
      </div>

      {/* Payout Table */}
      <div className="payout-table-placeholder">
        {PAYOUT_INFO.map(item => (
          <div key={item.rank} className="payout-item">
            <span>{item.name}</span>
            <span>{item.value * betMultiplier}</span>
          </div>
        ))}
      </div>

      {/* Game Info */}
      <div className="game-info-placeholder">
         <div className="game-info-col">
             <p><span className='puntata-label'>Bet</span></p>
             <p><span className='info-value'>{MIN_BET_FOR_PAYOUT * betMultiplier}</span></p>
         </div>
         <div className="game-info-col">
             <p><span className='credit-label'>Credit :</span> <span className='info-value'>{credit}</span></p>
             <p><span className='info-label'>Points :</span> <span className='info-value'>{points}</span></p>
         </div>
      </div>

      {/* Hand Display */}
      <div className="hand-display">
        <div className="corner-pocket top-left"></div>
        <div className="corner-pocket top-right"></div>
        <div className="corner-pocket bottom-left"></div>
        <div className="corner-pocket bottom-right"></div>
        <div className="playing-surface">
            {gamePhase !== 'DOUBLING' && hand.length === 0 ? ( // Show title only if hand is empty AND not doubling
                <div className="initial-title">X POKER 2001</div>
            ) : !isDoubling ? ( // Show main hand only if not doubling (covers READY, HOLDING, EVALUATING, WIN_DECISION)
                <div className="cards-container">
                  {hand.map((card, index) => (
                    <div
                      key={card.id}
                      className={`card-placeholder suit-${card.suit} ${heldCards[index] && gamePhase === 'HOLDING' ? 'held' : ''}`} // Only show held during HOLDING
                      onClick={() => toggleHold(index)}
                      title={gamePhase === 'HOLDING' ? (heldCards[index] ? 'Click to Unhold' : 'Click to Hold') : ''}
                      style={{ cursor: gamePhase === 'HOLDING' ? 'pointer' : 'default' }}
                    >
                      <span className="card-rank">
                        {card.rank === Rank.Joker ? 'Jolly' : card.rank}
                      </span>
                      {/* Show held indicator only during HOLDING phase */}
                      {gamePhase === 'HOLDING' && heldCards[index] && <span className="hold-indicator">STOP</span>}
                    </div>
                  ))}
                </div>
            ) : isDoubling ? ( // Show Doubling UI
                <div className="doubling-card-display"> {/* Renamed container */}
                    {/* Show only player card (or placeholder) */}
                    {playerDoubleCard ? (
                        <div className={`card-placeholder suit-${playerDoubleCard.suit}`}>
                            <span className="card-rank">
                                {playerDoubleCard.rank === Rank.Joker ? 'Jolly' : playerDoubleCard.rank}
                            </span>
                        </div>
                    ) : (
                        // Show a placeholder before first A/S press, or after Z
                        <div className="card-placeholder empty double-placeholder">?</div>
                    )}
                </div>
            ) : null /* Fallback */}
        </div>
      </div>

      {/* Controls */}
      <div className="controls-placeholder">
         {/* Hide Deal/Draw during doubling and win decision */}
        {!isDoubling && gamePhase !== 'WIN_DECISION' && (
            <>
                <button onClick={handleDeal} disabled={gamePhase !== 'READY' && gamePhase !== 'EVALUATING'}>Deal</button>
                <button onClick={handleDraw} disabled={gamePhase !== 'HOLDING'}>Draw</button>
            </>
        )}
      </div>

      {/* Game Messages */}
      <div className="message-placeholder">
        <p>{message}</p>
        {/* Display evaluation result only in EVALUATING/WIN_DECISION phase and not doubling */}
        {(gamePhase === 'EVALUATING' || gamePhase === 'WIN_DECISION') && evaluationResult && !isDoubling && (
             <p>Result: {evaluationResult.name}
                {evaluationResult.rank !== HandRank.Nothing && ` (Winnings: ${evaluationResult.value * betMultiplier})`}
             </p>
        )}
         {/* Display doubling amount during doubling phase */}
         {isDoubling && <p>Current Win: {doublingAmount}</p>}
      </div>

       {/* Footer */}
       <div className="footer-placeholder">
         {FOOTER_TEXT}
       </div>

       {/* Options Modal */}
       <MenuOpzioni
         show={showOptionsModal}
         onClose={toggleOptionsModal}
         currentCredit={credit}
         setCredit={setCredit}
         currentBetMultiplier={betMultiplier}
         setBetMultiplier={setBetMultiplier}
         onSaveOptions={handleSaveOptions}
         onShowAbout={handleShowAbout}
       />

       {/* Help Modal */}
       <HelpWindow
         show={showHelpWindow}
         onClose={toggleHelpWindow}
       />

       {/* Raddoppio Overlay Removed */}
    </div>
  );
}

export default App;
