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
import { defineProperties } from '@vanilla-extract/sprinkles';
import { breakpoints, space } from './properties';

export const spacingProperties = defineProperties({
  conditions: breakpoints,
  defaultCondition: 'xs',
  responsiveArray: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
  properties: {
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: space,
    marginBottom: space,
    marginLeft: space,
    marginRight: space,
    gap: space,
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
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
