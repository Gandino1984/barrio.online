import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './UserInfoCard.module.css';
import { SquareUserRound, Camera } from 'lucide-react';
import axios from 'axios';

const UserInfoCard = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log('Image failed to load:', currentUser?.image_user);
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `/uploads/${imagePath}`;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert('El archivo no puede ser mayor a 2MB');
      return;
    }
  
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('name_user', currentUser.username);
  
    setUploading(true);
    try {
      const response = await axios.post('/user/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.data.error) {
        alert('Error al subir la imagen: ' + response.data.error);
        return;
      }
  
      if (response.data.data) {
        const updatedUser = {
            ...currentUser,
            image_user: response.data.data.image_user
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  
    } catch (err) {
      alert('Error al subir la imagen: ' + (err.response?.data?.error || err.message));
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
            alt="Profile" 
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
    </div>
  );
};

export default UserInfoCard;