/*
 * Copyright 2026 The Backstage Authors
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

import { Entity, parseEntityRef } from '@backstage/catalog-model';
import { EntityRefPresentationSnapshot } from '@backstage/plugin-catalog-react';

export type EntitySelectionOption = {
  ref: string;
  label: string;
  missing?: boolean;
  entity?: Entity;
  presentation?: EntityRefPresentationSnapshot;
};

export function referenceLabel(ref: string): string {
  try {
    const { kind, name } = parseEntityRef(ref);
    return `${kind.charAt(0).toLocaleUpperCase('en-US')}${kind.slice(
      1,
    )} ${name}`;
  } catch {
    return ref;
  }
}
