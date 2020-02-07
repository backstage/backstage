import { ComponentType } from 'react';

export type IconComponent = ComponentType<{
  fontSize?: 'inherit' | 'default' | 'small' | 'large';
}>;
