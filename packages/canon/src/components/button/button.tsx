/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { button } from './button.css';
import { Box } from '../box/box';

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
    <Box
      {...props}
      as="button"
      disabled={disabled}
      className={button({ size, variant, disabled })}
    >
      {children}
    </Box>
  );
};

export default Button;
