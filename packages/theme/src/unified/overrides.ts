/*
 * Copyright 2022 The Backstage Authors
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

import type { Overrides } from '@material-ui/core/styles/overrides';
import type { ComponentsProps } from '@material-ui/core/styles/props';
import { ComponentsOverrides, Theme, ThemeOptions } from '@mui/material/styles';
import { CSSProperties } from 'react';

type V5Override = ComponentsOverrides[Exclude<
  keyof ComponentsOverrides,
  'MuiCssBaseline'
>];
type V4Override = Overrides[keyof Overrides];
type StaticStyleRules = Record<
  string,
  CSSProperties | Record<string, CSSProperties>
>;

// Utility function based on v5 `createSpacing`: https://github.com/mui/material-ui/blob/master/packages/mui-system/src/createTheme/createSpacing.ts#L42C3-L59C5
const __v5Spacing =
  (defaultSpacing: number) =>
  (...argsInput: ReadonlyArray<number | string>) => {
    const args = argsInput.length === 0 ? [1] : argsInput;
    const transform = (argument: string | number, themeSpacing: number) => {
      if (typeof argument === 'string') {
        return argument;
      }
      return themeSpacing * argument;
    };

    return args
      .map(argument => {
        const output = transform(argument, defaultSpacing);
        return typeof output === 'number' ? `${output}px` : output;
      })
      .join(' ');
  };

// Converts callback-based overrides to static styles, e.g.
// { root: theme => ({ color: theme.color }) } -> { root: { color: 'red' } }
function adaptV5CssBaselineOverride(
  theme: Theme,
  overrides: ComponentsOverrides['MuiCssBaseline'],
): StaticStyleRules | undefined {
  if (!overrides || typeof overrides === 'string') {
    return undefined;
  }

  const styles = typeof overrides === 'function' ? overrides(theme) : overrides;
  if (styles) {
    return { '@global': styles } as StaticStyleRules;
  }

  return undefined;
}

// Converts callback-based overrides to static styles, e.g.
// { root: theme => ({ color: theme.color }) } -> { root: { color: 'red' } }
function adaptV5Override(
  theme: Theme,
  overrides: V5Override,
): StaticStyleRules | undefined {
  if (!overrides || typeof overrides === 'string') {
    return undefined;
  }
  if (typeof overrides === 'object') {
    const _theme = { ...theme };
    const defaultSpacing = theme.spacing(1);
    if (typeof defaultSpacing === 'number') {
      // Override potential v4 spacing method: https://mui.com/material-ui/migration/v5-style-changes/#%E2%9C%85-remove-px-suffix
      // `adaptV4Theme as reference: https://github.com/mui/material-ui/blob/v5.x/packages/mui-material/src/styles/adaptV4Theme.js#L54C41-L54C41
      _theme.spacing = __v5Spacing(defaultSpacing);
    }
    return Object.fromEntries(
      Object.entries(overrides).map(([className, style]) => {
        if (typeof style === 'function') {
          return [className, style({ theme: _theme })];
        }
        return [className, style];
      }),
    );
  }
  return overrides as StaticStyleRules;
}

const stateStyleKeyPattern = /^&.Mui-([\w-]+)$/;

// Move state style overrides to the top level, e.g.
// { root: { '&.Mui-active': { color: 'red' } } } -> { active: { color: 'red' } }
function extractV5StateOverrides(
  overrides: StaticStyleRules | undefined,
): StaticStyleRules | undefined {
  let output = overrides;
  if (!overrides || typeof overrides !== 'object') {
    return output;
  }
  for (const className of Object.keys(overrides)) {
    const styles = overrides[className];
    if (!styles || typeof styles !== 'object') {
      continue;
    }
    for (const _styleKey of Object.keys(styles)) {
      const styleKey = _styleKey as keyof typeof styles;
      const match = styleKey.match(stateStyleKeyPattern);
      if (match) {
        const [, state] = match;
        const { [styleKey]: stateStyles, ...restStyles } = styles;
        if (stateStyles) {
          output = {
            ...output,
            [className]: restStyles,
            [state]: stateStyles,
          };
        }
      }
    }
  }
  return output;
}

/**
 * Transform Material UI v5 component themes into a v4 theme props and overrides.
 *
 * @public
 */
export function transformV5ComponentThemesToV4(
  theme: Theme,
  components: ThemeOptions['components'] = {},
): { overrides: Overrides; props: ComponentsProps } {
  const overrides: Record<string, V4Override> = {};
  const props: Record<string, ComponentsProps[keyof ComponentsProps]> = {};

  for (const name of Object.keys(components)) {
    const component = components[name as keyof typeof components];
    if (!component) {
      continue;
    }
    if ('styleOverrides' in component) {
      if (name === 'MuiCssBaseline') {
        overrides[name] = adaptV5CssBaselineOverride(
          theme,
          component.styleOverrides as ComponentsOverrides['MuiCssBaseline'],
        );
      } else {
        overrides[name] = extractV5StateOverrides(
          adaptV5Override(theme, component.styleOverrides as V5Override),
        );
      }
    }
    if ('defaultProps' in component) {
      props[name] = component.defaultProps;
    }
  }

  return { overrides, props };
}
