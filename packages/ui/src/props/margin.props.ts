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

/** @public */
const marginPropDefs = (spacingValues: string[]) =>
  ({
    m: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-m',
      customProperties: ['--m'],
      responsive: true,
    },
    mx: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-mx',
      customProperties: ['--mx'],
      responsive: true,
    },
    my: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-my',
      customProperties: ['--my'],
      responsive: true,
    },
    mt: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-mt',
      customProperties: ['--mt'],
      responsive: true,
    },
    mr: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-mr',
      customProperties: ['--mr'],
      responsive: true,
    },
    mb: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-mb',
      customProperties: ['--mb'],
      responsive: true,
    },
    ml: {
      type: 'enum | string',
      values: spacingValues,
      className: 'bui-ml',
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

/** @public */
type MarginProps = GetPropDefTypes<typeof marginPropDefs>;

export { marginPropDefs };
export type { MarginProps };
