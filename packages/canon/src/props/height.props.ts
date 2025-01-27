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
import type { PropDef, GetPropDefTypes } from './prop-def';

const heightPropDefs = {
  /**
   * Sets the CSS **height** property.
   * Supports CSS strings and responsive objects.
   *
   * @example
   * height="100px"
   * height={{ md: '100vh', xl: '600px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/height
   */
  height: {
    type: 'string',
    className: 'cu-h',
    customProperties: ['--height'],
    responsive: true,
  },
  /**
   * Sets the CSS **min-height** property.
   * Supports CSS strings and responsive objects.
   *
   * @example
   * minHeight="100px"
   * minHeight={{ md: '100vh', xl: '600px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/min-height
   */
  minHeight: {
    type: 'string',
    className: 'cu-min-h',
    customProperties: ['--min-height'],
    responsive: true,
  },
  /**
   * Sets the CSS **max-height** property.
   * Supports CSS strings and responsive objects.
   *
   * @example
   * maxHeight="100px"
   * maxHeight={{ md: '100vh', xl: '600px' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/max-height
   */
  maxHeight: {
    type: 'string',
    className: 'cu-max-h',
    customProperties: ['--max-height'],
    responsive: true,
  },
} satisfies {
  height: PropDef<string>;
  minHeight: PropDef<string>;
  maxHeight: PropDef<string>;
};

type HeightProps = GetPropDefTypes<typeof heightPropDefs>;

export { heightPropDefs };
export type { HeightProps };
