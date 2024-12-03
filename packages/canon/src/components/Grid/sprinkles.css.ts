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

const gridProperties = defineProperties({
  conditions: breakpoints,
  defaultCondition: 'xs',
  properties: {
    gridTemplateColumns: {
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
      8: 'repeat(8, minmax(0, 1fr))',
      9: 'repeat(9, minmax(0, 1fr))',
      10: 'repeat(10, minmax(0, 1fr))',
      11: 'repeat(11, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
    },
  },
  shorthands: {
    columns: ['gridTemplateColumns'],
  },
});

export const gridSprinkles = createSprinkles(
  spacingProperties,
  colorProperties,
  gridProperties,
);

const gridItemProperties = defineProperties({
  conditions: breakpoints,
  defaultCondition: 'xs',
  properties: {
    gridColumn: {
      1: 'span 1 / span 1',
      2: 'span 2 / span 2',
      3: 'span 3 / span 3',
      4: 'span 4 / span 4',
      5: 'span 5 / span 5',
      6: 'span 6 / span 6',
      7: 'span 7 / span 7',
      8: 'span 8 / span 8',
      9: 'span 9 / span 9',
      10: 'span 10 / span 10',
      11: 'span 11 / span 11',
      12: 'span 12 / span 12',
      full: '1 / -1',
    },
    gridColumnStart: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      auto: 'auto',
    },
    gridColumnEnd: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      auto: 'auto',
    },
  },
  shorthands: {
    span: ['gridColumn'],
    start: ['gridColumnStart'],
    end: ['gridColumnEnd'],
  },
});

export const gridItemSprinkles = createSprinkles(
  colorProperties,
  gridItemProperties,
);
