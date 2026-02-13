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

import { z } from 'zod/v4';
import type { ZodTypeAny, ZodObject, ZodEnum, ZodArray } from 'zod/v4';
import { createCatalogZ } from './CatalogZ';
import type {
  CatalogZ,
  CreateKindConfig,
  ExtensionCallback,
  KindMetadata,
  RelationMetadata,
} from './types';
import { RELATION_METADATA } from './types';

interface KindSchema {
  metadata: ZodObject<any>;
  spec: ZodObject<any>;
}

/**
 * Creates the base entity envelope fields that all kinds inherit.
 * @internal
 */
function createBaseMetadataFields() {
  return {
    name: z.string().meta({ description: 'Entity name' }),
    namespace: z
      .string()
      .default('default')
      .meta({ description: 'Entity namespace' }),
    title: z.string().optional().meta({ description: 'Display title' }),
    description: z
      .string()
      .optional()
      .meta({ description: 'Human-readable description' }),
    annotations: z
      .record(z.string(), z.string())
      .optional()
      .meta({ description: 'Annotations' }),
    labels: z
      .record(z.string(), z.string())
      .optional()
      .meta({ description: 'Labels' }),
    tags: z
      .array(z.string())
      .optional()
      .meta({ description: 'Tags for classification' }),
    links: z
      .array(
        z.object({
          url: z.string().meta({ description: 'Link URL' }),
          title: z.string().optional().meta({ description: 'Link title' }),
          icon: z.string().optional().meta({ description: 'Link icon' }),
        }),
      )
      .optional()
      .meta({ description: 'Entity links' }),
  };
}

/**
 * Lazy reference to a kind's schema.
 * Allows referencing and extending kinds before resolution.
 * @public
 */
export class KindReference {
  private specExtensions: ExtensionCallback[] = [];
  private metadataExtensions: ExtensionCallback[] = [];
  private annotationExtensions: ExtensionCallback[] = [];
  private labelExtensions: ExtensionCallback[] = [];

  /** @internal */
  constructor(
    public readonly kindName: string,
    private registry: CatalogModelRegistry,
  ) {}

  get spec() {
    return {
      extend: (callback: ExtensionCallback) => {
        this.specExtensions.push(callback);
      },
      fields: new Proxy(
        {},
        {
          get: (_target, prop: string) => {
            return this.registry.getLazyField(this.kindName, 'spec', prop);
          },
        },
      ) as Record<string, ZodTypeAny>,
    };
  }

  get metadata() {
    return {
      extend: (callback: ExtensionCallback) => {
        this.metadataExtensions.push(callback);
      },
      fields: new Proxy(
        {},
        {
          get: (_target, prop: string) => {
            return this.registry.getLazyField(this.kindName, 'metadata', prop);
          },
        },
      ) as Record<string, ZodTypeAny>,
      annotations: {
        extend: (callback: ExtensionCallback) => {
          this.annotationExtensions.push(callback);
        },
      },
      labels: {
        extend: (callback: ExtensionCallback) => {
          this.labelExtensions.push(callback);
        },
      },
    };
  }

  /** @internal */
  _getExtensions() {
    return {
      spec: this.specExtensions,
      metadata: this.metadataExtensions,
      annotations: this.annotationExtensions,
      labels: this.labelExtensions,
    };
  }
}

/**
 * Registry for catalog model kinds and their schemas.
 *
 * Two-phase operation:
 * 1. Registration phase: collect kind definitions and extensions
 * 2. Resolution phase: merge extensions and validate the final schema
 *
 * @public
 */
export class CatalogModelRegistry {
  private kinds = new Map<string, KindMetadata>();
  private schemas = new Map<string, KindSchema>();
  private references = new Map<string, KindReference>();
  private catalogZ: CatalogZ;
  private resolved = false;

  constructor() {
    this.catalogZ = createCatalogZ();
  }

  /**
   * Create a new catalog kind with CRD-style metadata.
   * Kind identification is separated from schema definition.
   */
  createKind(config: CreateKindConfig): KindReference {
    const kindName = config.names.kind;

    if (this.resolved) {
      throw new Error(
        `Cannot create kind "${kindName}" after resolution. All kinds must be registered before calling resolve().`,
      );
    }

    if (this.kinds.has(kindName)) {
      throw new Error(`Kind "${kindName}" is already registered.`);
    }

    this.kinds.set(kindName, {
      apiVersion: config.apiVersion,
      names: config.names,
      description: config.description,
      categories: config.categories,
    });

    const schemaDefinition = config.schema(this.catalogZ);

    const specFields = schemaDefinition.spec ?? {};
    const specSchema = z.object(specFields).passthrough();

    const baseMetadataFields = createBaseMetadataFields();

    let metadataSchema: ZodObject<any>;

    if (schemaDefinition.metadata) {
      const { annotations, labels, ...otherFields } = schemaDefinition.metadata;
      const metadataFields: Record<string, ZodTypeAny> = {
        ...baseMetadataFields,
        ...otherFields,
      };

      if (annotations) {
        metadataFields.annotations = z
          .object(annotations)
          .passthrough()
          .optional();
      }
      if (labels) {
        metadataFields.labels = z.object(labels).passthrough().optional();
      }

      metadataSchema = z.object(metadataFields);
    } else {
      metadataSchema = z.object(baseMetadataFields);
    }

    this.schemas.set(kindName, {
      spec: specSchema,
      metadata: metadataSchema,
    });

    return this.getKind(kindName);
  }

  /**
   * Get a lazy reference to an existing kind.
   * This allows extending or referencing fields from the kind.
   */
  getKind(kindName: string): KindReference {
    if (!this.references.has(kindName)) {
      this.references.set(kindName, new KindReference(kindName, this));
    }
    return this.references.get(kindName)!;
  }

  /**
   * Get a lazy reference to a field within a kind's schema.
   * @internal
   */
  getLazyField(
    kindName: string,
    section: 'spec' | 'metadata',
    fieldName: string,
  ) {
    return new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (!this.resolved) {
            throw new Error(
              'Cannot access field properties before resolution. Call resolve() first.',
            );
          }
          const schema = this.schemas.get(kindName);
          if (!schema) {
            throw new Error(`Kind "${kindName}" not found`);
          }
          const fieldSchema = (schema[section].shape as any)[fieldName];
          if (!fieldSchema) {
            throw new Error(
              `Field "${fieldName}" not found in ${kindName}.${section}`,
            );
          }
          return (fieldSchema as any)[prop];
        },
      },
    ) as ZodTypeAny;
  }

  /**
   * Resolve all extensions and merge schemas.
   * Must be called before accessing the final schemas.
   */
  resolve() {
    if (this.resolved) {
      return;
    }

    for (const [kindName, ref] of this.references) {
      const extensions = ref._getExtensions();
      const schema = this.schemas.get(kindName);

      if (!schema) {
        throw new Error(
          `Kind "${kindName}" was referenced via getKind() but never defined with createKind().`,
        );
      }

      if (extensions.spec.length > 0) {
        const newFields = extensions.spec.map(cb => cb(this.catalogZ));
        schema.spec = this.mergeObjectSchemas(schema.spec, ...newFields);
      }

      if (extensions.metadata.length > 0) {
        const newFields = extensions.metadata.map(cb => cb(this.catalogZ));
        schema.metadata = this.mergeObjectSchemas(
          schema.metadata,
          ...newFields,
        );
      }

      if (extensions.annotations.length > 0) {
        this.mergeSubfield(schema, 'annotations', extensions.annotations);
      }

      if (extensions.labels.length > 0) {
        this.mergeSubfield(schema, 'labels', extensions.labels);
      }
    }

    this.resolved = true;
  }

  /**
   * Get the list of all registered kind names.
   */
  getKindNames(): string[] {
    return Array.from(this.kinds.keys());
  }

  /**
   * Get the metadata for a registered kind.
   */
  getKindMetadata(kindName: string): KindMetadata | undefined {
    return this.kinds.get(kindName);
  }

  /**
   * Get the resolved spec schema for a kind.
   */
  getSpecSchema(kindName: string): ZodObject<any> | undefined {
    this.ensureResolved();
    return this.schemas.get(kindName)?.spec;
  }

  /**
   * Get the resolved metadata schema for a kind.
   */
  getMetadataSchema(kindName: string): ZodObject<any> | undefined {
    this.ensureResolved();
    return this.schemas.get(kindName)?.metadata;
  }

  /**
   * Extract relation metadata from all resolved schemas.
   * Returns a mapping of kind -> field path -> relation metadata.
   */
  getRelationGraph(): Record<string, Record<string, RelationMetadata>> {
    this.ensureResolved();

    const graph: Record<string, Record<string, RelationMetadata>> = {};

    for (const [kindName, schema] of this.schemas) {
      const kindRelations: Record<string, RelationMetadata> = {};

      this.extractRelationsFromSchema(schema.spec, 'spec', kindRelations);
      this.extractRelationsFromSchema(
        schema.metadata,
        'metadata',
        kindRelations,
      );

      if (Object.keys(kindRelations).length > 0) {
        graph[kindName] = kindRelations;
      }
    }

    return graph;
  }

  /**
   * Convert all schemas to JSON Schema using Zod 4's native support.
   */
  toJsonSchema(): Record<string, any> {
    this.ensureResolved();

    const result: Record<string, any> = {};

    for (const [kindName, schema] of this.schemas) {
      const metadata = this.kinds.get(kindName)!;

      const fullSchema = z.object({
        apiVersion: z.string(),
        kind: z.string(),
        metadata: schema.metadata,
        spec: schema.spec,
      });

      const jsonSchema = z.toJSONSchema(fullSchema);

      result[kindName] = {
        ...jsonSchema,
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: metadata.names.kind,
        description: metadata.description,
        properties: {
          ...(jsonSchema as any).properties,
          apiVersion: { type: 'string', const: metadata.apiVersion },
          kind: { type: 'string', const: metadata.names.kind },
        },
      };
    }

    return result;
  }

  private ensureResolved() {
    if (!this.resolved) {
      throw new Error(
        'Registry has not been resolved yet. Call resolve() first.',
      );
    }
  }

  private mergeSubfield(
    schema: KindSchema,
    field: 'annotations' | 'labels',
    callbacks: ExtensionCallback[],
  ) {
    const existing = (schema.metadata.shape as any)[field];
    const newFields = callbacks.map(cb => cb(this.catalogZ));

    let merged: ZodObject<any>;
    if (existing && existing._zod?.def?.type === 'object') {
      merged = this.mergeObjectSchemas(existing, ...newFields);
    } else if (
      existing &&
      existing._zod?.def?.type === 'optional' &&
      existing._zod?.def?.innerType?._zod?.def?.type === 'object'
    ) {
      const inner = existing._zod.def.innerType as ZodObject<any>;
      merged = this.mergeObjectSchemas(inner, ...newFields);
    } else {
      merged = this.mergeObjectSchemas(
        z.object({}).passthrough(),
        ...newFields,
      );
    }

    const newMetadataShape = { ...schema.metadata.shape };
    newMetadataShape[field] = merged.passthrough().optional();
    schema.metadata = z.object(newMetadataShape);
  }

  private mergeObjectSchemas(
    base: ZodObject<any>,
    ...extensions: Record<string, ZodTypeAny>[]
  ): ZodObject<any> {
    const merged: Record<string, ZodTypeAny> = { ...(base.shape as any) };

    for (const ext of extensions) {
      for (const [key, schema] of Object.entries(ext)) {
        if (merged[key]) {
          merged[key] = this.mergeFieldSchemas(merged[key], schema);
        } else {
          merged[key] = schema;
        }
      }
    }

    return z.object(merged);
  }

  private mergeFieldSchemas(a: ZodTypeAny, b: ZodTypeAny): ZodTypeAny {
    const aType = (a as any)._zod?.def?.type;
    const bType = (b as any)._zod?.def?.type;

    if (aType === 'enum' && bType === 'enum') {
      const aValues = (a as ZodEnum<any>).options;
      const bValues = (b as ZodEnum<any>).options;
      const mergedValues = Array.from(new Set([...aValues, ...bValues]));
      return z.enum(mergedValues as [string, ...string[]]);
    }

    return b;
  }

  private extractRelationsFromSchema(
    schema: ZodTypeAny,
    path: string,
    relations: Record<string, RelationMetadata>,
  ) {
    const metadata = (schema as any)[RELATION_METADATA] as
      | RelationMetadata
      | undefined;
    if (metadata) {
      relations[path] = metadata;
    }

    const def = (schema as any)._zod?.def;
    if (!def) return;

    if (def.type === 'object') {
      const shape = (schema as ZodObject<any>).shape;
      for (const [key, value] of Object.entries(shape)) {
        this.extractRelationsFromSchema(
          value as ZodTypeAny,
          `${path}.${key}`,
          relations,
        );
      }
    }

    if (def.type === 'array') {
      const elementType = (schema as ZodArray<any>)._zod.def.element;
      this.extractRelationsFromSchema(elementType, path, relations);
    }

    if (def.type === 'optional' || def.type === 'nullable') {
      const innerType = def.innerType;
      if (innerType) {
        this.extractRelationsFromSchema(innerType, path, relations);
      }
    }
  }
}
