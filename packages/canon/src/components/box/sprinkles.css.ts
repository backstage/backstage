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
  defineProperties,
  createSprinkles,
  RequiredConditionalValue,
  ConditionalValue,
  createMapValueFn,
} from '@vanilla-extract/sprinkles';
import { breakpoints, space } from './properties';

export const responsiveProperties = defineProperties({
  conditions: breakpoints,
  defaultCondition: 'xs',
  responsiveArray: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
  properties: {
    flexDirection: ['row', 'column'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    borderRadius: {
      none: 0,
      small: '4px',
      medium: '8px',
      full: '9999px',
    },
    boxShadow: {
      small: 'var(--canon-box-shadow-small)',
      medium: 'var(--canon-box-shadow-medium)',
      large: 'var(--canon-box-shadow-large)',
    },
    border: {
      none: 'none',
      thin: '1px solid var(--canon-outline)',
      error: '1px solid var(--canon-error)',
    },
    display: ['none', 'flex', 'block', 'inline'],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: space,
    marginBottom: space,
    marginLeft: space,
    marginRight: space,
    gap: space,
    flexWrap: ['wrap', 'nowrap'],
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    p: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    pt: ['paddingTop'],
    pr: ['paddingRight'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    m: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    mt: ['marginTop'],
    mr: ['marginRight'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
  },
});

export const colorProperties = defineProperties({
  conditions: {
    light: { selector: '[data-theme="light"] &' },
    dark: { selector: '[data-theme="dark"] &' },
  },
  defaultCondition: ['light', 'dark'],
  properties: {
    color: {
      primary: 'var(--canon-text-primary)',
      secondary: 'var(--canon-text-secondary)',
      error: 'var(--canon-error)',
    },
    background: {
      background: 'var(--canon-background)',
      elevation1: 'var(--canon-surface-1)',
      elevation2: 'var(--canon-surface-2)',
      transparent: 'transparent',
    },
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];

export type OptionalResponsiveValue<Value extends string | number> =
  ConditionalValue<typeof responsiveProperties, Value>;

export type RequiredResponsiveValue<Value extends string | number> =
  RequiredConditionalValue<typeof responsiveProperties, Value>;

export const mapResponsiveValue = createMapValueFn(responsiveProperties);
