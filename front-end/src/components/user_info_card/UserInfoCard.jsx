import React, { useContext, useEffect } from 'react';
import AppContext from '../../../src/app_context/AppContext.js';
import styles from './UserInfoCard.module.css';
import { SquareUserRound } from 'lucide-react';

const UserInfoCard = () => {
  const { currentUser } = useContext(AppContext);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify({ user: currentUser }));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>;
  }

  console.log('-> UserInfoCard.jsx - currentUser = ', currentUser.username);

  return (
    <div className={styles.userInfoCard}>
      <p>¡Te damos la bienvenida, {currentUser.username}!</p>
      <SquareUserRound size={24} />
    </div>
  );
};

export default UserInfoCard;