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

import { useMemo } from 'react';
import { useBreakpoint, breakpoints } from './useBreakpoint';
import { applyDefaults, resolveResponsiveValue } from './helpers';
import type {
  Breakpoint,
  ComponentDefinition,
  RAExtendingComponentDefinition,
} from '../types';

// --- Helper types ---

type AnyProps = Record<string, any>;
type AnyStyles = Readonly<Record<string, string>>;
type AnyComponentDefinition = ComponentDefinition<AnyProps, AnyStyles>;

type Responsive<T, BP extends string = Breakpoint> = Partial<Record<BP, T>>;
type ResolvedValue<T> = T extends Responsive<infer V, any> ? V : T;

type EnsureSubtype<Sub extends Super, Super> = Sub;

// --- Public conditional result type ---
//
// Def: the component definition (RA or non-RA)
// All: the *full* props type for the component (ButtonProps, etc)

export type ComponentPropsResult<
  Def,
  All extends AnyProps,
> = Def extends RAExtendingComponentDefinition<any, any>
  ? {
      ownProps: {
        [P in Extract<
          Extract<keyof Def['ownProps'], string>,
          keyof All
        >]: ResolvedValue<All[P]>;
      };
      inheritedProps: Omit<
        All,
        Extract<Extract<keyof Def['ownProps'], string>, keyof All>
      >;
    }
  : {
      // Non-RA: all props are "own", no inheritedProps exposed
      ownProps: { [P in keyof All]: ResolvedValue<All[P]> };
    };

// --- Base shape for implementation ---

type ComponentPropsBase = {
  ownProps: AnyProps;
  inheritedProps?: AnyProps;
};

type _CheckComponentPropsSafe = EnsureSubtype<
  ComponentPropsResult<AnyComponentDefinition, AnyProps>,
  ComponentPropsBase
>;

// --- Internal helpers ---

function isRAExtending(
  def: AnyComponentDefinition,
): def is RAExtendingComponentDefinition<AnyProps, AnyStyles> {
  return (def as any).ownProps != null;
}

function componentPropsImpl(
  definition: AnyComponentDefinition,
  props: AnyProps,
  breakpoint: Breakpoint,
): ComponentPropsBase {
  const propsWithDefaults = applyDefaults(definition, props);

  if (isRAExtending(definition)) {
    const ownKeys = Object.keys(definition.ownProps) as string[];

    const ownProps: AnyProps = {};
    const inheritedProps: AnyProps = { ...propsWithDefaults };

    for (const k of ownKeys) {
      const v = propsWithDefaults[k];
      const resolved = resolveResponsiveValue(v, breakpoint, breakpoints);
      ownProps[k] = resolved ?? v;
      delete inheritedProps[k];
    }

    return { ownProps, inheritedProps };
  }

  // Non-RA: all props are "own"
  const ownProps: AnyProps = {};
  for (const k in propsWithDefaults) {
    const v = propsWithDefaults[k];
    const resolved = resolveResponsiveValue(v, breakpoint, breakpoints);
    ownProps[k] = resolved ?? v;
  }

  return { ownProps };
}

export function useComponentProps<
  Def extends AnyComponentDefinition,
  All extends AnyProps,
>(definition: Def, props: All): ComponentPropsResult<Def, All> {
  const { breakpoint } = useBreakpoint();

  const base = useMemo(
    () =>
      componentPropsImpl(
        definition as AnyComponentDefinition,
        props as AnyProps,
        breakpoint,
      ),
    [definition, props, breakpoint],
  );

  return base as ComponentPropsResult<Def, All>;
}
