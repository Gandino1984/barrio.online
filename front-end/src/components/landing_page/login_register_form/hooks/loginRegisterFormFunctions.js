  const handlePasswordComplete = (isLoggingIn) => {
    if (!isLoggingIn) {
      setShowPasswordRepeat(true);
      setKeyboardKey((prev) => prev + 1);
    } else {
      setShowPasswordLabel(false);
    }
  };

  const handleClear = (isLoggingIn) => {
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

  const handlePasswordChange = (isLoggingIn, newPassword) => {
    setPassword(newPassword);
    if (isLoggingIn && newPassword.length !== 4) {
      setShowPasswordLabel(true);
    }
  };

  const handleRepeatPasswordChange = (newPassword) => {
    setPasswordRepeat(newPassword);
  };



  const handleSubmit = (e, databaseResponse) => {
    e.preventDefault();
    if (!isButtonDisabled()) {
      // Verificamos la respuesta de la base de datos
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

  //to check when to enable the login/register button
  const isButtonDisabled = (isLoggingIn) => {
    if (isLoggingIn) {
      return password.length !== 4;
    } else {
      return password.length !== 4 || passwordRepeat.length !== 4 || password !== passwordRepeat;
    }
  };

  const handleFormSubmit = (e, databaseResponse) => {
    e.preventDefault();
    if (!isButtonDisabled()) {
      // check DB response here
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
    handleBackToForm,
    handleFormSubmit
  };
