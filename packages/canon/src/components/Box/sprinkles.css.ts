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
import { breakpoints } from '../../layout/properties';
import { colorProperties, spacingProperties } from '../../layout/sprinkles.css';

export const boxProperties = defineProperties({
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
    flexWrap: ['wrap', 'nowrap'],
  },
});

export const boxSprinkles = createSprinkles(
  spacingProperties,
  boxProperties,
  colorProperties,
);
