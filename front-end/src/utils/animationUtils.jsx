import { useTransition } from 'react-spring';

// Define transition for mount/unmount animations
export const transitionsLogin = (showShopManagement, currentUser) => 
  useTransition(!showShopManagement && !currentUser, {
    from: { 
      opacity: 0,
      transform: 'scale(0.9) translateY(20px)',
    },
    enter: { 
      opacity: 1,
      transform: 'scale(1) translateY(0px)',
    },
    leave: { 
      opacity: 0,
      transform: 'scale(0.9) translateY(20px)',
    },
    config: {
      mass: 1,
      tension: 280,
      friction: 20,
    },
  });