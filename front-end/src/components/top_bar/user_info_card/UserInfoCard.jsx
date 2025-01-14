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
      const imageUrl = getImageUrl(currentUser.image_user);
      console.log('Constructed image URL:', imageUrl);
    }
  }, [currentUser]);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully');
    setImageError(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.error('-> UserInfoCard.jsx - getImageUrl() - No hay path de imagen');
      return null;
    }

    // Remove any leading 'uploads/' from the path since it's included in the URL
    const cleanPath = imagePath.replace(/^uploads\//, '');
  
    // Construct the full URL using the proxy path
    const fullUrl = `/uploads/${cleanPath}`;
    console.log('Constructed URL:', fullUrl);
    return fullUrl;
  }
  
    
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('Selected file:', file.name, 'Size:', file.size, 'Type:', file.type);

    if (!currentUser?.username) {
      console.error('Current user or username is not defined');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name_user', currentUser.username);
    formData.append('profileImage', file);

    try {
      console.log('Sending upload request...');
      const response = await axiosInstance.post('/user/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload response:', response.data);
      
      if (response.data.data) {
        // Update the currentUser state with the new image path
        setCurrentUser(prev => ({
          ...prev,
          image_user: response.data.data.image_user
        }));
        setImageError(false);
      }
    } catch (error) {
      console.error('Upload error:', error.response || error);
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