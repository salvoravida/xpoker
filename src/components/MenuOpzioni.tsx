import React, { useState } from 'react'; // Import useState
import './MenuOpzioni.css';
import OptionsMenuInput from './OptionsMenuInput'; // Import the new component

interface MenuOpzioniProps {
  show: boolean;
  onClose: () => void;
  currentCredit: number;
  setCredit: (value: number | ((prevVar: number) => number)) => void;
  currentBetMultiplier: number;
  setBetMultiplier: (value: number | ((prevVar: number) => number)) => void;
  onSaveOptions: () => void;
  onShowAbout: () => void;
}

const MenuOpzioni: React.FC<MenuOpzioniProps> = ({
  show,
  onClose,
  currentCredit,
  setCredit,
  currentBetMultiplier,
  setBetMultiplier,
  onSaveOptions,
  onShowAbout
}) => {
  const [editingField, setEditingField] = useState<'credit' | 'bet' | null>(null);

  if (!show) {
    return null;
  }

  // --- Handlers to START editing ---
  const handleEditCredit = () => {
    setEditingField('credit');
  };

  const handleEditBet = () => {
    setEditingField('bet');
  };

  // --- Handlers for OptionsMenuInput ---
  const handleConfirmInput = (newValue: string) => {
    const numericValue = parseInt(newValue, 10);

    if (editingField === 'credit') {
      if (!isNaN(numericValue) && numericValue >= 0) {
        setCredit(numericValue);
      } else {
        alert("Invalid credit value.");
      }
    } else if (editingField === 'bet') {
      // Bet input is 2-98, multiplier is 1-49
      if (!isNaN(numericValue) && numericValue >= 2 && numericValue <= 98) {
        const newMultiplier = Math.max(1, Math.floor(numericValue / 2));
        setBetMultiplier(newMultiplier);
      } else {
        alert("Invalid bet value (must be between 2 and 98).");
      }
    }
    setEditingField(null); // Close input window
  };

  const handleCancelInput = () => {
    setEditingField(null); // Close input window without changes
  };


  // --- Original prompt handlers (now replaced) ---
  /*
  const handleCredito = () => {
    const newValue = prompt("Enter new credit:", currentCredit.toString()); // English prompt
    if (newValue !== null) {
      const numericValue = parseInt(newValue, 10);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setCredit(numericValue);
      } else {
  };
  */
  /*
  const handlePuntata = () => {
    // Original C++ asked for value between 2 and 98, then divided by 2 for multiplier (1-49)
    const currentPuntata = currentBetMultiplier * 2;
    const newValue = prompt(`Enter new bet value (2-98):`, currentPuntata.toString()); // English prompt
    if (newValue !== null) {
      const numericValue = parseInt(newValue, 10);
      if (!isNaN(numericValue) && numericValue >= 2 && numericValue <= 98) {
        // Ensure it's an even number if needed, or just divide
        const newMultiplier = Math.max(1, Math.floor(numericValue / 2)); // Ensure multiplier is at least 1
        setBetMultiplier(newMultiplier);
      } else {
        alert("Invalid bet value (must be between 2 and 98)."); // English alert
      }
    }
  };
  */

  // Salva and About handlers are passed directly via props
  // const handleSalva = onSaveOptions; // Passed directly
  // const handleAbout = onShowAbout; // Passed directly

  return (
    <div className="modal-backdrop" onClick={onClose}> {/* Close on backdrop click */}
      {!editingField ? (
        // Show main options menu
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">O P T I O N S</div>
          <div className="modal-body">
            <button className="modal-button" onClick={handleEditCredit}>CREDIT</button>
            <button className="modal-button" onClick={handleEditBet}>Bet</button>
            <button className="modal-button" onClick={onSaveOptions}>Save Options</button>
            <button className="modal-button" onClick={onShowAbout}>A B O U T</button>
            <button className="modal-button" onClick={onClose}>Exit</button>
          </div>
        </div>
      ) : (
        // Show input component
        <OptionsMenuInput
          key={editingField} // Force re-mount when field changes
          label={editingField === 'credit' ? 'Credit' : 'Bet (2-98)'}
          initialValue={editingField === 'credit' ? currentCredit.toString() : (currentBetMultiplier * 2).toString()}
          maxLength={editingField === 'credit' ? 6 : 2} // Max length based on field
          onlyNumbers={true}
          onConfirm={handleConfirmInput}
          onCancel={handleCancelInput}
        />
      )}
    </div>
  );
};

export default MenuOpzioni;
