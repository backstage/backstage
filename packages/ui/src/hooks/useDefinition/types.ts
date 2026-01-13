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

import type { ReactNode } from 'react';
import type { Responsive } from '../../types';
import type { utilityClassMap } from '../../utils/utilityClassMap';

type UnwrapResponsive<T> = T extends Responsive<infer U> ? U : T;

export interface PropDefConfig<T> {
  dataAttribute?: boolean;
  default?: UnwrapResponsive<T>;
}

export type UtilityPropKey = keyof typeof utilityClassMap;

export interface ComponentConfig<
  P extends Record<string, any>,
  S extends Record<string, string>,
> {
  styles: S;
  classNames: Record<string, keyof S>;
  propDefs: { [K in keyof P]: PropDefConfig<P[K]> };
  // readonly for compatibility with const inference from factory
  utilityProps?: readonly UtilityPropKey[];
  surface?: 'container' | 'leaf';
}

export interface UseDefinitionOptions<D extends ComponentConfig<any, any>> {
  utilityTarget?: keyof D['classNames'] | null;
  classNameTarget?: keyof D['classNames'] | null;
}

// Resolve prop type: unwrap Responsive, make non-nullable if default exists
// Uses "inverse check" pattern: check if undefined is assignable to the default type
type ResolvePropType<
  T,
  Config extends PropDefConfig<any>,
> = undefined extends Config['default']
  ? UnwrapResponsive<T> // Default is missing/undefined -> keep original type
  : Exclude<UnwrapResponsive<T>, undefined>; // Default exists -> remove undefined

// Build ownProps shape from propDefs
// Iterates over PropDefs keys (not P keys) to preserve literal config types
type ResolvedOwnProps<
  P,
  PropDefs extends Record<string, PropDefConfig<any>>,
> = {
  [K in keyof PropDefs & keyof P]: ResolvePropType<P[K], PropDefs[K]>;
};

type ChildrenProps<Surface extends 'container' | 'leaf' | undefined> =
  Surface extends 'container'
    ? { surfaceChildren: ReactNode; children?: never }
    : Surface extends 'leaf'
    ? { children: ReactNode; surfaceChildren?: never }
    : { children: ReactNode };

type DataAttributeKeys<PropDefs> = {
  [K in keyof PropDefs]: PropDefs[K] extends { dataAttribute: true }
    ? K
    : never;
}[keyof PropDefs];

type DataAttributes<PropDefs> = {
  [K in DataAttributeKeys<PropDefs> as `data-${string & K}`]?: string;
} & { 'data-on-surface'?: string };

export type UtilityKeys<D extends ComponentConfig<any, any>> =
  D['utilityProps'] extends ReadonlyArray<infer K extends string> ? K : never;

type UtilityMapType = typeof utilityClassMap;

// Extract CSS variable key for a given prop (e.g., 'p' -> '--p')
type GetCssVarKey<K> = K extends keyof UtilityMapType
  ? UtilityMapType[K] extends { cssVar: infer V extends string }
    ? V
    : never
  : never;

export type UtilityStyle<Keys extends string> = {
  [K in Keys as GetCssVarKey<K>]?: string | number;
};

type ResolvedUtilityStyle<D extends ComponentConfig<any, any>> = UtilityStyle<
  UtilityKeys<D>
>;

export interface UseDefinitionResult<
  D extends ComponentConfig<any, any>,
  P extends Record<string, any>,
> {
  ownProps: {
    classes: Record<keyof D['classNames'], string>;
  } & ResolvedOwnProps<P, D['propDefs']> &
    ChildrenProps<D['surface']>;

  // Rest props excludes both propDefs keys AND utility prop keys
  restProps: keyof Omit<P, keyof D['propDefs'] | UtilityKeys<D>> extends never
    ? Record<string, never>
    : Omit<P, keyof D['propDefs'] | UtilityKeys<D>>;

  dataAttributes: DataAttributes<D['propDefs']>;

  utilityStyle: ResolvedUtilityStyle<D>;
}
