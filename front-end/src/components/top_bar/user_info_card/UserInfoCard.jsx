import React, { useContext } from 'react';
import AppContext from '../../../app_context/AppContext.js';
import { ProfileImageUploadFunctions } from './ProfileImageUploadFunctions.jsx';
import { SquareUserRound, Camera } from 'lucide-react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = () => {
    const { 
        currentUser,
        isUploading,
        error
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
                <label className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}>
                    <input
                        type="file"
                        className={styles.uploadInput}
                        onChange={handleImageUpload}
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        disabled={isUploading}
                    />
                    <Camera size={16} />
                </label>
            </div>
            <p>¡Te damos la bienvenida, <span>{userData.username}</span>!</p>
            {error?.imageError && (
                <div className={styles.errorMessage}>
                    {error.imageError}
                </div>
            )}
            {isUploading && (
                <div className={styles.uploadingMessage}>
                    Subiendo imagen...
                </div>
            )}
        </div>
    );
};

export default UserInfoCard;