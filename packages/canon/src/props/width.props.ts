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
import type { GetPropDefTypes, PropDef } from './prop-def';

const widthPropDefs = {
  /**
   * Sets the CSS **width** property.
   * Supports CSS strings and responsive objects.
   *
   * @example
   * width="100px"
   * width={{ md: '100vw', xl: '1400px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/width
   */
  width: {
    type: 'string',
    className: 'cu-w',
    customProperties: ['--width'],
    responsive: true,
  },
  /**
   * Sets the CSS **min-width** property.
   * Supports CSS strings and responsive objects.
   *
   * @example
   * minWidth="100px"
   * minWidth={{ md: '100vw', xl: '1400px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/min-width
   */
  minWidth: {
    type: 'string',
    className: 'cu-min-w',
    customProperties: ['--min-width'],
    responsive: true,
  },
  /**
   * Sets the CSS **max-width** property.
   * Supports CSS strings and responsive objects.
   *
   * @example
   * maxWidth="100px"
   * maxWidth={{ md: '100vw', xl: '1400px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
   */
  maxWidth: {
    type: 'string',
    className: 'cu-max-w',
    customProperties: ['--max-width'],
    responsive: true,
  },
} satisfies {
  width: PropDef<string>;
  minWidth: PropDef<string>;
  maxWidth: PropDef<string>;
};

type WidthProps = GetPropDefTypes<typeof widthPropDefs>;

export { widthPropDefs };
export type { WidthProps };
