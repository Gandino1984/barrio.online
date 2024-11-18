import { useContext } from 'react';
import AppContext from '../app_context/AppContext';

export const useLoginRegister = () => {
  const {
    isLoggingIn,
    setIsLoggingIn,
    setUsername,
    password,
    setPassword,
    passwordRepeat,
    setPasswordRepeat,
    setShowPasswordRepeat,
    setShowPasswordLabel,
    setKeyboardKey,
    setShowBusinessSelector,
    databaseResponse
  } = useContext(AppContext);

  const handlePasswordComplete = () => {
    if (!isLoggingIn) {
      setShowPasswordRepeat(true);
      setKeyboardKey((prev) => prev + 1);
    } else {
      setShowPasswordLabel(false);
    }
  };

  const handleClear = () => {
    if (!isLoggingIn) {
      setPassword('');
      setPasswordRepeat('');
      setShowPasswordRepeat(false);
      setShowPasswordLabel(true);
      setKeyboardKey((prev) => prev + 1);
    } else {
      setPassword('');
      setShowPasswordLabel(true);
    }
  };

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    if (isLoggingIn && newPassword.length !== 4) {
      setShowPasswordLabel(true);
    }
  };

  const handleRepeatPasswordChange = (newPassword) => {
    setPasswordRepeat(newPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isButtonDisabled()) {
      if (databaseResponse) {
        setShowBusinessSelector(true);
      }
    }
  };

  const toggleForm = () => {
    setIsLoggingIn((prevState) => !prevState);
    setUsername('');
    setPassword('');
    setPasswordRepeat('');
    setShowPasswordRepeat(false);
    setShowPasswordLabel(true);
    setKeyboardKey((prev) => prev + 1);
  };

  const handleBusinessSelect = (businessType) => {
    console.log('Selected business:', businessType);
    // Here you would typically handle the business selection,
    // perhaps by saving it to context or making an API call
  };

  const isButtonDisabled = () => {
    if (isLoggingIn) {
      return password.length !== 4;
    } else {
      return password.length !== 4 || passwordRepeat.length !== 4 || password !== passwordRepeat;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isButtonDisabled()) {
      if (databaseResponse) {
        setShowBusinessSelector(true);
      }
    }
  };

  return {
    handlePasswordComplete,
    handleClear,
    handlePasswordChange,
    handleRepeatPasswordChange,
    isButtonDisabled,
    handleSubmit,
    toggleForm,
    handleBusinessSelect,
    handleFormSubmit
  };
};