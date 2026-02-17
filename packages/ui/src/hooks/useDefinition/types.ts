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

export type UnwrapResponsive<T> = T extends Responsive<infer U> ? U : T;

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
  /**
   * How this component participates in the bg system.
   *
   * - `'provider'` — calls `useBgProvider`, sets `data-bg`, wraps children in `BgProvider`
   * - `'consumer'` — calls `useBgConsumer`, sets `data-on-bg`
   */
  bg?: 'provider' | 'consumer';
}

/**
 * Type constraint that validates bg props are present in the props type.
 * - Provider components must include 'bg' in their props
 * - Consumer components don't need a bg prop
 */
export type BgPropsConstraint<P, Bg> = Bg extends 'provider'
  ? 'bg' extends keyof P
    ? {}
    : {
        __error: 'Bg provider components must include bg in props type.';
      }
  : {};

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

type BaseOwnProps<
  D extends ComponentConfig<any, any>,
  P extends Record<string, any>,
> = {
  classes: Record<keyof D['classNames'], string>;
} & ResolvedOwnProps<P, D['propDefs']>;

type ResolveBgProps<
  D extends ComponentConfig<any, any>,
  TBase,
> = D['bg'] extends 'provider'
  ? Omit<TBase, 'children'> & { childrenWithBgProvider: ReactNode }
  : TBase;

type DataAttributeKeys<PropDefs> = {
  [K in keyof PropDefs]: PropDefs[K] extends { dataAttribute: true }
    ? K
    : never;
}[keyof PropDefs];

type DataAttributes<PropDefs> = {
  [K in DataAttributeKeys<PropDefs> as `data-${Lowercase<
    string & K
  >}`]?: string;
} & { 'data-bg'?: string; 'data-on-bg'?: string };

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
  ownProps: ResolveBgProps<D, BaseOwnProps<D, P>>;

  // Rest props excludes both propDefs keys AND utility prop keys
  restProps: keyof Omit<P, keyof D['propDefs'] | UtilityKeys<D>> extends never
    ? Record<string, never>
    : Omit<P, keyof D['propDefs'] | UtilityKeys<D>>;

  dataAttributes: DataAttributes<D['propDefs']>;

  utilityStyle: ResolvedUtilityStyle<D>;
}
