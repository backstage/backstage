import React from 'react';
import { button } from './button.css.ts';

interface ButtonProps {
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
}

export const Button = ({
  size = 'medium',
  variant = 'primary',
  children,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={button({ size, variant, disabled })}
    >
      {children}
    </button>
  );
};

export default Button;
