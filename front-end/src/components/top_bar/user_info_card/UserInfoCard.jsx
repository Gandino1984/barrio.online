import React, { useContext, useEffect, useState } from 'react';
import styles from '../../../../../public/css/UserInfoCard.module.css';
import { Camera } from 'lucide-react';
import { SquareUserRound } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import { UserInfoCardFunctions } from './UserInfoCardFunctions.jsx';
import UserImageModal from './user_image_modal/UserImageModal';

const UserInfoCard = () => {
  const { 
    currentUser,
    uploading,
    setError, 
    clearError 
  } = useContext(AppContext);

  const {
    handleImageUpload,
    getImageUrl
  } = UserInfoCardFunctions();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Handle image errors in useEffect instead of during render
  useEffect(() => {
    if (currentUser?.image_user) {
      const imageUrl = getImageUrl(currentUser.image_user);
      if (!imageUrl) {
        setError(prevError => ({ 
          ...prevError, 
          imageError: "No se ha proporcionado una ruta de imagen" 
        }));
      }
    }
  }, [currentUser?.image_user, setError]);

  const handleImageClick = () => {
    if (currentUser?.image_user) {
      setIsImageModalOpen(true);
    }
  };

  return (
    <div className={styles.userInfoCard}>
      {!currentUser ? (
        <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>
      ) : (
        <>
          <div className={styles.profileSection}>
            {currentUser?.image_user ? (
              <>
                <img
                  src={getImageUrl(currentUser.image_user)}
                  alt={`Image of ${currentUser.name_user}`}
                  className={`${styles.profileImage} cursor-pointer hover:opacity-90 transition-opacity`}
                  onClick={handleImageClick}
                  onError={() => {
                    setError(prevError => ({ 
                      ...prevError, 
                      imageError: "Error al cargar la imagen" 
                    }));
                  }}
                  onLoad={() => {
                    setError(prevError => ({
                      ...prevError,
                      imageError: ''
                    }));
                  }}
                />
                <UserImageModal
                  isOpen={isImageModalOpen}
                  onClose={() => setIsImageModalOpen(false)}
                  imageUrl={getImageUrl(currentUser.image_user)}
                  altText={`Full size image of ${currentUser.name_user}`}
                />
              </>
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