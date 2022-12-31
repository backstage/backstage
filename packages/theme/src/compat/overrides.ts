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

import { Overrides } from '@material-ui/core/styles/overrides';
import { ComponentsProps } from '@material-ui/core/styles/props';
import { ComponentsOverrides, Theme, ThemeOptions } from '@mui/material/styles';

type V5Override = ComponentsOverrides[keyof ComponentsOverrides];
type V4Override = Overrides[keyof Overrides];

// Converts callback-based overrides to static styles, e.g.
// { root: theme => ({ color: theme.color }) } -> { root: { color: 'red' } }
function adaptV5Override(theme: Theme, overrides: V5Override): V4Override {
  if (!overrides) {
    return overrides as V4Override;
  }
  if (typeof overrides === 'function') {
    return overrides(theme) as V4Override;
  }
  if (typeof overrides === 'object') {
    return Object.fromEntries(
      Object.entries(overrides).map(([className, style]) => {
        if (typeof style === 'function') {
          return [className, style({ theme })];
        }
        return [className, style];
      }),
    );
  }
  return overrides as V4Override;
}

// Transform v5 theme overrides into a v4 theme, by converting the callback-based overrides
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
      overrides[name] = adaptV5Override(
        theme,
        component.styleOverrides as V5Override,
      );
    }
    if ('defaultProps' in component) {
      props[name] = component.defaultProps;
    }
  }

  return { overrides, props };
}
