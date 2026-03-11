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

import { JsonObject } from '@backstage/types';
import { OpDeclareKindV1 } from './operations';
import { CatalogModelExtension, OpaqueCatalogModelExtension } from './types';

/**
 * A compiled catalog model kind.
 */
export interface CatalogModelKind {
  /**
   * The API version(s) of the kind that this schema applies to, e.g.
   * "backstage.io/v1alpha1".
   */
  apiVersions: string[];

  /**
   * The names used for this kind.
   */
  names: {
    /**
     * The name of the kind with proper casing, e.g. "Component".
     */
    kind: string;

    /**
     * The singular form of the kind name, e.g. "component".
     */
    singular: string;

    /**
     * The plural form of the kind name, e.g. "components".
     */
    plural: string;
  };

  /**
   * The JSON schema of the kind.
   *
   * @remarks
   *
   * This can be used for validation of entities. Note that it is up to the
   * caller to ensure that the kind and apiVersion match what you are validating
   * against.
   */
  jsonSchema: JsonObject;
}

/**
 * A compiled catalog model relation.
 */
export interface CatalogModelRelation {}

/**
 * A compiled catalog model.
 *
 * @alpha
 */
export interface CatalogModel {
  /**
   * Look up a kind in the model.
   *
   * @returns The kind if found, or `undefined` if no matching kind exists.
   * @throws TypeError if the kind exists in the model, but not for this apiVersion or type.
   */
  getKind(
    options:
      | { kind: string; apiVersion: string; type?: string }
      | { kind: string; apiVersion: string; spec: { type?: string } },
  ): CatalogModelKind | undefined;
  /**
   * Look up all relations that originate from a given kind.
   *
   * @param kind - The kind name, e.g. "Component".
   * @returns The relations originating from the kind, or `undefined` if the
   *   kind is not known.
   */
  getRelations(kind: string): CatalogModelRelation[] | undefined;
}

/**
 * Compiles a set of catalog model extensions into a single catalog model.
 *
 * @alpha
 * @param extensions - The extensions to compile.
 * @returns The compiled catalog model.
 */
export function compileCatalogModel(
  extensions: Iterable<CatalogModelExtension>,
): CatalogModel {
  const kinds = new Map<
    string,
    { modelName: string; properties: OpDeclareKindV1['properties'] }
  >();

  for (const externalExtension of extensions) {
    const extension = OpaqueCatalogModelExtension.toInternal(externalExtension);
    for (const op of extension.ops) {
      switch (op.op) {
        case 'declareKind.v1':
          if (kinds.has(op.kind)) {
            const previouos = kinds.get(op.kind)!.modelName;
            throw new Error(
              `Kind '${op.kind}' already declared in model extension '${previouos}', and now also in '${extension.modelName}'`,
            );
          }
          // kinds.set(op.kind, {
          //   modelName: extension.modelName,
          //   properties: op.properties,
          // });
          break;

        case 'declareKindSpecField.v1':
          break;

        case 'declareRelation.v1':
          break;

        default:
          throw new Error(
            `Unknown operation in model extension '${
              extension.modelName
            }': '${String((op as any).type)}'`,
          );
      }
    }
  }

  return {} as any;
}
