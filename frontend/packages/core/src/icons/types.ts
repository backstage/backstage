import { ComponentType } from 'react';
import { SvgIconProps } from '@material-ui/core';

export type IconComponent = ComponentType<SvgIconProps>;
export type SystemIconKey = 'user' | 'group';
export type SystemIcons = { [key in SystemIconKey]: IconComponent };
