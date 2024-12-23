import React, { useContext, useEffect } from 'react';
import AppContext from '../../../src/app_context/AppContext.js';
import styles from './UserInfoCard.module.css';
import { SquareUserRound } from 'lucide-react';

const UserInfoCard = () => {

  const { currentUser, setCurrentUser } = useContext(AppContext);

  useEffect(() => {
    if (currentUser) {

      const userData = typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser;
  
      localStorage.setItem('currentUser', JSON.stringify(userData));

      setCurrentUser(userData);

      console.log('-> UserInfoCard.jsx - currentUser = ', userData);
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser, setCurrentUser]);

  if (!currentUser) {
    return <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>;
  }

  const userData = typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser;
  
  console.log('Current user type:', typeof currentUser);
  console.log('Current user value:', currentUser);

  return (
    <div className={styles.userInfoCard}>
      <p>¡Te damos la bienvenida, {userData.username}!</p>
      <SquareUserRound size={24} />
    </div>
  );
};

export default UserInfoCard;