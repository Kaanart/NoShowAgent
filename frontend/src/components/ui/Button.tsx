import React from 'react';
import '../../design-tokens.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ variant = 'secondary', className = '', children, ...props }) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const combinedClassName = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
