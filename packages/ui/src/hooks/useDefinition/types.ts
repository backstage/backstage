/*
 * Copyright 2025 The Backstage Authors
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

import type { ReactNode, CSSProperties } from 'react';
import type { Responsive } from '../../types';

// Extract raw value from Responsive wrapper
type UnwrapResponsive<T> = T extends Responsive<infer U> ? U : T;

export interface PropDefConfig<T> {
  dataAttribute?: boolean;
  default?: UnwrapResponsive<T>;
}

export interface ComponentConfig<
  P extends Record<string, any>,
  S extends Record<string, string>,
> {
  styles: S;
  classNames: Record<string, keyof S>;
  propDefs: { [K in keyof P]: PropDefConfig<P[K]> };
  utilityProps?: string[];
  surface?: 'container' | 'leaf';
}

export interface UseDefinitionOptions<D extends ComponentConfig<any, any>> {
  utilityTarget?: keyof D['classNames'] | null;
  classNameTarget?: keyof D['classNames'] | null;
}

// Resolve prop type: unwrap Responsive, make non-nullable if default exists
type ResolvePropType<
  T,
  Config extends PropDefConfig<any>,
> = Config['default'] extends {} // Check if default is present (not undefined)
  ? Exclude<UnwrapResponsive<T>, undefined> // Only remove undefined
  : UnwrapResponsive<T>;

// Build ownProps shape from propDefs
type ResolvedOwnProps<
  P,
  PropDefs extends Record<keyof P, PropDefConfig<any>>,
> = {
  [K in keyof P]: ResolvePropType<P[K], PropDefs[K]>;
};

// Conditional children type based on surface
type ChildrenProps<Surface extends 'container' | 'leaf' | undefined> =
  Surface extends 'container'
    ? { surfaceChildren: ReactNode }
    : { children: ReactNode };

// Data attributes type
type DataAttributeKeys<PropDefs> = {
  [K in keyof PropDefs]: PropDefs[K] extends { dataAttribute: true }
    ? K
    : never;
}[keyof PropDefs];

type DataAttributes<PropDefs> = {
  [K in DataAttributeKeys<PropDefs> as `data-${string & K}`]?: string;
} & { 'data-on-surface'?: string };

// Helper to define the base rest props
type BaseRestProps<P, PropDefs> = Omit<P, keyof PropDefs>;

export interface UseDefinitionResult<
  D extends ComponentConfig<any, any>,
  P extends Record<string, any>,
> {
  ownProps: {
    classes: Record<keyof D['classNames'], string>;
  } & ResolvedOwnProps<P, D['propDefs']> &
    ChildrenProps<D['surface']>;

  restProps: keyof BaseRestProps<P, D['propDefs']> extends never
    ? Record<string, never>
    : BaseRestProps<P, D['propDefs']>;

  dataAttributes: DataAttributes<D['propDefs']>;

  utilityStyle: CSSProperties;
}
