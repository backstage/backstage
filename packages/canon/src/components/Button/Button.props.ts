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

/** @public */
export const buttonPropDefs = {
  variant: {
    type: 'enum',
    values: ['primary', 'secondary'],
    className: 'canon-Button--variant',
    default: 'primary',
    responsive: true,
  },
  size: {
    type: 'enum',
    values: ['small', 'medium'],
    className: 'canon-Button--size',
    default: 'medium',
    responsive: true,
  },
} satisfies {
  variant: PropDef<'primary' | 'secondary'>;
  size: PropDef<'small' | 'medium'>;
};

/** @public */
export type ButtonOwnProps = GetPropDefTypes<typeof buttonPropDefs>;
