/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ReactNode,
  ComponentType,
  CSSProperties,
  AnchorHTMLAttributes,
} from 'react';
import { AppNode } from '../apis';
import { RouteRef } from './RouteRef';
import { AnyRouteRefParams } from './types';

// === Location Types ===

/**
 * Represents a location in the app.
 * @public
 */
export interface Location {
  /** The pathname portion of the URL */
  pathname: string;
  /** The search (query string) portion of the URL */
  search: string;
  /** The hash portion of the URL */
  hash: string;
  /** State passed via navigation */
  state: unknown;
  /** Unique key for this location */
  key: string;
}

/**
 * A path object with optional parts.
 * @public
 */
export interface Path {
  /** The pathname portion of the URL */
  pathname: string;
  /** The search (query string) portion of the URL */
  search: string;
  /** The hash portion of the URL */
  hash: string;
}

/**
 * Destination for navigation - can be a string or partial path object.
 * @public
 */
export type To = string | Partial<Path>;

// === Navigation Types ===

/**
 * Options for programmatic navigation.
 * @public
 */
export interface NavigateOptions {
  /** Replace the current history entry instead of pushing */
  replace?: boolean;
  /** State to associate with the new location */
  state?: unknown;
  /** Whether to use relative routing */
  relative?: 'route' | 'path';
}

/**
 * Function returned by useNavigate.
 * @public
 */
export type NavigateFunction = {
  (to: To, options?: NavigateOptions): void;
  (delta: number): void;
};

// === Route Types ===

/**
 * Route object for matching.
 * This interface is compatible with react-router v6/v7 RouteObject.
 * @public
 */
export interface RouteObject {
  /** Unique identifier for the route */
  id?: string;
  /** Whether the path matching is case sensitive */
  caseSensitive?: boolean;
  /** Child routes */
  children?: RouteObject[];
  /** Element to render when matched */
  element?: ReactNode;
  /** Component to render when matched (alternative to element) */
  Component?: ComponentType | null;
  /** Path pattern to match */
  path?: string;
  /** Whether this is an index route */
  index?: boolean;
  /** Element to render when an error occurs in this route */
  errorElement?: ReactNode;
  /** Component to render when an error occurs (alternative to errorElement) */
  ErrorBoundary?: ComponentType | null;
  /** Custom data to associate with this route */
  handle?: unknown;
  /** Backstage-specific: associated route refs */
  routeRefs?: Set<RouteRef<AnyRouteRefParams>>;
  /** Backstage-specific: associated app node */
  appNode?: AppNode;
  /** Allow additional properties for router-specific features */
  [key: string]: unknown;
}

/**
 * Result of route matching.
 * @public
 */
export interface RouteMatch<T extends RouteObject = RouteObject> {
  /** The matched route */
  route: T;
  /** The matched pathname */
  pathname: string;
  /** The matched params */
  params: Record<string, string | undefined>;
}

// === Component Props ===

/**
 * Props for the Link component.
 * @public
 */
export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** The destination URL or path */
  to: To;
  /** Replace instead of push to history */
  replace?: boolean;
  /** State to pass to the new location */
  state?: unknown;
  /** Whether to reload the document (full page navigation) */
  reloadDocument?: boolean;
}

/**
 * Props for the NavLink component.
 * @public
 */
export interface NavLinkProps
  extends Omit<LinkProps, 'children' | 'className' | 'style'> {
  /** Class name - can be a function that receives active state */
  className?:
    | string
    | ((props: {
        isActive: boolean;
        isPending: boolean;
      }) => string | undefined);
  /** Style - can be a function that receives active state */
  style?:
    | CSSProperties
    | ((props: {
        isActive: boolean;
        isPending: boolean;
      }) => CSSProperties | undefined);
  /** Whether to match end of path only */
  end?: boolean;
  /** Children - can be a function that receives active state */
  children?:
    | ReactNode
    | ((props: { isActive: boolean; isPending: boolean }) => ReactNode);
}

/**
 * Props for the Navigate component.
 * @public
 */
export interface NavigateProps {
  /** The destination to navigate to */
  to: To;
  /** Replace instead of push to history */
  replace?: boolean;
  /** State to pass to the new location */
  state?: unknown;
  /** Whether to use relative routing */
  relative?: 'route' | 'path';
}

/**
 * Props for the Route component.
 * This interface is compatible with react-router v6/v7 RouteProps.
 * @public
 */
export interface RouteProps {
  /** Unique identifier for the route */
  id?: string;
  /** Path pattern to match */
  path?: string;
  /** Element to render when matched */
  element?: ReactNode;
  /** Component to render when matched (alternative to element) */
  Component?: ComponentType | null;
  /** Child routes (can be Route elements or nested Routes) */
  children?: ReactNode;
  /** Whether this is an index route */
  index?: boolean;
  /** Case sensitive matching */
  caseSensitive?: boolean;
  /** Element to render when an error occurs in this route */
  errorElement?: ReactNode;
  /** Component to render when an error occurs (alternative to errorElement) */
  ErrorBoundary?: ComponentType | null;
  /** Custom data to associate with this route (accessible via useMatches) */
  handle?: unknown;
}
