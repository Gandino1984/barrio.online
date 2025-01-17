import React, { useContext, useEffect, useState } from 'react';
import styles from '../../../../../public/css/UserInfoCard.module.css';
import { Camera } from 'lucide-react';
import { SquareUserRound } from 'lucide-react';
import axiosInstance from '../../../../utils/axiosConfig.js';
import AppContext from '../../../app_context/AppContext.js';

const UserInfoCard = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Reset image error when currentUser changes
    if (currentUser?.image_user) {
      setImageError(false);
    }
  }, [currentUser]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Remove any leading slashes and ensure proper path
    const cleanPath = imagePath.replace(/^\/+/, '');
    
    // If using axiosInstance base URL
    const baseUrl = axiosInstance.defaults.baseURL || '';
    const imageUrl = `${baseUrl}/${cleanPath}`.replace(/([^:]\/)(\/)+/g, "$1");
    
    console.log('Constructed Image URL:', imageUrl); // Log the URL for debugging
    return imageUrl;
  };

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
      const response = await axiosInstance.post('/user/upload-profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.data?.image_user) {
        const updatedUser = {
          ...currentUser,
          image_user: response.data.data.image_user
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        console.log('Updated User Data:', updatedUser); // Log the updated user data
        console.log('Local Storage Content:', localStorage.getItem('currentUser')); // Log local storage content
        setCurrentUser(updatedUser);
        setImageError(false);
      }
    } catch (error) {
      console.error('Upload error:', error.response?.data || error);
      setImageError(true);
    } finally {
      setUploading(false);
    }
  };

  // Add debug logging
  useEffect(() => {
    if (currentUser?.image_user) {
      console.log('Current image path:', currentUser.image_user);
      console.log('Constructed image URL:', getImageUrl(currentUser.image_user));
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
                onError={(e) => {
                  console.error('Image load error:', e);
                  setImageError(true);
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