export const useNumericKeyboard = (value, onChange, MAX_PASSWORD_LENGTH, onPasswordComplete) => {
    const handleKeyClick = (num, e) => {
      e.preventDefault();
      if (value.length < MAX_PASSWORD_LENGTH) {
        const newValue = value + num;
        onChange(newValue);
        
        if (newValue.length === MAX_PASSWORD_LENGTH && onPasswordComplete) {
          onPasswordComplete();
        }
      }
    };
  
    const handleBackspace = (e) => {
      e.preventDefault();
      if (value.length > 0) {
        const newValue = value.slice(0, -1);
        onChange(newValue);
      }
    };
  
    const handleClearPassword = (e, onClear) => {
      e.preventDefault();
      onChange('');
      if (onClear) {
        onClear();
      }
    };
  
    return {
      handleKeyClick,
      handleBackspace,
      handleClearPassword
    };
  };
  