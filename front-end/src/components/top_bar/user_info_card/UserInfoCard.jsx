import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { ProfileImageUploadFunctions } from '../../login_register/login_register_form/hooks/ProfileImageUploadFunctions.jsx';
import { SquareUserRound, Camera } from 'lucide-react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = () => {
  const { currentUser, 
    isUploading
   } = useContext(AppContext);
  const { handleImageUpload } = ProfileImageUploadFunctions();

  if (!currentUser) {
      return <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>;
  }

  const userData = typeof currentUser === 'string' ? JSON.parse(currentUser) : currentUser;

  return (
      <div className={styles.userInfoCard}>
          <div className={styles.profileImageContainer}>
              {userData.imageUrl ? (
                  <img 
                      src={userData.imageUrl}
                      alt="Profile"
                      className={styles.profileImage}
                  />
              ) : (
                  <SquareUserRound className={styles.defaultIcon} />
              )}
              <label className={styles.uploadButton}>
                  <input
                      type="file"
                      className={styles.uploadInput}
                      onChange={handleImageUpload}
                      accept="image/*"
                      disabled={isUploading}
                  />
                  <Camera size={16} />
              </label>
          </div>
          <p>¡Te damos la bienvenida, <span>{userData.username}</span>!</p>
      </div>
  );
};

export default UserInfoCard;