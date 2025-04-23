import React, { useState, useEffect, useRef } from 'react';
import './OptionsMenuInput.css';

interface OptionsMenuInputProps {
  label: string;
  initialValue: string; // Keep as string for input handling
  maxLength: number;
  onlyNumbers?: boolean; // Optional flag for numeric input
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

const OptionsMenuInput: React.FC<OptionsMenuInputProps> = ({
  label,
  initialValue,
  maxLength,
  onlyNumbers = false, // Default to false
  onConfirm,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select(); // Select existing text
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // Apply numeric filter if needed
    if (onlyNumbers) {
      value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    }

    // Apply maxLength
    if (value.length > maxLength) {
      value = value.slice(0, maxLength);
    }

    setInputValue(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      // Validate before confirming (e.g., ensure not empty if required)
      if (inputValue.trim() !== '') {
          onConfirm(inputValue);
      } else {
          // Optionally show an error or just cancel
          onCancel();
      }
    } else if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="options-input-overlay"> {/* Optional overlay */}
      <div className="options-input-window">
        <div className="options-input-header">{label}</div>
        <div className="options-input-body">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="options-input-field"
            maxLength={maxLength} // HTML5 maxLength attribute
          />
          {/* Optional: Add cursor/underline like original? */}
          {/* <div className="options-input-cursor">_</div> */}
        </div>
      </div>
    </div>
  );
};

export default OptionsMenuInput;
