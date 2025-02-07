// ShopCard.jsx
import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { MapPinned } from 'lucide-react';
import styles from './ShopCard.module.css';
import ShopCoverImage from '../shop_card/shop_cover_image/ShopCoverImage.jsx';

const ShopCard = ({ shop }) => {
  const shopInfoAnimation = useSpring({
    from: { transform: 'translateY(-50px)', opacity: 0 },
    to: { transform: 'translateY(0px)', opacity: 1 },
    config: { tension: 280, friction: 20 },
    delay: 120
  });

  return (
    <div className={styles.container}>
      <ShopCoverImage id_shop={shop.id_shop} />
      
      <animated.div style={shopInfoAnimation} className={styles.infoContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>{shop?.name_shop}</h2>
          <p className={styles.rating}>
            Calificación: {shop?.calification_shop || 'No disponible'}/5
          </p>
        </div>
        <p className={styles.location}>
          <MapPinned size={16} className={styles.locationIcon} />
          {shop?.location_shop}
        </p>
      </animated.div>
    </div>
  );
};

export default ShopCard;