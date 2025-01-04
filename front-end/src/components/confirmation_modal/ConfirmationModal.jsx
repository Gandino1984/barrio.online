import React, { useContext } from 'react';
import { X, MessageCircleWarning } from 'lucide-react';
import AppContext from '../../app_context/AppContext.js';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = () => {
  const { 
    isModalOpen, 
    setIsModalOpen,
    setIsAccepted,
    setIsDeclined,
    modalMessage,
    clearError 
  } = useContext(AppContext);

  const handleAccept = () => {
    setIsAccepted(true);
    setIsDeclined(false);
    setIsModalOpen(false);
    clearError();
  };

  const handleDecline = () => {
    setIsDeclined(true);
    setIsAccepted(false);
    setIsModalOpen(false);
    clearError();
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBackdrop} />
      
      <div className={styles.modalContainer}>
        <button
          onClick={handleDecline}
          className={styles.closeButton}
        >
          <X size={20} />
        </button>

        <div className={styles.modalContent}>
          <div className={styles.warningIconContainer}>
            <MessageCircleWarning 
              size={18}
              className={styles.warningIcon}
            />
          </div>

          <div className={styles.messageContainer}>
            <h3 className={styles.title}>¿Estás seguro?</h3>
            <p className={styles.message}>
              {modalMessage || 'Esta acción no se puede deshacer.'}
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <button
              onClick={handleDecline}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              className={styles.continueButton}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;