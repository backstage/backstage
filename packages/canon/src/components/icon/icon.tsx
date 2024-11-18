import React from 'react';
import { useIcons, IconNames } from './context';

export const Icon = ({ name }: { name: IconNames }) => {
  const { icons } = useIcons();

  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.error(`Icon "${name}" not found.`);
    return <svg />; // Return default icon perhaps?
  }

  return <LucideIcon />;
};
