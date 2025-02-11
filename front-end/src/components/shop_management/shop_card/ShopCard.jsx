import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { MapPinned, Clock, Truck } from 'lucide-react';
import styles from '../../../../../public/css/ShopCard.module.css';
import ShopCoverImage from '../shop_card/shop_cover_image/ShopCoverImage.jsx';

const ShopCard = ({ shop }) => {
  const shopInfoAnimation = useSpring({
    from: { transform: 'translateY(-50px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    config: { tension: 280, friction: 20 },
    delay: 120
  });

  // Format time to 12-hour format
  const formatTime = (timeString) => {
    if (!timeString) return 'Not available';
    try {
      
      const [hours, minutes] = timeString.split(':');
      
      const date = new Date();
      
      date.setHours(parseInt(hours), parseInt(minutes));

      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Not available';
    }
  };

  return (
    <div className={styles.container}>
      <ShopCoverImage id_shop={shop.id_shop} />
      
      <animated.div style={shopInfoAnimation} className={styles.infoContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{shop?.name_shop}</h2>
          <p className={styles.rating}>
            Rating: {shop?.calification_shop || '5'}/5
          </p>
        </div>
        
        <div className={styles.details}>
          <p className={styles.location}>
            <MapPinned size={16} className={styles.icon} />
            {shop?.location_shop || 'Dirección no disponible'}
          </p>
          
          <p className={styles.schedule}>
            <Clock size={16} className={styles.icon} />
            {shop?.opening_time && shop?.closing_time 
              ? `Abierto de ${formatTime(shop.opening_time)} - ${formatTime(shop.closing_time)}`
              : 'Horario no disponible'}
          </p>
          
          <p className={`${styles.delivery} ${shop?.has_delivery ? styles.available : styles.unavailable}`}>
            <Truck size={16} className={styles.icon} />
            {shop?.has_delivery ? 'Delivery disponible' : 'Delivery no disponible'}
          </p>
        </div>
      </animated.div>
    </div>
  );
};

export default ShopCard;