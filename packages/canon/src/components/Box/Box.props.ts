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

import type { PropDef, GetPropDefTypes } from '../../props/prop-def';

const as = ['div', 'span'] as const;
const displayValues = ['none', 'inline', 'inline-block', 'block'] as const;

const boxPropDefs = {
  /**
   * Controls whether to render **div** or **span**
   *
   * @example
   * as="div"
   * as="span"
   */
  as: { type: 'enum', values: as, default: 'div' },
  /**
   * Sets the CSS **display** property.
   * Supports a subset of the corresponding CSS values and responsive objects.
   *
   * @example
   * display="inline-block"
   * display={{ sm: 'none', lg: 'block' }}
   *
   * @link
   * https://developer.mozilla.org/en-US/docs/Web/CSS/display
   */
  display: {
    type: 'enum',
    className: 'rt-r-display',
    values: displayValues,
    responsive: true,
  },
} satisfies {
  as: PropDef<(typeof as)[number]>;
  display: PropDef<(typeof displayValues)[number]>;
};

// Use all of the imported prop defs to ensure that JSDoc works
type BoxOwnProps = GetPropDefTypes<typeof boxPropDefs>;

export { boxPropDefs };
export type { BoxOwnProps };
