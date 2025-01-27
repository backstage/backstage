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

const positionValues = [
  'static',
  'relative',
  'absolute',
  'fixed',
  'sticky',
] as const;

const positionPropDefs = {
  /**
   * Sets the CSS **position** property.
   * Supports the corresponding CSS values and responsive objects.
   *
   * @example
   * position="absolute"
   * position={{ sm: 'absolute', lg: 'sticky' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/position
   */
  position: {
    type: 'enum',
    className: 'cu-position',
    values: positionValues,
    responsive: true,
  },
  /**
   * Sets the CSS **top** property.
   * Supports space scale values, CSS strings, and responsive objects.
   *
   * @example
   * top="4"
   * top="100px"
   * top={{ sm: '0', lg: '50%' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/top
   */
} satisfies {
  position: PropDef<(typeof positionValues)[number]>;
};

// Use all of the imported prop defs to ensure that JSDoc works
type PositionProps = GetPropDefTypes<typeof positionPropDefs>;

export { positionPropDefs };
export type { PositionProps };
