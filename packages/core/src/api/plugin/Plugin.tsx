import { ComponentType } from 'react';
import { PluginOutput, RoutePath, RouteOptions } from './types';
import { IconComponent } from '../../icons';
import { Widget } from '../widgetView/types';

export type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

export type PluginHooks = {
  router: RouterHooks;
  entityPage: EntityPageHooks;
  widgets: WidgetHooks;
};

export type RouterHooks = {
  registerRoute(
    path: RoutePath,
    Component: ComponentType<any>,
    options?: RouteOptions,
  ): void;

  registerRedirect(
    path: RoutePath,
    target: RoutePath,
    options?: RouteOptions,
  ): void;
};

type EntityPageSidebarItemOptions = {
  title: string;
  icon: IconComponent;
  target: RoutePath;
};

export type EntityPageHooks = {
  navItem(options: EntityPageSidebarItemOptions): void;
  route(
    path: RoutePath,
    component: ComponentType<any>,
    options?: RouteOptions,
  ): void;
};

export type WidgetHooks = {
  add(widget: Widget): void;
};

export const registerSymbol = Symbol('plugin-register');
export const outputSymbol = Symbol('plugin-output');

export default class Plugin {
  private storedOutput?: PluginOutput[];

  constructor(private readonly config: PluginConfig) {}

  output(): PluginOutput[] {
    if (this.storedOutput) {
      return this.storedOutput;
    }
    if (!this.config.register) {
      return [];
    }

    const { id } = this.config;

    const outputs = new Array<PluginOutput>();

    this.config.register({
      router: {
        registerRoute(path, component, options) {
          if (path.startsWith('/entity/')) {
            throw new Error(
              `Plugin ${id} tried to register forbidden route ${path}`,
            );
          }
          outputs.push({ type: 'route', path, component, options });
        },
        registerRedirect(path, target, options) {
          if (path.startsWith('/entity/')) {
            throw new Error(
              `Plugin ${id} tried to register forbidden redirect ${path}`,
            );
          }
          outputs.push({ type: 'redirect-route', path, target, options });
        },
      },
      entityPage: {
        navItem({ title, icon, target }) {
          outputs.push({
            type: 'entity-page-nav-item',
            title,
            icon,
            target,
          });
        },
        route(path, component, options) {
          outputs.push({
            type: 'entity-page-view-route',
            path,
            component,
            options,
          });
        },
      },
      widgets: {
        add(widget: Widget) {
          outputs.push({ type: 'widget', widget });
        },
      },
    });

    this.storedOutput = outputs;
    return this.storedOutput;
  }

  toString() {
    return `plugin{${this.config.id}}`;
  }
}
