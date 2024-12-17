import React, { useContext } from 'react';
import AppContext from '../../app_context/AppContext.js';
import styles from './ErrorCard.module.css';
import { CircleX } from 'lucide-react';

const ErrorCard = () => {
  const {
    usernameError,
    ipError,
    passwordError,
    userlocationError
  } = useContext(AppContext);

  const errors = {
    usernameError,
    ipError,
    passwordError,
    userlocationError
  };

  if (!Object.values(errors).some((error) => error)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <CircleX color="red" size={24} />
      <ul className={styles.errorList}>
        {Object.keys(errors).map((errorKey) => (
          <li key={errorKey}>
            {errors[errorKey]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorCard;