import { SvgIconProps } from '@material-ui/core';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import React, { FC } from 'react';
import { useApp } from '../api';
import { IconComponent, SystemIconKey, SystemIcons } from './types';

export const defaultSystemIcons: SystemIcons = {
  user: PersonIcon,
  group: PeopleIcon,
};

const overridableSystemIcon = (key: SystemIconKey): IconComponent => {
  const Component: FC<SvgIconProps> = props => {
    const app = useApp();
    const Icon = app.getSystemIcon(key);
    return <Icon {...props} />;
  };
  return Component;
};

export const UserIcon = overridableSystemIcon('user');
export const GroupIcon = overridableSystemIcon('group');
