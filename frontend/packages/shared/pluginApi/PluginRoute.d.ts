import { ReactNode } from 'react';
import PluginBase from './PluginBase';

export = PluginRoute;

declare class PluginRoute {
  constructor(owner: PluginBase, path: string, exact: boolean, component: ReactNode, props?: object);
}
