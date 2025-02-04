import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import styles from './CustomNumberInput.module.css';

const CustomNumberInput = ({ 
  value, 
  onChange, 
  name,
  min,
  max,
  step = 1,
  required = false,
  label
}) => {
  const handleIncrement = () => {
    const newValue = typeof value === 'number' ? value + Number(step) : Number(step);
    if (typeof max === 'undefined' || newValue <= max) {
      onChange({ target: { name, value: newValue } });
    }
  };

  const handleDecrement = () => {
    const newValue = typeof value === 'number' ? value - Number(step) : -Number(step);
    if (typeof min === 'undefined' || newValue >= min) {
      onChange({ target: { name, value: newValue } });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className="relative">
        
        <div className={styles.inputContainer}>
        <button
            type="button"
            onClick={handleDecrement}
            className="flex items-center justify-center h-1/2 w-6 p-0 m-0 border-none bg-transparent hover:bg-gray-100"
          >
            <ChevronDown size={12} />
          </button>
          <input
          type="number"
          value={value}
          onChange={onChange}
          name={name}
          min={min}
          max={max}
          step={step}
          required={required}
          className="pr-6"
        />
           <button
            type="button"
            onClick={handleIncrement}
            className="flex items-center justify-center h-1/2 w-6 p-0 m-0 border-none bg-transparent hover:bg-gray-100"
          >
            <ChevronUp size={12} />
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default CustomNumberInput;