import React, { useContext, useEffect, useState } from 'react';
import styles from '../../../../../public/css/UserInfoCard.module.css';
import { Camera } from 'lucide-react';
import { SquareUserRound } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import { UserInfoCardFunctions } from './UserInfoCardFunctions.jsx';

const UserInfoCard = () => {
  const { currentUser,
    uploading,
    setError, clearError 
   } = useContext(AppContext);

  const {
    handleImageUpload,
    getImageUrl
  } = UserInfoCardFunctions();
  
  useEffect(() => {
    if (currentUser?.image_user) {
      clearError();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.image_user) {
      console.log('-> UserInfoCard - Path actual de imagen = ', currentUser.image_user);
    }
  }, [currentUser?.image_user]);

  return (
    <div className={styles.userInfoCard}>
      {!currentUser ? (
        <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>
      ) : (
        <>
          <div className={styles.profileSection}>
            {currentUser ? (
              <img
                src={getImageUrl(currentUser.image_user)}
                alt={`Image of ${currentUser.name_user}`}
                className={styles.profileImage}
                onError={() => {
                  setError(prevError => ({ ...prevError, imageError: "Error al cargar la imagen" }));
                }}
              />
            ) : (
              <SquareUserRound size={40} />
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="profile-image-input"
              disabled={uploading}
            />
            <label 
              htmlFor="profile-image-input"
              className={styles.uploadButton}
              style={{ cursor: uploading ? 'wait' : 'pointer' }}
            >
              <Camera size={16} />
            </label>
          </div>
          <p>¡Te damos la bienvenida, <span>{currentUser?.name_user || 'Usuaria'}</span>!</p>
          {uploading && <p className={styles.uploadStatus}>Subiendo imagen...</p>}
        </>
      )}
    </div>
  );
};

export default UserInfoCard;