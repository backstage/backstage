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
import type { PropDef, GetPropDefTypes } from './prop-def.js';

const marginPropDefs = (spacingValues: string[]) =>
  ({
    /**
     * Sets the CSS **margin** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * m="4"
     * m="100px"
     * m={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin
     */
    m: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-m',
      customProperties: ['--m'],
      responsive: true,
    },
    /**
     * Sets the CSS **margin-left** and **margin-right** properties.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * mx="4"
     * mx="100px"
     * mx={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right
     */
    mx: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-mx',
      customProperties: ['--ml', '--mr'],
      responsive: true,
    },
    /**
     * Sets the CSS **margin-top** and **margin-bottom** properties.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * my="4"
     * my="100px"
     * my={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom
     */
    my: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-my',
      customProperties: ['--mt', '--mb'],
      responsive: true,
    },
    /**
     * Sets the CSS **margin-top** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * mt="4"
     * mt="100px"
     * mt={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top
     */
    mt: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-mt',
      customProperties: ['--mt'],
      responsive: true,
    },
    /**
     * Sets the CSS **margin-right** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * mr="4"
     * mr="100px"
     * mr={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right
     */
    mr: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-mr',
      customProperties: ['--mr'],
      responsive: true,
    },
    /**
     * Sets the CSS **margin-bottom** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * mb="4"
     * mb="100px"
     * mb={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom
     */
    mb: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-mb',
      customProperties: ['--mb'],
      responsive: true,
    },
    /**
     * Sets the CSS **margin-left** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * ml="4"
     * ml="100px"
     * ml={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left
     */
    ml: {
      type: 'enum | string',
      values: spacingValues,
      className: 'cu-ml',
      customProperties: ['--ml'],
      responsive: true,
    },
  } satisfies {
    m: PropDef<(typeof spacingValues)[number]>;
    mx: PropDef<(typeof spacingValues)[number]>;
    my: PropDef<(typeof spacingValues)[number]>;
    mt: PropDef<(typeof spacingValues)[number]>;
    mr: PropDef<(typeof spacingValues)[number]>;
    mb: PropDef<(typeof spacingValues)[number]>;
    ml: PropDef<(typeof spacingValues)[number]>;
  });

type MarginProps = GetPropDefTypes<typeof marginPropDefs>;

export { marginPropDefs };
export type { MarginProps };
