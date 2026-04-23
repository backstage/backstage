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
import { reduceKindSchema } from '../jsonSchema/reduceKindSchema';
import { validateKindRootSchemaSemantics } from '../jsonSchema/validateKindRootSchemaSemantics';
import { validateMetaSchema } from '../jsonSchema/validateMetaSchema';
import { CatalogModelOp } from '../operations';
import { createDeclareKindOp } from '../operations/declareKind';
import { createDeclareKindVersionOp } from '../operations/declareKindVersion';

/**
 * The definition of a catalog model kind, roughly resembling a JSON Schema.
 *
 * @alpha
 */
export interface CatalogModelKindDefinition {
  /**
   * The apiVersion group of the kind, e.g. "backstage.io".
   */
  group: string;

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
   * A short description of the kind.
   *
   * @remarks
   *
   * For kinds that have wide applicability over for example several different
   * spec types, this description should be a generic one and the types
   * themselves can be more precise.
   */
  description: string;

  /**
   * Declare one or more versions of the kind's actual schema shape.
   */
  versions?: CatalogModelKindVersionDefinition[];
}

/**
 * The definition of one or more specific versions of a catalog model kind.
 *
 * @alpha
 */
export interface CatalogModelKindVersionDefinition {
  /**
   * The specific version name or names, e.g. "v1alpha1" or
   * ["v1alpha1", "v1beta1"]. The kind group and the version name form the
   * full apiVersion, e.g. "backstage.io/v1alpha1".
   */
  name: string | string[];

  /**
   * The spec type or types that this version applies to.
   *
   * @remarks
   *
   * This can be used to make kinds whose spec effectively are discriminated
   * unions. If you don't specify this, the schema will apply to a spec that
   * has no type given at all, or to those where the type is not among the set
   * of any other known declared spec types.
   *
   * TODO: Should this be more like `matcher: { [path: string]: string }`, or
   * even a full JSON Schema that can be used in an "if"?
   */
  specType?: string | string[];

  /**
   * A short description of this particular version (and type, where applicable).
   */
  description?: string;

  /**
   * The fields that shall be used to generate relations, if any.
   *
   * TODO: Should this be not an array, to be more easily mergeable? Or should
   * we just have a custom merge strategy for them
   */
  relationFields?: CatalogModelKindRelationFieldDefinition[];

  schema: {
    jsonSchema: JsonObject;
  };
}

/**
 * @alpha
 */
export interface CatalogModelKindRelationFieldDefinition {
  /**
   * What field that shall be used to generate relations.
   *
   * @remarks
   *
   * The field value is expected to be a string or string array at runtime.
   */
  selector: { path: string };
  /**
   * The relation type that this field generates, e.g. "ownedBy".
   */
  relation: string;
  /**
   * If the given shorthand ref did not have a kind, use this kind as the
   * default. If no default kind is specified, the ref must contain a kind.
   */
  defaultKind?: string;
  /**
   * If the given shorthand ref did not have a namespace, either inherit the
   * namespace of the entity itself, or choose the default namespace. If no
   * default namespace is specified, the namespace of the entity itself is used.
   */
  defaultNamespace?: 'default' | 'inherit';
  /**
   * Only allow relations to be specified to the given kinds. This list must
   * include the default kind, if any. If no allowed kinds are specified, all
   * kinds are.
   */
  allowedKinds?: string[];
}

export function opsFromCatalogModelKind(
  kind: CatalogModelKindDefinition,
): CatalogModelOp[] {
  const ops: CatalogModelOp[] = [];

  ops.push(
    createDeclareKindOp({
      kind: kind.names.kind,
      group: kind.group,
      properties: {
        singular: kind.names.singular,
        plural: kind.names.plural,
        description: kind.description,
      },
    }),
  );

  for (const version of kind.versions ?? []) {
    const jsonSchema = reduceKindSchema(version.schema.jsonSchema);
    validateMetaSchema(jsonSchema);
    validateKindRootSchemaSemantics(jsonSchema);
    const names = Array.isArray(version.name) ? version.name : [version.name];
    for (const name of names) {
      const specTypes = version.specType
        ? [version.specType].flat()
        : [undefined];
      for (const specType of specTypes) {
        ops.push(
          createDeclareKindVersionOp({
            kind: kind.names.kind,
            name,
            specType: specType,
            properties: {
              description: version.description,
              relationFields: version.relationFields,
              schema: {
                jsonSchema: jsonSchema as any,
              },
            },
          }),
        );
      }
    }
  }

  return ops;
}
