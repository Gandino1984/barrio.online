import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import styles from './UserInfoCard.module.css';
import { SquareUserRound, Camera } from 'lucide-react';
import axios from 'axios';

const UserInfoCard = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('-> UserInfoCard.jsx - currentUser:', currentUser); 
  }, [currentUser]);

  const handleImageLoad = () => {
    setImageError(false);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // Using the full URL of the backend server
    return `http://localhost:3007/uploads/${imagePath}`;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('Current User:', currentUser); // Log current user data
    console.log('Username:', currentUser.username); // Log username to check if it's defined

    // Check if currentUser is defined
    if (!currentUser || !currentUser.username) {
        console.error('Current user or username is not defined');
        return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name_user', currentUser.username); 
    formData.append('profileImage', file); 

    // Log FormData content
    for (let pair of formData.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
    }

    try {
      const response = await axios.post('/user/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      
      if (response.data.data) {
        setCurrentUser(prev => ({
          ...prev,
          image_user: response.data.data.image_user
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      // You might want to show this error to the user
      if (error.response?.data?.error) {
        console.error('Server error:', error.response.data.error);
      }
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
            // onError={handleImageError}
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
    </div>
  );
};

export default UserInfoCard;