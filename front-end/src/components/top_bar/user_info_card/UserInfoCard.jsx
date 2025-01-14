import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './UserInfoCard.module.css';
import { SquareUserRound, Camera } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';

const UserInfoCard = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (currentUser?.image_user) {
      // Pre-load image to check if it's accessible
      const img = new Image();
      img.src = getImageUrl(currentUser.image_user);
      img.onload = () => {
        setImageError(false);
        console.log('Image loaded successfully');
      };
      img.onerror = (e) => {
        setImageError(true);
        console.error('Image failed to load:', img.src);
      };
    }
  }, [currentUser?.image_user]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageError(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Remove any leading slashes
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `/uploads/${cleanPath}`;
};
  
    
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  // Use the correct property from currentUser
  formData.append('name_user', currentUser.name_user);  // Changed from username to name_user
  formData.append('profileImage', file);

  try {
      setUploading(true);
      const response = await axiosInstance.post('/user/upload-profile-image', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      
      if (response.data.data?.image_user) {
          // Update local storage as well as state
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

  if (!currentUser) {
    return <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>;
  }

  return (
    <div className={styles.userInfoCard}>
      <div className={styles.profileSection}>
        {!imageError && currentUser.image_user ? (
          <img 
            src={getImageUrl(currentUser.image_user)}
            alt={`Profile of ${currentUser.username}`}
            className={styles.profileImage}
            onError={handleImageError}
            onLoad={handleImageLoad}
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
      <p>¡Te damos la bienvenida, <span>{currentUser.username}</span>!</p>
      {uploading && <p className={styles.uploadStatus}>Subiendo imagen...</p>}
    </div>
  );
};

export default UserInfoCard;