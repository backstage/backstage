/*
 * Copyright 2024 The Backstage Authors
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

import {
  AnyExtensionDataRef,
  ExtensionDataContainer,
  ExtensionDataRef,
  ExtensionDataValue,
} from '@backstage/frontend-plugin-api';

export function createExtensionDataContainer<UData extends AnyExtensionDataRef>(
  values: Iterable<
    UData extends ExtensionDataRef<infer IData, infer IId>
      ? ExtensionDataValue<IData, IId>
      : never
  >,
  declaredRefs?: ExtensionDataRef<any, any, any>[],
): ExtensionDataContainer<UData> {
  const container = new Map<string, ExtensionDataValue<any, any>>();
  const verifyRefs =
    declaredRefs && new Map(declaredRefs.map(ref => [ref.id, ref]));

  for (const output of values) {
    if (verifyRefs) {
      if (!verifyRefs.delete(output.id)) {
        throw new Error(
          `extension data '${output.id}' was provided but not declared`,
        );
      }
    }
    container.set(output.id, output);
  }

  const remainingRefs =
    verifyRefs &&
    Array.from(verifyRefs.values()).filter(ref => !ref.config.optional);
  if (remainingRefs && remainingRefs.length > 0) {
    throw new Error(
      `missing required extension data value(s) '${remainingRefs
        .map(ref => ref.id)
        .join(', ')}'`,
    );
  }

  return {
    get(ref) {
      return container.get(ref.id)?.value;
    },
    [Symbol.iterator]() {
      return container.values();
    },
  } as ExtensionDataContainer<UData>;
}
