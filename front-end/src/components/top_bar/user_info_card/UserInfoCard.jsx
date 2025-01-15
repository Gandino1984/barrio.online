import React, { useContext, useEffect, useState } from 'react';
import styles from './UserInfoCard.module.css';
import { Camera } from 'lucide-react';
import { SquareUserRound } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import  AppContext  from '../../../app_context/AppContext.js';

const UserInfoCard = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Debug logs
    console.log('UserInfoCard - Current user state:', currentUser);
    console.log('UserInfoCard - localStorage data:', localStorage.getItem('currentUser'));
    try {
      const parsedLocalStorage = JSON.parse(localStorage.getItem('currentUser'));
      console.log('UserInfoCard - Parsed localStorage:', parsedLocalStorage);
    } catch (e) {
      console.log('UserInfoCard - Error parsing localStorage:', e);
    }
  }, [currentUser]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!currentUser || !currentUser.name_user) {
      console.error('No user data available:', currentUser);
      return;
    }

    const formData = new FormData();
    formData.append('name_user', currentUser.name_user);
    formData.append('profileImage', file);

    try {
      setUploading(true);
      const response = await axiosInstance.post('/user/upload-profile-image', formData);

      if (response.data.data?.image_user) {
        const updatedUser = {
          ...currentUser,
          image_user: response.data.data.image_user
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setImageError(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setImageError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.userInfoCard}>
      {!currentUser ? (
        <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>
      ) : (
        <>
          <div className={styles.profileSection}>
            {!imageError && currentUser.image_user ? (
              <img 
                src={currentUser.image_user}
                alt={`Profile of ${currentUser.name_user}`}
                className={styles.profileImage}
                onError={() => setImageError(true)}
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