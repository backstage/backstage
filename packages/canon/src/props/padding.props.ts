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

/** @public */
const paddingPropDefs = (spacingValues: string[]) =>
  ({
    p: {
      type: 'enum | string',
      className: 'cu-p',
      customProperties: ['--p'],
      values: spacingValues,
      responsive: true,
    },
    px: {
      type: 'enum | string',
      className: 'cu-px',
      customProperties: ['--px'],
      values: spacingValues,
      responsive: true,
    },
    py: {
      type: 'enum | string',
      className: 'cu-py',
      customProperties: ['--py'],
      values: spacingValues,
      responsive: true,
    },
    pt: {
      type: 'enum | string',
      className: 'cu-pt',
      customProperties: ['--pt'],
      values: spacingValues,
      responsive: true,
    },
    pr: {
      type: 'enum | string',
      className: 'cu-pr',
      customProperties: ['--pr'],
      values: spacingValues,
      responsive: true,
    },
    pb: {
      type: 'enum | string',
      className: 'cu-pb',
      customProperties: ['--pb'],
      values: spacingValues,
      responsive: true,
    },
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

/** @public */
type PaddingProps = GetPropDefTypes<typeof paddingPropDefs>;

export { paddingPropDefs };
export type { PaddingProps };
