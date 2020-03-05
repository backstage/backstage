import { ComponentType } from 'react';
import { IconComponent } from '../../icons';

export type EntityPageNavItem = {
  icon: IconComponent;
  title: string;
  target: string;
};

export type EntityPageView = {
  path: string;
  component: ComponentType<any>;
};

export type EntityPageProps = {
  navItems: EntityPageNavItem[];
  views: EntityPageView[];
};

export type EntityPageNavbarProps = {
  navItems: EntityPageNavItem[];
};

export type EntityPageHeaderProps = {};
