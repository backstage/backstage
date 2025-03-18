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

const alignValues = ['start', 'center', 'end', 'baseline', 'stretch'] as const;
const directionValues = [
  'row',
  'column',
  'row-reverse',
  'column-reverse',
] as const;
const justifyValues = ['start', 'center', 'end', 'between'] as const;

/** @public */
const flexPropDefs = {
  align: {
    type: 'enum',
    className: 'cu-align',
    values: alignValues,
    responsive: true,
  },
  direction: {
    type: 'enum',
    className: 'cu-fd',
    values: directionValues,
    responsive: true,
  },
  justify: {
    type: 'enum',
    className: 'cu-jc',
    values: justifyValues,
    responsive: true,
  },
} satisfies {
  align: PropDef<(typeof alignValues)[number]>;
  direction: PropDef<(typeof directionValues)[number]>;
  justify: PropDef<(typeof justifyValues)[number]>;
};

/** @public */
type FlexOwnProps = GetPropDefTypes<typeof flexPropDefs>;

export { flexPropDefs };
export type { FlexOwnProps };
