import { ComponentType } from 'react';
import { IconComponent } from '../types';
import { Widget } from '../widgetView/types';

export type RouteOptions = {
  // Whether the route path must match exactly, defaults to true.
  exact?: boolean;
};

export type RoutePath = string;

export type RouteOutput = {
  type: 'route';
  path: RoutePath;
  component: ComponentType<{}>;
  options?: RouteOptions;
};

export type RedirectRouteOutput = {
  type: 'redirect-route';
  path: RoutePath;
  target: RoutePath;
  options?: RouteOptions;
};

export type WidgetOutput = {
  type: 'widget';
  widget: Widget;
};

export type EntityPageViewRouteOutput = {
  type: 'entity-page-view-route';
  path: RoutePath;
  component: ComponentType<any>;
  options?: RouteOptions;
};

export type EntityPageNavItemOutput = {
  type: 'entity-page-nav-item';
  title: string;
  icon: IconComponent;
  target: RoutePath;
};

export type PluginOutput =
  | RouteOutput
  | RedirectRouteOutput
  | WidgetOutput
  | EntityPageViewRouteOutput
  | EntityPageNavItemOutput;
