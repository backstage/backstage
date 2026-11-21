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

import { Expand } from '@backstage/types';
import { ExtensionBlueprint } from './createExtensionBlueprint';

/**
 * Records the identity of a blueprint in its type, so that the extensions
 * made with it carry the identity in their literals. This is only a type
 * level change, the blueprint is returned as is.
 *
 * @internal
 */
export function withBlueprintIdentity<
  const TIdentity extends string,
  TBlueprint extends ExtensionBlueprint<any>,
>(
  _identity: TIdentity,
  blueprint: TBlueprint,
): TBlueprint extends ExtensionBlueprint<infer IParameters>
  ? ExtensionBlueprint<Expand<IParameters & { blueprint: TIdentity }>>
  : never {
  return blueprint as any;
}
