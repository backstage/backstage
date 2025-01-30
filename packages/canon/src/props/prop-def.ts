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
import type React from 'react';
import type { Breakpoint, Responsive } from '../types';

/** @public */
const breakpoints = ['initial', 'xs', 'sm', 'md', 'lg', 'xl'] as Breakpoint[];

/** @public */
export type BooleanPropDef = {
  type: 'boolean';
  default?: boolean;
  required?: boolean;
  className?: string;
};

/** @public */
export type StringPropDef = {
  type: 'string';
  default?: string;
  required?: boolean;
};

/** @public */
export type ReactNodePropDef = {
  type: 'ReactNode';
  default?: React.ReactNode;
  required?: boolean;
};

/** @public */
export type EnumPropDef<T> = {
  type: 'enum';
  values: readonly T[];
  default?: T;
  required?: boolean;
};

/** @public */
export type EnumOrStringPropDef<T> = {
  type: 'enum | string';
  values: readonly T[];
  default?: T | string;
  required?: boolean;
};

/** @public */
export type NonStylingPropDef = {
  className?: never;
  customProperties?: never;
  parseValue?: never;
};

/** @public */
export type StylingPropDef = {
  className: string;
  parseValue?: (value: string) => string | undefined;
};

/** @public */
export type ArbitraryStylingPropDef = {
  className: string;
  customProperties: `--${string}`[];
  parseValue?: (value: string) => string | undefined;
};

/** @public */
export type RegularPropDef<T> =
  | ReactNodePropDef
  | BooleanPropDef
  | (StringPropDef & ArbitraryStylingPropDef)
  | (StringPropDef & NonStylingPropDef)
  | (EnumPropDef<T> & StylingPropDef)
  | (EnumPropDef<T> & NonStylingPropDef)
  | (EnumOrStringPropDef<T> & ArbitraryStylingPropDef)
  | (EnumOrStringPropDef<T> & NonStylingPropDef);

/** @public */
type ResponsivePropDef<T = any> = RegularPropDef<T> & {
  responsive: true;
};

/** @public */
type PropDef<T = any> = RegularPropDef<T> | ResponsivePropDef<T>;

/** @public */
export type GetPropDefType<Def> = Def extends BooleanPropDef
  ? Def extends ResponsivePropDef
    ? Responsive<boolean>
    : boolean
  : Def extends StringPropDef
  ? Def extends ResponsivePropDef
    ? Responsive<string>
    : string
  : Def extends ReactNodePropDef
  ? Def extends ResponsivePropDef
    ? Responsive<React.ReactNode>
    : React.ReactNode
  : Def extends EnumOrStringPropDef<infer Type>
  ? Def extends ResponsivePropDef<infer Type extends string>
    ? Responsive<string | Type>
    : string | Type
  : Def extends EnumPropDef<infer Type>
  ? Def extends ResponsivePropDef<infer Type>
    ? Responsive<Type>
    : Type
  : never;

/** @public */
type GetPropDefTypes<P> = {
  [K in keyof P]?: GetPropDefType<P[K]>;
};

export { breakpoints };
export type {
  PropDef,
  GetPropDefTypes,
  ResponsivePropDef,
  Breakpoint,
  Responsive,
};
