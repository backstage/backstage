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
import { PropDef } from './prop-def';
import { GetPropDefTypes } from './prop-def';

const paddingPropDefs = (spacingValues: string[]) =>
  ({
    /**
     * Sets the CSS **padding** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * p="4"
     * p="100px"
     * p={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding
     */
    p: {
      type: 'enum | string',
      className: 'cu-p',
      customProperties: ['--p'],
      values: spacingValues,
      responsive: true,
    },
    /**
     * Sets the CSS **padding-left** and **padding-right** properties.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * px="4"
     * px="100px"
     * px={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right
     */
    px: {
      type: 'enum | string',
      className: 'cu-px',
      customProperties: ['--pl', '--pr'],
      values: spacingValues,
      responsive: true,
    },
    /**
     * Sets the CSS **padding-top** and **padding-bottom** properties.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * py="4"
     * py="100px"
     * py={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom
     */
    py: {
      type: 'enum | string',
      className: 'cu-py',
      customProperties: ['--pt', '--pb'],
      values: spacingValues,
      responsive: true,
    },
    /**
     * Sets the CSS **padding-top** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * pt="4"
     * pt="100px"
     * pt={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top
     */
    pt: {
      type: 'enum | string',
      className: 'cu-pt',
      customProperties: ['--pt'],
      values: spacingValues,
      responsive: true,
    },
    /**
     * Sets the CSS **padding-right** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * pr="4"
     * pr="100px"
     * pr={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right
     */
    pr: {
      type: 'enum | string',
      className: 'cu-pr',
      customProperties: ['--pr'],
      values: spacingValues,
      responsive: true,
    },
    /**
     * Sets the CSS **padding-bottom** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * pb="4"
     * pb="100px"
     * pb={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom
     */
    pb: {
      type: 'enum | string',
      className: 'cu-pb',
      customProperties: ['--pb'],
      values: spacingValues,
      responsive: true,
    },
    /**
     * Sets the CSS **padding-left** property.
     * Supports space scale values, CSS strings, and responsive objects.
     *
     * @example
     * pl="4"
     * pl="100px"
     * pl={{ sm: '6', lg: '9' }}
     *
     * @link
     * https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left
     */
    pl: {
      type: 'enum | string',
      className: 'cu-pl',
      customProperties: ['--pl'],
      values: spacingValues,
      responsive: true,
    },
  } satisfies {
    p: PropDef<(typeof spacingValues)[number]>;
    px: PropDef<(typeof spacingValues)[number]>;
    py: PropDef<(typeof spacingValues)[number]>;
    pt: PropDef<(typeof spacingValues)[number]>;
    pr: PropDef<(typeof spacingValues)[number]>;
    pb: PropDef<(typeof spacingValues)[number]>;
    pl: PropDef<(typeof spacingValues)[number]>;
  });

type PaddingProps = GetPropDefTypes<typeof paddingPropDefs>;

export { paddingPropDefs };
export type { PaddingProps };
