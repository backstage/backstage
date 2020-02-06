import PluginOutputHook from './PluginOutputHook';
import { ComponentType } from 'react';

export const entityViewPage = new PluginOutputHook<{
  title: string;
  path: string;
  component: ComponentType<any>;
}>('entity-view-page');
