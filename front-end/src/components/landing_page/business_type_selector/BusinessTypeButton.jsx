import React from 'react';

const BusinessTypeButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full mb-2 p-4 text-lg"
    >
      {children}
    </button>
  );
};

export default BusinessTypeButton;