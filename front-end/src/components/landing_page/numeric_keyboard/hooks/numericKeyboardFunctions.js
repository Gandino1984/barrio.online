export const useNumericKeyboard = () => {
  
    // const handleClearPassword = (e, onClear) => {
    //   e.preventDefault();
    //   onChange('');
    //   if (onClear) {
    //     onClear();
    //   }
    // };
  
    return {
      handleKeyClick,
      handleBackspace,
      handleClearPassword
    };
  };
  