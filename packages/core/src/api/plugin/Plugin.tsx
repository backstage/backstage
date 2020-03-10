import { ComponentType } from 'react';
import { PluginOutput, RoutePath, RouteOptions } from './types';
import { Widget } from '../widgetView/types';

export type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

export type PluginHooks = {
  router: RouterHooks;
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

    const outputs = new Array<PluginOutput>();

    this.config.register({
      router: {
        registerRoute(path, component, options) {
          outputs.push({ type: 'route', path, component, options });
        },
        registerRedirect(path, target, options) {
          outputs.push({ type: 'redirect-route', path, target, options });
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
