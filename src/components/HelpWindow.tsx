import React, { useEffect } from 'react'; // Import useEffect
import './HelpWindow.css'; // We'll create this CSS file next

interface HelpWindowProps {
  show: boolean;
  onClose: () => void;
}

// Help text content (based on C++ defines and screenshot)
const HELP_LINES = [
  "<Q,W,E,R,T> Hold Card",
  "<O> Options",
  "<F1> Help!",
  "<P> Increase Bet",
  "In Double Up:",
  "<A> High Card",
  "<S> Low Card",
  "<Z> Half Bet",
  "<X> Take Win",
  "<Esc> Exit",
];

const HelpWindow: React.FC<HelpWindowProps> = ({ show, onClose }) => {

  // Add key listener specifically for this modal to close on Esc or Enter
  // Moved outside the conditional return
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, show]); // Added 'show' dependency: only add/remove listener when modal is shown/hidden

  // Early return if not visible
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}> {/* Close on backdrop click */}
      <div className="modal-content help-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header help-header">
          Help
        </div>
        <div className="modal-body help-body">
          {HELP_LINES.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
         {/* Optional: Add an OK button if needed */}
         {/* <button className="modal-button help-ok-button" onClick={onClose}>OK</button> */}
      </div>
    </div>
  );
};

export default HelpWindow;
