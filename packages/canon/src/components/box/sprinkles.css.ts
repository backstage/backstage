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
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import {
  alignItems,
  borderRadius,
  breakpoints,
  colors,
  backgroundColors,
  display,
  flexDirection,
  justifyContent,
  space,
  boxShadows,
  border,
} from './properties';

export const commonProperties = {
  flexDirection,
  justifyContent,
  alignItems,
  borderRadius,
  boxShadow: boxShadows,
  border,
  paddingTop: space,
  paddingBottom: space,
  paddingLeft: space,
  paddingRight: space,
  marginTop: space,
  marginBottom: space,
  marginLeft: space,
  marginRight: space,
  gap: space,
};

export const boxShorthands: Record<string, string[]> = {
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
};

const responsiveProperties = defineProperties({
  conditions: breakpoints,
  defaultCondition: 'xs',
  properties: {
    ...commonProperties,
    display,
  },
  shorthands: {
    ...boxShorthands,
    placeItems: ['justifyContent', 'alignItems'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    light: { selector: '[data-theme="light"] &' },
    dark: { selector: '[data-theme="dark"] &' },
  },
  defaultCondition: ['light', 'dark'],
  properties: {
    color: colors,
    background: backgroundColors,
  },
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);

// It's a good idea to export the Sprinkles type too
export type Sprinkles = Parameters<typeof sprinkles>[0];
