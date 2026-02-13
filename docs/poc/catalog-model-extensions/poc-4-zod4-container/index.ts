/**
 * POC 4: Zod 4 with Extended Helpers and Lazy Resolution Container
 *
 * This demonstrates a hybrid approach:
 * - Scaffolder-style `(z) => ...` callback API for familiarity
 * - Extended `z` with catalog-specific helpers like z.entityRef() and z.lifecycle()
 * - Lazy resolution container for cross-kind references and order-independent declarations
 * - Zod 4's native JSON Schema support for serialization
 *
 * The extended `z` is a superset of standard Zod — everything you know about Zod still works,
 * but you get additional catalog domain helpers.
 */

import { z } from 'zod/v4';
import type {
  ZodTypeAny,
  ZodString,
  ZodObject,
  ZodArray,
  ZodEnum,
  ZodRawShape,
} from 'zod/v4';

// ============================================================================
// 1. Extended Zod (CatalogZ)
// ============================================================================

/**
 * Relation metadata attached to entity reference schemas.
 * This is used by the container to build the relation graph.
 */
interface RelationMetadata {
  forward: string;
  reverse: string;
  targetKinds?: string[];
}

/**
 * Symbol for storing relation metadata on Zod schemas.
 * We attach this to the schema instance without polluting the type.
 */
const RELATION_METADATA = Symbol('relationMetadata');

/**
 * A Zod string schema that can have relation metadata attached.
 */
interface EntityRefSchema extends ZodString {
  withRelations(opts: { forward: string; reverse: string }): this;
  [RELATION_METADATA]?: RelationMetadata;
}

/**
 * Extended Zod interface with catalog-specific helpers.
 * This is still Zod — all standard methods work — but with extra catalog helpers.
 */
interface CatalogZ {
  string: typeof z.string;
  number: typeof z.number;
  object: typeof z.object;
  array: typeof z.array;
  enum: typeof z.enum;
  record: typeof z.record;

  /**
   * Creates an entity reference schema with optional kind constraints.
   * Returns a string schema with entity ref regex validation.
   */
  entityRef(opts?: {
    kind?: string | string[];
    description?: string;
  }): EntityRefSchema;

  /**
   * Standard lifecycle enum for catalog entities.
   */
  lifecycle(): ZodEnum<{ production: 'production'; experimental: 'experimental'; deprecated: 'deprecated' }>;
}

/**
 * Entity reference regex pattern.
 * Format: [kind:][namespace/]name
 */
const ENTITY_REF_PATTERN = /^(?:[a-z][a-z0-9-]*:)?(?:[a-z][a-z0-9-]*\/)?[a-z][a-z0-9-]*$/i;

/**
 * Create the extended Zod instance.
 * This is a proxy that adds catalog helpers while preserving all standard Zod functionality.
 */
function createCatalogZ(): CatalogZ {
  const catalogZ: any = {
    string: z.string,
    number: z.number,
    object: z.object,
    array: z.array,
    enum: z.enum,
    record: z.record,
  };

  catalogZ.entityRef = function (opts?: {
    kind?: string | string[];
    description?: string;
  }): EntityRefSchema {
    let schema = z.string().regex(ENTITY_REF_PATTERN, 'Invalid entity reference format');

    if (opts?.description) {
      schema = schema.meta({ description: opts.description });
    }

    const targetKinds = opts?.kind
      ? Array.isArray(opts.kind)
        ? opts.kind
        : [opts.kind]
      : undefined;

    const withRelations = function (
      this: EntityRefSchema,
      relationOpts: { forward: string; reverse: string },
    ): EntityRefSchema {
      (this as any)[RELATION_METADATA] = {
        forward: relationOpts.forward,
        reverse: relationOpts.reverse,
        targetKinds,
      };
      return this;
    };

    (schema as any).withRelations = withRelations;
    return schema as EntityRefSchema;
  };

  catalogZ.lifecycle = function () {
    return z.enum(['production', 'experimental', 'deprecated']);
  };

  return catalogZ as CatalogZ;
}

// ============================================================================
// 2. Lazy Resolution Container
// ============================================================================

/**
 * CRD-style metadata for a catalog kind.
 */
interface KindMetadata {
  apiVersion: string;
  names: {
    kind: string;
    singular: string;
    plural: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
}

/**
 * Schema definition for a catalog kind.
 */
interface KindSchema<TSpec extends ZodRawShape = any, TMeta extends ZodRawShape = any> {
  metadata: ZodObject<TMeta>;
  spec: ZodObject<TSpec>;
}

/**
 * Extension callback type for adding fields to an object schema.
 */
type ExtensionCallback<T = any> = (z: CatalogZ) => T;

/**
 * Base entity envelope that all kinds inherit.
 * Includes standard entity fields that are common to all catalog entities.
 */
function createBaseEntityEnvelope() {
  return {
    apiVersion: z.string().meta({ description: 'API version' }),
    kind: z.string().meta({ description: 'Entity kind' }),
    metadata: z.object({
      name: z.string().meta({ description: 'Entity name' }),
      namespace: z.string().default('default').meta({ description: 'Entity namespace' }),
      title: z.string().optional().meta({ description: 'Display title' }),
      description: z.string().optional().meta({ description: 'Human-readable description' }),
      annotations: z.record(z.string(), z.string()).optional().meta({ description: 'Annotations', additionalProperties: true }),
      labels: z.record(z.string(), z.string()).optional().meta({ description: 'Labels', additionalProperties: true }),
      tags: z.array(z.string()).optional().meta({ description: 'Tags for classification' }),
      links: z.array(z.object({
        url: z.string().meta({ description: 'Link URL' }),
        title: z.string().optional().meta({ description: 'Link title' }),
        icon: z.string().optional().meta({ description: 'Link icon' }),
      })).optional().meta({ description: 'Entity links' }),
    }).meta({ description: 'Entity metadata' }),
    spec: z.object({}).passthrough().meta({ description: 'Entity specification', additionalProperties: true }),
  };
}

/**
 * Lazy reference to a kind's schema.
 * This allows you to reference and extend kinds before they're fully resolved.
 */
class KindReference<TSpec extends ZodRawShape = any, TMeta extends ZodRawShape = any> {
  private specExtensions: ExtensionCallback[] = [];
  private metadataExtensions: ExtensionCallback[] = [];
  private annotationExtensions: ExtensionCallback[] = [];
  private labelExtensions: ExtensionCallback[] = [];

  constructor(
    public readonly kindName: string,
    private registry: CatalogModelRegistry,
  ) {}

  /**
   * Provides lazy access to the spec schema.
   * You can reference fields or extend the spec.
   */
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
      ) as Record<keyof TSpec, ZodTypeAny>,
    };
  }

  /**
   * Provides lazy access to the metadata schema.
   */
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
      ) as Record<keyof TMeta, ZodTypeAny>,
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
 * The main registry for catalog model kinds.
 * Two-phase operation:
 * 1. Registration phase: collect kind definitions and extensions
 * 2. Resolution phase: merge extensions and validate the final schema
 */
class CatalogModelRegistry {
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
   * The kind identification is separated from the schema definition.
   */
  createKind<TSpec extends ZodRawShape>(
    config: {
      apiVersion: string;
      names: {
        kind: string;
        singular: string;
        plural: string;
        shortNames?: string[];
      };
      description?: string;
      categories?: string[];
      schema: (z: CatalogZ) => {
        spec?: Record<string, ZodTypeAny>;
        metadata?: {
          [key: string]: any;
          annotations?: Record<string, ZodTypeAny>;
          labels?: Record<string, ZodTypeAny>;
        };
      };
    },
  ): KindReference<TSpec> {
    const kindName = config.names.kind;

    this.kinds.set(kindName, {
      apiVersion: config.apiVersion,
      names: config.names,
      description: config.description,
      categories: config.categories,
    });

    const baseEnvelope = createBaseEntityEnvelope();
    const schemaDefinition = config.schema(this.catalogZ);

    const specFields = schemaDefinition.spec || {};
    const specSchema = z.object(specFields).passthrough();

    let metadataSchema: ZodObject<any>;
    const baseMetadataFields: Record<string, ZodTypeAny> = {
      name: baseEnvelope.metadata.shape.name,
      namespace: baseEnvelope.metadata.shape.namespace,
      title: baseEnvelope.metadata.shape.title,
      description: baseEnvelope.metadata.shape.description,
      annotations: baseEnvelope.metadata.shape.annotations,
      labels: baseEnvelope.metadata.shape.labels,
      tags: baseEnvelope.metadata.shape.tags,
      links: baseEnvelope.metadata.shape.links,
    };

    if (schemaDefinition.metadata) {
      const { annotations, labels, ...otherFields } = schemaDefinition.metadata as any;
      const metadataFields: Record<string, ZodTypeAny> = { ...baseMetadataFields, ...otherFields };

      if (annotations) {
        metadataFields.annotations = z.object(annotations).passthrough();
      }
      if (labels) {
        metadataFields.labels = z.object(labels).passthrough();
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
   * This allows you to extend or reference fields from the kind.
   */
  getKind<TSpec extends ZodRawShape = any, TMeta extends ZodRawShape = any>(
    kindName: string,
  ): KindReference<TSpec, TMeta> {
    if (!this.references.has(kindName)) {
      this.references.set(kindName, new KindReference(kindName, this));
    }
    return this.references.get(kindName)! as KindReference<TSpec, TMeta>;
  }

  /**
   * Get a lazy reference to a field within a kind's schema.
   * This is used internally by KindReference to enable field reuse.
   */
  getLazyField(kindName: string, section: 'spec' | 'metadata', fieldName: string) {
    return new Proxy(
      {},
      {
        get: (_target, prop) => {
          if (!this.resolved) {
            throw new Error(
              `Cannot access field properties before resolution. Call resolve() first.`,
            );
          }
          const schema = this.schemas.get(kindName);
          if (!schema) {
            throw new Error(`Kind ${kindName} not found`);
          }
          const fieldSchema = (schema[section].shape as any)[fieldName];
          if (!fieldSchema) {
            throw new Error(`Field ${fieldName} not found in ${kindName}.${section}`);
          }
          return (fieldSchema as any)[prop];
        },
      },
    ) as ZodTypeAny;
  }

  /**
   * Resolve all extensions and merge schemas.
   * This must be called before accessing the final schemas.
   */
  resolve() {
    for (const [kindName, ref] of this.references) {
      const extensions = ref._getExtensions();
      const schema = this.schemas.get(kindName);

      if (!schema) {
        throw new Error(`Kind ${kindName} referenced but not defined`);
      }

      if (extensions.spec.length > 0) {
        const newFields = extensions.spec.map(cb => cb(this.catalogZ));
        schema.spec = this.mergeObjectSchemas(schema.spec, ...newFields);
      }

      if (extensions.metadata.length > 0) {
        const newFields = extensions.metadata.map(cb => cb(this.catalogZ));
        schema.metadata = this.mergeObjectSchemas(schema.metadata, ...newFields);
      }

      if (extensions.annotations.length > 0) {
        const annotationsField = (schema.metadata.shape as any).annotations;
        const newAnnotations = extensions.annotations.map(cb => cb(this.catalogZ));

        if (annotationsField && annotationsField._def.type === 'object') {
          const mergedAnnotations = this.mergeObjectSchemas(annotationsField, ...newAnnotations);
          (schema.metadata.shape as any).annotations = mergedAnnotations;
        } else {
          const mergedAnnotations = this.mergeObjectSchemas(z.object({}), ...newAnnotations);
          (schema.metadata.shape as any).annotations = mergedAnnotations;
        }

        schema.metadata = z.object(schema.metadata.shape);
      }

      if (extensions.labels.length > 0) {
        const labelsField = (schema.metadata.shape as any).labels;
        const newLabels = extensions.labels.map(cb => cb(this.catalogZ));

        if (labelsField && labelsField._def.type === 'object') {
          const mergedLabels = this.mergeObjectSchemas(labelsField, ...newLabels);
          (schema.metadata.shape as any).labels = mergedLabels;
        } else {
          const mergedLabels = this.mergeObjectSchemas(z.object({}), ...newLabels);
          (schema.metadata.shape as any).labels = mergedLabels;
        }

        schema.metadata = z.object(schema.metadata.shape);
      }
    }

    this.resolved = true;
  }

  /**
   * Merge multiple object schemas together.
   * Handles special cases like enum merging.
   */
  private mergeObjectSchemas<T extends ZodRawShape>(
    base: ZodObject<T>,
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

  /**
   * Merge two field schemas.
   * Special handling for enums to create union types.
   */
  private mergeFieldSchemas(a: ZodTypeAny, b: ZodTypeAny): ZodTypeAny {
    if (a._def.type === 'enum' && b._def.type === 'enum') {
      const aValues = (a as ZodEnum<any>).options;
      const bValues = (b as ZodEnum<any>).options;
      const mergedValues = Array.from(new Set([...aValues, ...bValues]));
      return z.enum(mergedValues as any);
    }

    return b;
  }

  /**
   * Get the resolved schema for a kind.
   */
  getSchema(kindName: string): KindSchema | undefined {
    if (!this.resolved) {
      throw new Error('Cannot get schema before resolution. Call resolve() first.');
    }
    return this.schemas.get(kindName);
  }

  /**
   * Extract relation metadata from all resolved schemas.
   * Returns a mapping of kind -> field path -> relation metadata.
   */
  getRelationGraph(): Record<string, Record<string, RelationMetadata>> {
    if (!this.resolved) {
      throw new Error('Cannot get relation graph before resolution. Call resolve() first.');
    }

    const graph: Record<string, Record<string, RelationMetadata>> = {};

    for (const [kindName, schema] of this.schemas) {
      const kindRelations: Record<string, RelationMetadata> = {};

      this.extractRelationsFromSchema(schema.spec, 'spec', kindRelations);
      this.extractRelationsFromSchema(schema.metadata, 'metadata', kindRelations);

      if (Object.keys(kindRelations).length > 0) {
        graph[kindName] = kindRelations;
      }
    }

    return graph;
  }

  /**
   * Recursively extract relation metadata from a schema.
   */
  private extractRelationsFromSchema(
    schema: ZodTypeAny,
    path: string,
    relations: Record<string, RelationMetadata>,
  ) {
    const metadata = (schema as any)[RELATION_METADATA] as RelationMetadata | undefined;
    if (metadata) {
      relations[path] = metadata;
    }

    if (schema._def.type === 'object') {
      const shape = (schema as ZodObject<any>).shape;
      for (const [key, value] of Object.entries(shape)) {
        this.extractRelationsFromSchema(value as ZodTypeAny, `${path}.${key}`, relations);
      }
    }

    if (schema._def.type === 'array') {
      const elementType = (schema as ZodArray<any>)._def.element;
      this.extractRelationsFromSchema(elementType, path, relations);
    }

    if (schema._def.type === 'optional' || schema._def.type === 'nullable') {
      const innerType = (schema as any)._def.innerType;
      this.extractRelationsFromSchema(innerType, path, relations);
    }
  }

  /**
   * Convert all schemas to JSON Schema using Zod 4's native support.
   */
  toJsonSchema(): Record<string, any> {
    if (!this.resolved) {
      throw new Error('Cannot convert to JSON Schema before resolution. Call resolve() first.');
    }

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
          ...jsonSchema.properties,
          apiVersion: { type: 'string', const: metadata.apiVersion },
          kind: { type: 'string', const: metadata.names.kind },
        },
      };
    }

    return result;
  }

  /**
   * Generate MCP-style descriptions for LLM context.
   * Extracts kind metadata and field descriptions.
   */
  toMcpDescriptions(): Record<string, any> {
    if (!this.resolved) {
      throw new Error('Cannot generate MCP descriptions before resolution. Call resolve() first.');
    }

    const result: Record<string, any> = {};

    for (const [kindName, schema] of this.schemas) {
      const metadata = this.kinds.get(kindName)!;

      const annotationsField = (schema.metadata.shape as any).annotations;
      const labelsField = (schema.metadata.shape as any).labels;

      result[kindName] = {
        kind: metadata.names.kind,
        singular: metadata.names.singular,
        plural: metadata.names.plural,
        shortNames: metadata.names.shortNames,
        description: metadata.description,
        categories: metadata.categories,
        fields: {
          spec: this.extractFieldDescriptions(schema.spec),
          metadata: this.extractFieldDescriptions(schema.metadata),
        },
      };

      if (annotationsField && annotationsField._def.type === 'object') {
        result[kindName].fields['metadata.annotations'] = this.extractFieldDescriptions(annotationsField);
      }

      if (labelsField && labelsField._def.type === 'object') {
        result[kindName].fields['metadata.labels'] = this.extractFieldDescriptions(labelsField);
      }
    }

    return result;
  }

  /**
   * Extract field descriptions from a Zod schema.
   */
  private extractFieldDescriptions(schema: ZodObject<any>): Record<string, string> {
    const descriptions: Record<string, string> = {};

    for (const [key, value] of Object.entries(schema.shape)) {
      const fieldSchema = value as ZodTypeAny;
      const description = fieldSchema.description;
      if (description) {
        descriptions[key] = description;
      }
    }

    return descriptions;
  }
}

// ============================================================================
// 3. Relation Declarations via .withRelations()
// ============================================================================

/**
 * Example showing how .withRelations() works in practice.
 * Relations are chained directly on entity reference fields.
 */
export function exampleRelationDeclarations() {
  const model = new CatalogModelRegistry();

  const component = model.getKind('Component');

  component.spec.extend(z => ({
    owner: z
      .entityRef({ kind: ['Group', 'User'] })
      .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
      .meta({ title: 'Owner', description: 'The owning entity' }),

    providesApis: z
      .array(
        z
          .entityRef({ kind: 'API' })
          .withRelations({ forward: 'providesApi', reverse: 'apiProvidedBy' }),
      )
      .optional()
      .meta({ title: 'Provides APIs', description: 'APIs this component provides' }),

    system: z
      .entityRef({ kind: 'System' })
      .withRelations({ forward: 'partOf', reverse: 'hasPart' })
      .optional()
      .meta({ title: 'System', description: 'The system this belongs to' }),
  }));

  model.resolve();
  const relations = model.getRelationGraph();

  // Returns:
  // {
  //   Component: {
  //     'spec.owner': { forward: 'ownedBy', reverse: 'ownerOf', targetKinds: ['Group', 'User'] },
  //     'spec.providesApis': { forward: 'providesApi', reverse: 'apiProvidedBy', targetKinds: ['API'] },
  //     'spec.system': { forward: 'partOf', reverse: 'hasPart', targetKinds: ['System'] }
  //   }
  // }

  return relations;
}

// ============================================================================
// 4. CRD-style Kind Metadata
// ============================================================================

/**
 * Example showing full CRD metadata on a new kind.
 */
export function exampleCrdMetadata() {
  const model = new CatalogModelRegistry();

  model.createKind({
    apiVersion: 'my-org.io/v1alpha1',
    names: {
      kind: 'Pipeline',
      singular: 'pipeline',
      plural: 'pipelines',
      shortNames: ['pl'],
    },
    description: 'A CI/CD pipeline definition',
    categories: ['ci', 'infrastructure'],
    schema: (z) => ({
      spec: {
        engine: z.enum(['github-actions', 'tekton', 'jenkins']).meta({ title: 'Engine', description: 'CI engine' }),
        triggers: z.array(z.string()).meta({ title: 'Triggers', description: 'Events that trigger runs' }),
      },
      metadata: {
        annotations: {
          'pipeline.io/last-run': z.string().meta({ description: 'ISO timestamp of last run' }),
        },
        labels: {
          'pipeline.io/engine': z.string().meta({ description: 'CI engine type' }),
        },
      },
    }),
  });
}

// ============================================================================
// 5. Example: Define Built-in Component Kind
// ============================================================================

const model = new CatalogModelRegistry();

export const Component = model.createKind({
  apiVersion: 'backstage.io/v1alpha1',
  names: {
    kind: 'Component',
    singular: 'component',
    plural: 'components',
    shortNames: ['comp'],
  },
  description: 'A software component',
  categories: ['core', 'software'],
  schema: (z) => ({
    spec: {
      type: z.string().meta({ title: 'Type', description: 'Component type' }),

      lifecycle: z.lifecycle().meta({ title: 'Lifecycle', description: 'Current lifecycle stage' }),

      owner: z
        .entityRef({ kind: ['Group', 'User'] })
        .withRelations({ forward: 'ownedBy', reverse: 'ownerOf' })
        .meta({ title: 'Owner', description: 'The owning entity' }),

      system: z
        .entityRef({ kind: 'System' })
        .withRelations({ forward: 'partOf', reverse: 'hasPart' })
        .optional()
        .meta({ title: 'System', description: 'The system this belongs to' }),

      subcomponentOf: z
        .entityRef({ kind: 'Component' })
        .withRelations({ forward: 'subcomponentOf', reverse: 'hasSubcomponent' })
        .optional()
        .meta({ title: 'Subcomponent Of', description: 'Parent component if this is a subcomponent' }),

      providesApis: z
        .array(
          z
            .entityRef({ kind: 'API' })
            .withRelations({ forward: 'providesApi', reverse: 'apiProvidedBy' }),
        )
        .optional()
        .meta({ title: 'Provides APIs', description: 'APIs this component provides' }),

      consumesApis: z
        .array(
          z
            .entityRef({ kind: 'API' })
            .withRelations({ forward: 'consumesApi', reverse: 'apiConsumedBy' }),
        )
        .optional()
        .meta({ title: 'Consumes APIs', description: 'APIs this component consumes' }),

      dependsOn: z
        .array(
          z
            .entityRef({ kind: ['Component', 'Resource'] })
            .withRelations({ forward: 'dependsOn', reverse: 'dependencyOf' }),
        )
        .optional()
        .meta({ title: 'Depends On', description: 'Other entities this component depends on' }),
    },
  }),
});

// ============================================================================
// 6. Example: Plugin Extending Component
// ============================================================================

const component = model.getKind('Component');

component.spec.extend(z => ({
  type: z
    .enum(['service', 'website', 'library'])
    .meta({ title: 'Type', description: 'Component type' }),

  subtype: z
    .string()
    .optional()
    .meta({ title: 'Subtype', description: 'Further sub-classification' }),
}));

component.metadata.annotations.extend(z => ({
  'my-plugin.io/team-id': z.string().meta({ description: 'The owning team identifier' }),
  'my-plugin.io/oncall-url': z.string().url().optional().meta({ description: 'Oncall schedule URL' }),
}));

component.metadata.labels.extend(z => ({
  'my-plugin.io/tier': z.string().meta({ description: 'Service tier classification' }),
}));

// ============================================================================
// 7. Example: Plugin Creating New "Pipeline" Kind
// ============================================================================

export const Pipeline = model.createKind({
  apiVersion: 'my-org.io/v1alpha1',
  names: {
    kind: 'Pipeline',
    singular: 'pipeline',
    plural: 'pipelines',
    shortNames: ['pl'],
  },
  description: 'A CI/CD pipeline definition',
  categories: ['ci', 'infrastructure'],
  schema: (z) => ({
    spec: {
      owner: component.spec.fields.owner,

      engine: z
        .enum(['github-actions', 'tekton', 'jenkins'])
        .meta({ title: 'Engine', description: 'CI engine' }),

      triggers: z
        .array(z.string())
        .meta({ title: 'Triggers', description: 'Events that trigger runs' }),

      component: z
        .entityRef({ kind: 'Component' })
        .withRelations({ forward: 'pipelineFor', reverse: 'hasPipeline' })
        .optional()
        .meta({ title: 'Component', description: 'Component this pipeline builds' }),
    },
    metadata: {
      annotations: {
        'pipeline.io/last-run': z.string().meta({ description: 'ISO timestamp of last run' }),
      },
      labels: {
        'pipeline.io/engine': z.string().meta({ description: 'CI engine type' }),
      },
    },
  }),
});

// ============================================================================
// 8. Schema Merging
// ============================================================================

/**
 * When multiple plugins extend the same field with enums, they get merged.
 */

component.spec.extend(z => ({
  type: z.enum(['service', 'website']).meta({ title: 'Type', description: 'Component type' }),
}));

component.spec.extend(z => ({
  type: z.enum(['library', 'documentation']).meta({ title: 'Type', description: 'Component type' }),
}));

// After resolution, the merged enum contains all values:
// z.enum(['service', 'website', 'library', 'documentation'])

// ============================================================================
// 9. Serialization
// ============================================================================

model.resolve();

export const jsonSchemas = model.toJsonSchema();

// Example output for Component:
// {
//   Component: {
//     $schema: 'http://json-schema.org/draft-07/schema#',
//     title: 'Component',
//     description: 'A software component',
//     type: 'object',
//     properties: {
//       apiVersion: { type: 'string', const: 'backstage.io/v1alpha1' },
//       kind: { type: 'string', const: 'Component' },
//       metadata: { ... },
//       spec: { ... }
//     },
//     required: ['apiVersion', 'kind', 'metadata', 'spec'],
//     additionalProperties: true
//   }
// }

export const mcpDescriptions = model.toMcpDescriptions();

// Example output for Component:
// {
//   Component: {
//     kind: 'Component',
//     singular: 'component',
//     plural: 'components',
//     shortNames: ['comp'],
//     description: 'A software component',
//     categories: ['core', 'software'],
//     fields: {
//       spec: {
//         type: 'Component type',
//         lifecycle: 'Current lifecycle stage',
//         owner: 'The owning entity',
//         ...
//       },
//       metadata: { ... },
//       'metadata.annotations': {
//         'my-plugin.io/team-id': 'The owning team identifier',
//         'my-plugin.io/oncall-url': 'Oncall schedule URL',
//       },
//       'metadata.labels': {
//         'my-plugin.io/tier': 'Service tier classification',
//       },
//     }
//   }
// }

// ============================================================================
// 10. Extracting Relations from Resolved Schema
// ============================================================================

/**
 * After resolution, get the complete relation graph.
 * This can replace BuiltinKindsEntityProcessor by providing
 * a generic relation processor that uses this metadata.
 */
export const relationGraph = model.getRelationGraph();

// Example output:
// {
//   Component: {
//     'spec.owner': {
//       forward: 'ownedBy',
//       reverse: 'ownerOf',
//       targetKinds: ['Group', 'User']
//     },
//     'spec.system': {
//       forward: 'partOf',
//       reverse: 'hasPart',
//       targetKinds: ['System']
//     },
//     'spec.providesApis': {
//       forward: 'providesApi',
//       reverse: 'apiProvidedBy',
//       targetKinds: ['API']
//     },
//     ...
//   },
//   Pipeline: {
//     'spec.owner': {
//       forward: 'ownedBy',
//       reverse: 'ownerOf',
//       targetKinds: ['Group', 'User']
//     },
//     'spec.component': {
//       forward: 'pipelineFor',
//       reverse: 'hasPipeline',
//       targetKinds: ['Component']
//     }
//   }
// }

/**
 * Generic relation processor using the relation graph.
 * This replaces hardcoded relation logic in BuiltinKindsEntityProcessor.
 */
export function createRelationProcessor(relationGraph: Record<string, Record<string, RelationMetadata>>) {
  return {
    async processEntity(entity: any) {
      const relations: any[] = [];
      const kindRelations = relationGraph[entity.kind];

      if (!kindRelations) {
        return relations;
      }

      for (const [fieldPath, metadata] of Object.entries(kindRelations)) {
        const value = getNestedValue(entity, fieldPath);

        if (!value) {
          continue;
        }

        if (Array.isArray(value)) {
          for (const ref of value) {
            relations.push({
              type: metadata.forward,
              targetRef: ref,
            });
          }
        } else {
          relations.push({
            type: metadata.forward,
            targetRef: value,
          });
        }
      }

      return relations;
    },
  };
}

/**
 * Helper to get nested values from objects.
 */
function getNestedValue(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

// ============================================================================
// Summary
// ============================================================================

/**
 * This POC demonstrates:
 *
 * 1. Extended Zod (CatalogZ) — familiar Zod API + catalog helpers
 *    - z.entityRef() for entity references with validation
 *    - z.lifecycle() for standard lifecycle enum
 *    - .withRelations() for declarative relation metadata
 *
 * 2. Base Entity Envelope — standard fields for all entities
 *    - apiVersion, kind (automatically set)
 *    - metadata.name, metadata.namespace (required/defaulted)
 *    - metadata.title, metadata.description (optional)
 *    - metadata.annotations, metadata.labels (optional records)
 *    - metadata.tags (optional array)
 *    - metadata.links (optional array)
 *    - spec (base object with additionalProperties: true)
 *    - All kinds automatically inherit these fields
 *
 * 3. Lazy Resolution Container — order-independent declarations
 *    - createKind() with separated identification and schema
 *    - Kind identification: apiVersion, names, description, categories
 *    - Schema definition: schema callback returns spec and metadata extensions
 *    - getKind() to get lazy references
 *    - .extend() to add fields to existing kinds
 *    - .fields to reuse schemas across kinds
 *    - resolve() to merge everything together
 *
 * 4. Relation Declarations — colocated with the field they describe
 *    - .withRelations({ forward, reverse }) on entity refs
 *    - Metadata extracted during resolution
 *    - Powers generic relation processor
 *
 * 5. CRD-style Metadata — comprehensive kind information
 *    - apiVersion, names, description, categories
 *    - Supports kubectl-style CLI tooling
 *    - Proper metadata.annotations and metadata.labels structure
 *
 * 6. Native Serialization — leveraging Zod 4
 *    - toJsonSchema() using z.toJSONSchema()
 *    - toMcpDescriptions() for LLM context
 *    - Automatic schema validation
 *
 * Benefits:
 * - Familiar API for developers who know Zod or scaffolder
 * - Base envelope ensures all entities have standard fields
 * - Clear separation between kind identification and schema definition
 * - Type-safe field reuse across kinds
 * - Declarative relation metadata
 * - Generic relation processing
 * - Order-independent plugin extensions
 * - Rich CRD-style metadata for tooling
 * - Correct Backstage entity structure with metadata.annotations and metadata.labels
 */

// =============================================================================
// Example: Internal Company-Wide Extension
// =============================================================================

/**
 * This would live in a package like @internal/catalog-model-company-extensions.
 * Installed once in the backend, provides shared schema extensions for all internal plugins.
 */
export function registerCompanyExtensions(model: CatalogModelRegistry) {
  const component = model.getKind('Component');

  // Company-wide spec fields that all components should have
  component.spec.extend((z) => ({
    costCenter: z.string()
      .meta({ title: 'Cost Center', description: 'Finance cost center code for billing attribution' }),
    tier: z.enum({ critical: 'critical', standard: 'standard', internal: 'internal' })
      .meta({ title: 'Service Tier', description: 'SLA tier for incident response' }),
    team: z.entityRef({ kind: 'Group' })
      .withRelations({ forward: 'maintainedBy', reverse: 'maintains' })
      .meta({ title: 'Maintaining Team', description: 'Team responsible for day-to-day maintenance' }),
  }));

  // Company-standard annotations
  component.metadata.annotations.extend((z) => ({
    'company.com/slack-channel': z.string()
      .meta({ description: 'Slack channel for the team owning this component' }),
    'company.com/runbook-url': z.string()
      .meta({ description: 'Link to the operational runbook' }),
    'company.com/datadog-dashboard': z.string()
      .meta({ description: 'Datadog dashboard URL for monitoring' }),
  }));

  // Company-standard labels for filtering
  component.metadata.labels.extend((z) => ({
    'company.com/business-unit': z.string()
      .meta({ description: 'Business unit that owns this component' }),
    'company.com/compliance-scope': z.string()
      .meta({ description: 'Compliance framework (SOC2, HIPAA, PCI, etc.)' }),
  }));

  // Also extend API kind with company-specific fields
  const api = model.getKind('API');
  api.spec.extend((z) => ({
    stability: z.enum({ stable: 'stable', beta: 'beta', alpha: 'alpha', deprecated: 'deprecated' })
      .meta({ title: 'API Stability', description: 'Stability level for consumer expectations' }),
    sla: z.string().optional()
      .meta({ description: 'SLA commitment (e.g., 99.9% uptime)' }),
  }));
}

// Usage in backend:
// import { registerCompanyExtensions } from '@internal/catalog-model-company-extensions';
// registerCompanyExtensions(model);

// =============================================================================
// Example: Third-Party Plugin Extension (e.g., Kubernetes plugin)
// =============================================================================

/**
 * This would live in @backstage/plugin-catalog-backend-module-kubernetes.
 * When installed, it registers kubernetes-specific annotations with validation.
 */
export function registerKubernetesAnnotations(model: CatalogModelRegistry) {
  const component = model.getKind('Component');

  component.metadata.annotations.extend((z) => ({
    'backstage.io/kubernetes-id': z.string()
      .meta({
        title: 'Kubernetes ID',
        description: 'Identifier used to find Kubernetes resources for this component. Matches the app.kubernetes.io/name label by default.'
      }),
    'backstage.io/kubernetes-namespace': z.string().optional()
      .meta({ description: 'Kubernetes namespace override. If not set, all namespaces are searched.' }),
    'backstage.io/kubernetes-label-selector': z.string().optional()
      .meta({ description: 'Custom label selector query for finding pods (e.g., app=my-service,env=prod)' }),
    'backstage.io/kubernetes-cluster': z.string().optional()
      .meta({ description: 'Target cluster name. If not set, all configured clusters are searched.' }),
  }));

  component.metadata.labels.extend((z) => ({
    'backstage.io/kubernetes-managed': z.string()
      .meta({ description: 'Whether this component has Kubernetes resources (true/false)' }),
  }));
}

/**
 * Another third-party plugin example: PagerDuty
 */
export function registerPagerDutyAnnotations(model: CatalogModelRegistry) {
  const component = model.getKind('Component');

  component.metadata.annotations.extend((z) => ({
    'pagerduty.com/service-id': z.string()
      .meta({
        title: 'PagerDuty Service ID',
        description: 'The PagerDuty service ID for incident management. Found in PagerDuty service settings.',
      }),
    'pagerduty.com/integration-key': z.string().optional()
      .meta({ description: 'PagerDuty integration key for event routing' }),
  }));
}

// =============================================================================
// Example: Config-Driven Custom Kind (via app-config.yaml)
// =============================================================================

/**
 * Kinds and extensions can be defined in config for teams that want to extend
 * the catalog without writing a backend module.
 *
 * Example app-config.yaml:
 *
 * catalog:
 *   customKinds:
 *     - apiVersion: 'my-org.io/v1alpha1'
 *       names:
 *         kind: Database
 *         singular: database
 *         plural: databases
 *         shortNames: ['db']
 *       description: 'A managed database instance'
 *       categories: ['infrastructure']
 *       schema:
 *         spec:
 *           engine:
 *             type: enum
 *             values: ['postgres', 'mysql', 'mongodb', 'redis']
 *             description: 'Database engine type'
 *           version:
 *             type: string
 *             description: 'Engine version'
 *           owner:
 *             type: entityRef
 *             kind: ['Group', 'User']
 *             description: 'Team responsible for this database'
 *             relations:
 *               forward: ownedBy
 *               reverse: ownerOf
 *           maxConnections:
 *             type: string
 *             optional: true
 *             description: 'Maximum connection pool size'
 *
 *   customExtensions:
 *     - kind: Component
 *       schema:
 *         spec:
 *           oncallRotation:
 *             type: string
 *             optional: true
 *             description: 'On-call rotation name in PagerDuty'
 *         metadata:
 *           annotations:
 *             'my-org.io/deploy-group':
 *               type: string
 *               description: 'Deployment group for staged rollouts'
 */

export interface ConfigFieldDef {
  type: 'string' | 'enum' | 'boolean' | 'entityRef' | 'array';
  description?: string;
  optional?: boolean;
  values?: string[];         // for enum
  kind?: string | string[];  // for entityRef
  relations?: { forward: string; reverse: string };
  items?: ConfigFieldDef;    // for array
}

export interface ConfigKindDef {
  apiVersion: string;
  names: { kind: string; singular: string; plural: string; shortNames?: string[] };
  description?: string;
  categories?: string[];
  schema: {
    spec: Record<string, ConfigFieldDef>;
    metadata?: {
      annotations?: Record<string, ConfigFieldDef>;
      labels?: Record<string, ConfigFieldDef>;
    };
  };
}

/**
 * Converts a config field definition to a CatalogZ schema.
 */
export function configFieldToZodSchema(z: CatalogZ, field: ConfigFieldDef): any {
  let schema: any;

  switch (field.type) {
    case 'string':
      schema = z.string();
      break;
    case 'boolean':
      schema = z.string();
      break;
    case 'enum':
      // Convert string array to enum object for Zod 4
      schema = z.enum(
        Object.fromEntries((field.values ?? []).map(v => [v, v])) as any
      );
      break;
    case 'entityRef':
      schema = z.entityRef({ kind: field.kind });
      if (field.relations) {
        schema = schema.withRelations(field.relations);
      }
      break;
    case 'array':
      schema = z.array(field.items ? configFieldToZodSchema(z, field.items) : z.string());
      break;
  }

  if (field.description) {
    schema = schema.meta({ description: field.description });
  }
  if (field.optional) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Registers custom kinds from config.
 */
export function registerConfigDrivenKinds(
  model: CatalogModelRegistry,
  customKinds: ConfigKindDef[],
) {
  for (const kindConfig of customKinds) {
    model.createKind({
      apiVersion: kindConfig.apiVersion,
      names: kindConfig.names,
      description: kindConfig.description,
      categories: kindConfig.categories,
      schema: (z) => {
        const spec: Record<string, any> = {};
        for (const [fieldName, fieldDef] of Object.entries(kindConfig.schema.spec)) {
          spec[fieldName] = configFieldToZodSchema(z, fieldDef);
        }

        const annotations: Record<string, any> = {};
        if (kindConfig.schema.metadata?.annotations) {
          for (const [key, fieldDef] of Object.entries(kindConfig.schema.metadata.annotations)) {
            annotations[key] = configFieldToZodSchema(z, fieldDef);
          }
        }

        const labels: Record<string, any> = {};
        if (kindConfig.schema.metadata?.labels) {
          for (const [key, fieldDef] of Object.entries(kindConfig.schema.metadata.labels)) {
            labels[key] = configFieldToZodSchema(z, fieldDef);
          }
        }

        return {
          spec,
          metadata: {
            ...(Object.keys(annotations).length > 0 ? { annotations } : {}),
            ...(Object.keys(labels).length > 0 ? { labels } : {}),
          },
        };
      },
    });
  }
}

// Example usage:
// const customKinds = config.getOptionalConfigArray('catalog.customKinds');
// registerConfigDrivenKinds(model, customKinds);
