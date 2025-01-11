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

<<<<<<< HEAD
=======
    console.log('User data:', userData); // Log user data to check imageUrl
    console.log('Image URL:', userData.imageUrl); // Log the image URL

    useEffect(() => {
        if (!isUploading) {
            console.log('User data after upload:', userData); // Log user data after upload
            console.log('Image URL after upload:', userData.imageUrl); // Log the image URL after upload
        }
    }, [isUploading, userData]);

>>>>>>> e080c1a (dev16 rebase)
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
<<<<<<< HEAD
                    <SquareUserRound className={styles.defaultIcon} />
                )}
                <label className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}>
=======
                    <img 
                        src="https://via.placeholder.com/100" 
                        alt="Placeholder"
                        className={styles.profileImage}
                    />
                )}
                <label className={`${styles.uploadButton} ${isUploading ? styles.uploading : ''}`}> 
>>>>>>> e080c1a (dev16 rebase)
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