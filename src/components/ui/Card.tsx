import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  const hoverClass = hover ? 'hover:transform hover:-translate-y-2 hover:shadow-xl' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;