import React, { useContext, useEffect, useRef, useState } from 'react';
import { Camera, Loader } from 'lucide-react';
import AppContext from '../../../app_context/AppContext.js';
import UserImageModal from './user_image_modal/UserImageModal';
import styles from '../../../../../public/css/UserInfoCard.module.css';
import { UserInfoCardFunctions } from './UserInfoCardFunctions.jsx';

const UserInfoCard = () => {
  const { 
    currentUser,
    uploading,
    setError, 
    isImageModalOpen, setIsImageModalOpen 
  } = useContext(AppContext);

  const {
    handleImageUpload,
    getImageUrl
  } = UserInfoCardFunctions();

  // State to control the visibility of the upload button
  const [showUploadButton, setShowUploadButton] = useState(false);

  // Ref to the file input element
  const fileInputRef = useRef(null);

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

  // Handle single-click to toggle the upload button
  const handleImageSingleClick = () => {
    setShowUploadButton(prev => !prev); // Toggle upload button visibility
  };

  // Handle double-click to open the modal
  const handleImageDoubleClick = () => {
    if (currentUser?.image_user) {
      setIsImageModalOpen(true); // Open the modal
    }
  };

  // Handle camera button click to trigger file upload
  const handleUploadButtonClick = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent container

    // Programmatically trigger the file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }

    // Hide the upload button after triggering the file input
    setShowUploadButton(false);
  };

  return (
    <div className={styles.userInfoCard}>
      {!currentUser ? (
        <div className={styles.message}>¡Te damos la bienvenida! Inicia sesión</div>
      ) : (
        <>
          <div className={styles.profileSection}>
            <div 
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={handleImageSingleClick} // Single-click to toggle upload button
              onDoubleClick={handleImageDoubleClick} // Double-click to open modal
            >
              {/* Profile Image */}
              <img
                src={getImageUrl(currentUser.image_user) || ''} // Use the user's image or fallback to an empty string
                alt={currentUser?.name_user || 'User'} // Use the user's name as alt text
                className={`${styles.profileImage} hover:opacity-90 transition-opacity`}
                onError={() => {
                  setError(prevError => ({ 
                    ...prevError, 
                    imageError: "Error al cargar la imagen de usuario" 
                  }));
                }}
                onLoad={() => {
                  setError(prevError => ({
                    ...prevError,
                    imageError: ''
                  }));
                }}
              />
              {/* Conditionally render the upload button */}
              {showUploadButton && (
                <label 
                  htmlFor="profile-image-input"
                  className={styles.uploadButton}
                  style={{ 
                    position: 'absolute',
                    bottom: '-5px',
                    right: '-5px',
                    cursor: uploading ? 'wait' : 'pointer',
                  }}
                  onClick={handleUploadButtonClick} // Prevent event propagation
                >
                  <Camera size={16} />
                </label>
              )}
            </div>
            {/* User Image Modal */}
            <UserImageModal
              isOpen={isImageModalOpen}
              onClose={() => setIsImageModalOpen(false)}
              imageUrl={getImageUrl(currentUser.image_user)}
              altText={`Full size image of ${currentUser.name_user}`}
            />
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="profile-image-input"
              disabled={uploading}
              ref={fileInputRef} // Ref to the file input
            />
          </div>
          <p>¡Te damos la bienvenida, <span>{currentUser?.name_user || 'Usuaria'}</span>!</p>
          {uploading && <Loader size={16} />}
        </>
      )}
    </div>
  );
};

export default UserInfoCard;