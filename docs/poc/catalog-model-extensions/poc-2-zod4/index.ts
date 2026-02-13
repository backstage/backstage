/**
 * Backstage Catalog Model Extensions POC - Zod 4
 *
 * This POC demonstrates extending the Backstage catalog model using Zod 4's
 * native JSON Schema support. Key advantages over Zod 3:
 * - Native z.toJsonSchema() built into Zod 4
 * - Better OpenAPI compatibility
 * - More accurate JSON Schema generation
 * - No external zod-to-json-schema dependency
 */

import { z } from 'zod/v4';

// ============================================================================
// 1. Core Types and Registry API
// ============================================================================

/**
 * Default entity envelope that all kinds inherit.
 * Provides common fields that every Backstage entity has.
 */
function createBaseEntityEnvelope(z: typeof import('zod/v4').z) {
  return z.object({
    apiVersion: z.string().meta({ description: 'API version of the entity' }),
    kind: z.string().meta({ description: 'Kind of the entity' }),
    metadata: z.object({
      name: z.string().meta({ description: 'Name of the entity' }),
      namespace: z.string().optional().default('default').meta({ description: 'Namespace of the entity' }),
      title: z.string().optional().meta({ description: 'Human-readable title' }),
      description: z.string().optional().meta({ description: 'Description of the entity' }),
      annotations: z.record(z.string(), z.string()).optional().meta({ description: 'Annotations for metadata' }),
      labels: z.record(z.string(), z.string()).optional().meta({ description: 'Labels for classification' }),
      tags: z.array(z.string()).optional().meta({ description: 'Tags for categorization' }),
      links: z.array(
        z.object({
          url: z.string(),
          title: z.string().optional(),
          icon: z.string().optional(),
        })
      ).optional().meta({ description: 'External links related to the entity' }),
    }),
    spec: z.object({}).passthrough().meta({ description: 'Specification of the entity' }),
  });
}

/**
 * Helper to create entity reference schemas with optional kind filtering.
 * Uses Zod 4's .meta() for rich metadata.
 */
function entityRef(
  z: typeof import('zod/v4').z,
  opts?: { kind?: string | string[] },
): z.ZodString {
  const kinds = opts?.kind
    ? Array.isArray(opts.kind)
      ? opts.kind
      : [opts.kind]
    : undefined;

  const pattern = /^[a-z0-9-]+:[a-z0-9-]+\/[a-z0-9.-]+$/;
  const description = kinds
    ? `Entity reference matching pattern kind:namespace/name. Allowed kinds: ${kinds.join(
        ', ',
      )}`
    : 'Entity reference matching pattern kind:namespace/name';

  return z.string().regex(pattern).meta({ description });
}

/**
 * Pre-built lifecycle enum for common entity lifecycle stages.
 */
function lifecycle(z: typeof import('zod/v4').z) {
  return z
    .enum(['experimental', 'production', 'deprecated'])
    .meta({ description: 'Lifecycle stage of the entity' });
}

/**
 * Schema builder callback pattern matching scaffolder actions.
 */
type SchemaBuilder<T = any> = (z: typeof import('zod/v4').z) => T;

/**
 * Relation mapping between spec fields and relation types.
 */
interface RelationMapping {
  [fieldPath: string]: {
    forward: string;
    reverse: string;
  };
}

/**
 * Extension definition for adding fields to existing kinds.
 */
interface KindExtension {
  spec?: SchemaBuilder<Record<string, z.ZodTypeAny>>;
  metadata?: {
    annotations?: SchemaBuilder<Record<string, z.ZodTypeAny>>;
    labels?: SchemaBuilder<Record<string, z.ZodTypeAny>>;
  };
  relations?: RelationMapping;
}

/**
 * Full kind definition for creating new catalog kinds.
 * Separates kind identification from schema definition.
 */
interface KindDefinition {
  apiVersion: string;
  names: {
    kind: string;
    singular: string;
    plural: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
  schema: {
    spec: SchemaBuilder<Record<string, z.ZodTypeAny>>;
    metadata?: {
      annotations?: SchemaBuilder<Record<string, z.ZodTypeAny>>;
      labels?: SchemaBuilder<Record<string, z.ZodTypeAny>>;
    };
  };
  relations?: RelationMapping;
}

/**
 * Registry for managing catalog model extensions.
 * Central API for registering kinds and extensions.
 */
class CatalogModelRegistry {
  private kinds = new Map<
    string,
    {
      apiVersion: string;
      names: {
        kind: string;
        singular: string;
        plural: string;
        shortNames?: string[];
      };
      description?: string;
      categories?: string[];
      specFields: Record<string, z.ZodTypeAny>;
      metadataFields: {
        annotations: Record<string, z.ZodTypeAny>;
        labels: Record<string, z.ZodTypeAny>;
      };
      relations: RelationMapping;
    }
  >();

  /**
   * Register a new catalog kind with full CRD-style metadata.
   * Kind identification is separated from schema definition.
   */
  registerKind(definition: KindDefinition): void {
    const { apiVersion, names, description, categories, schema, relations } = definition;
    const kind = names.kind;

    if (this.kinds.has(kind)) {
      throw new Error(`Kind ${kind} already registered`);
    }

    this.kinds.set(kind, {
      apiVersion,
      names,
      description,
      categories,
      specFields: schema.spec(z),
      metadataFields: {
        annotations: schema.metadata?.annotations?.(z) ?? {},
        labels: schema.metadata?.labels?.(z) ?? {},
      },
      relations: relations ?? {},
    });
  }

  /**
   * Extend an existing kind with additional fields and relations.
   * Supports schema merging for enum unions.
   */
  registerKindExtension(kind: string, extension: KindExtension): void {
    const existing = this.kinds.get(kind);
    if (!existing) {
      throw new Error(`Cannot extend unknown kind: ${kind}`);
    }

    if (extension.spec) {
      const newFields = extension.spec(z);
      for (const [key, schema] of Object.entries(newFields)) {
        if (existing.specFields[key]) {
          existing.specFields[key] = this.mergeSchemas(
            existing.specFields[key],
            schema,
          );
        } else {
          existing.specFields[key] = schema;
        }
      }
    }

    if (extension.metadata?.annotations) {
      const newFields = extension.metadata.annotations(z);
      Object.assign(existing.metadataFields.annotations, newFields);
    }

    if (extension.metadata?.labels) {
      const newFields = extension.metadata.labels(z);
      Object.assign(existing.metadataFields.labels, newFields);
    }

    if (extension.relations) {
      Object.assign(existing.relations, extension.relations);
    }
  }

  /**
   * Merge two schemas, handling enum union cases.
   * Zod 4 makes this cleaner with better schema introspection.
   */
  private mergeSchemas(a: z.ZodTypeAny, b: z.ZodTypeAny): z.ZodTypeAny {
    // Handle enum merging for spec.type extension pattern
    if (a instanceof z.ZodEnum && b instanceof z.ZodEnum) {
      const aValues = a.options as string[];
      const bValues = b.options as string[];
      const merged = Array.from(new Set([...aValues, ...bValues]));
      return z.enum(merged as [string, ...string[]]);
    }

    // Default to last-wins for other cases
    return b;
  }

  /**
   * Generate JSON Schema for all registered kinds.
   * Uses Zod 4's native z.toJsonSchema() instead of external library.
   * Builds on the base entity envelope and merges in kind-specific fields.
   */
  toJsonSchema(): Record<string, any> {
    const schemas: Record<string, any> = {};

    for (const [kindName, kind] of this.kinds.entries()) {
      const baseEnvelope = createBaseEntityEnvelope(z);

      const metadataExtensions: Record<string, z.ZodTypeAny> = {};

      if (Object.keys(kind.metadataFields.labels).length > 0) {
        metadataExtensions.labels = z
          .object(kind.metadataFields.labels)
          .passthrough()
          .optional();
      }

      if (Object.keys(kind.metadataFields.annotations).length > 0) {
        metadataExtensions.annotations = z
          .object(kind.metadataFields.annotations)
          .passthrough()
          .optional();
      }

      const entitySchema = baseEnvelope.extend({
        kind: z.literal(kindName).meta({ description: 'Kind of the entity' }),
        metadata: baseEnvelope.shape.metadata.extend(metadataExtensions),
        spec: z.object(kind.specFields).passthrough().meta({ description: 'Specification of the entity' }),
        relations: z
          .array(
            z.object({
              type: z.string(),
              targetRef: z.string(),
              target: z.object({
                kind: z.string(),
                namespace: z.string(),
                name: z.string(),
              }),
            }),
          )
          .optional()
          .meta({ description: 'Relations to other entities' }),
      });

      schemas[kindName] = z.toJSONSchema(entitySchema, {
        reused: 'inline',
        target: 'openapi-3.0',
      });
    }

    return schemas;
  }

  /**
   * Generate TypeScript type definitions for all kinds.
   * Useful for codegen workflows.
   */
  toTypeScript(): string {
    const lines: string[] = [];

    for (const [kindName, kind] of this.kinds.entries()) {
      lines.push(`/**`);
      if (kind.description) {
        lines.push(` * ${kind.description}`);
      }
      if (kind.categories) {
        lines.push(` * Categories: ${kind.categories.join(', ')}`);
      }
      lines.push(` */`);

      const baseEnvelope = createBaseEntityEnvelope(z);

      const metadataExtensions: Record<string, z.ZodTypeAny> = {};

      if (Object.keys(kind.metadataFields.labels).length > 0) {
        metadataExtensions.labels = z
          .object(kind.metadataFields.labels)
          .passthrough()
          .optional();
      }

      if (Object.keys(kind.metadataFields.annotations).length > 0) {
        metadataExtensions.annotations = z
          .object(kind.metadataFields.annotations)
          .passthrough()
          .optional();
      }

      const entitySchema = baseEnvelope.extend({
        kind: z.literal(kindName),
        metadata: baseEnvelope.shape.metadata.extend(metadataExtensions),
        spec: z.object(kind.specFields).passthrough(),
        relations: z
          .array(
            z.object({
              type: z.string(),
              targetRef: z.string(),
              target: z.object({
                kind: z.string(),
                namespace: z.string(),
                name: z.string(),
              }),
            }),
          )
          .optional(),
      });

      lines.push(
        `export type ${kindName}Entity = ${this.schemaToTypeString(
          entitySchema,
        )};`,
      );
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Convert Zod schema to TypeScript type string.
   * Simplified for POC purposes.
   */
  private schemaToTypeString(schema: z.ZodTypeAny): string {
    // In real implementation, use z.infer<typeof schema> with proper codegen
    return `z.infer<typeof ${schema.constructor.name}>`;
  }

  /**
   * Get all relation mappings for a kind.
   */
  getRelations(kind: string): RelationMapping {
    return this.kinds.get(kind)?.relations ?? {};
  }

  /**
   * Get metadata for a kind.
   */
  getMetadata(kind: string): { apiVersion: string; names: any; description?: string; categories?: string[] } | undefined {
    const kindData = this.kinds.get(kind);
    if (!kindData) return undefined;
    return {
      apiVersion: kindData.apiVersion,
      names: kindData.names,
      description: kindData.description,
      categories: kindData.categories,
    };
  }
}

// ============================================================================
// 2. Relation Declarations
// ============================================================================

/**
 * Declarative relation mapping example.
 * Relations are inferred from spec field paths.
 */
const registry = new CatalogModelRegistry();

// Example shown in section 5 below

// ============================================================================
// 3. Base Entity Envelope
// ============================================================================

/**
 * All kinds automatically inherit the base entity envelope.
 * Plugins only need to define spec fields and optionally extend metadata.
 * The envelope includes:
 * - apiVersion (string)
 * - kind (string)
 * - metadata.name (required string)
 * - metadata.namespace (optional string, defaults to 'default')
 * - metadata.title (optional string)
 * - metadata.description (optional string)
 * - metadata.annotations (optional record of string to string)
 * - metadata.labels (optional record of string to string)
 * - metadata.tags (optional array of strings)
 * - metadata.links (optional array of link objects)
 * - spec (empty object with additionalProperties: true)
 */

// ============================================================================
// 4. Example: Define Built-in Component Kind
// ============================================================================

registry.registerKind({
  apiVersion: 'backstage.io/v1alpha1',
  names: {
    kind: 'Component',
    singular: 'component',
    plural: 'components',
    shortNames: ['comp', 'c'],
  },
  description: 'A software component such as a service, library, or website',
  categories: ['core', 'software'],
  schema: {
    spec: z => ({
      type: z
        .enum(['service', 'library', 'website'])
        .meta({ description: 'Type of component' }),
      lifecycle: lifecycle(z),
      owner: entityRef(z, { kind: ['Group', 'User'] }).meta({
        description: 'Owner of the component',
      }),
      system: entityRef(z, { kind: 'System' })
        .optional()
        .meta({ description: 'System this component belongs to' }),
      subcomponentOf: entityRef(z, { kind: 'Component' })
        .optional()
        .meta({ description: 'Parent component if this is a subcomponent' }),
      providesApis: z
        .array(entityRef(z, { kind: 'API' }))
        .optional()
        .meta({ description: 'APIs provided by this component' }),
      consumesApis: z
        .array(entityRef(z, { kind: 'API' }))
        .optional()
        .meta({ description: 'APIs consumed by this component' }),
      dependsOn: z
        .array(entityRef(z))
        .optional()
        .meta({ description: 'Resources this component depends on' }),
      dependencyOf: z
        .array(entityRef(z))
        .optional()
        .meta({ description: 'Resources that depend on this component' }),
    }),
  },
  relations: {
    'spec.owner': { forward: 'ownedBy', reverse: 'ownerOf' },
    'spec.system': { forward: 'partOf', reverse: 'hasPart' },
    'spec.subcomponentOf': { forward: 'childOf', reverse: 'parentOf' },
    'spec.providesApis': { forward: 'providesApi', reverse: 'apiProvidedBy' },
    'spec.consumesApis': { forward: 'consumesApi', reverse: 'apiConsumedBy' },
    'spec.dependsOn': { forward: 'dependsOn', reverse: 'dependencyOf' },
  },
});

// ============================================================================
// 5. Example: Plugin Extending Component
// ============================================================================

/**
 * Plugin extends Component with additional type values and custom fields.
 * Shows enum union merging and metadata.annotations additions.
 * Plugins only need to define what they add; they don't redefine common metadata fields.
 */
registry.registerKindExtension('Component', {
  spec: z => ({
    type: z.enum(['mobile-app', 'data-pipeline']),
    subtype: z
      .enum(['ios', 'android', 'react-native', 'batch', 'streaming'])
      .optional()
      .meta({ description: 'Subtype providing more specific classification' }),
  }),
  metadata: {
    annotations: z => ({
      'my-plugin.io/team-id': z
        .string()
        .meta({ description: 'Internal team identifier from HR system' }),
      'my-plugin.io/cost-center': z
        .string()
        .optional()
        .meta({ description: 'Cost center for billing tracking' }),
    }),
    labels: z => ({
      'my-plugin.io/tier': z
        .string()
        .optional()
        .meta({ description: 'Service tier classification' }),
    }),
  },
  relations: {
    'spec.subtype': { forward: 'hasSubtype', reverse: 'subtypeOf' },
  },
});

// ============================================================================
// 6. Example: Plugin Creating New "Pipeline" Kind
// ============================================================================

registry.registerKind({
  apiVersion: 'my-org.io/v1alpha1',
  names: {
    kind: 'Pipeline',
    singular: 'pipeline',
    plural: 'pipelines',
    shortNames: ['pipe', 'pl'],
  },
  description: 'A CI/CD pipeline for building and deploying software',
  categories: ['infrastructure', 'automation'],
  schema: {
    spec: z => ({
      engine: z.enum(['github-actions', 'tekton', 'jenkins']).meta({ description: 'CI engine' }),
      owner: entityRef(z, { kind: 'Group' }).meta({
        description: 'Owner of the pipeline',
      }),
      type: z.enum(['ci', 'cd', 'ci-cd']).meta({ description: 'Type of pipeline' }),
      triggers: z
        .array(
          z.object({
            type: z.enum(['push', 'pull_request', 'schedule', 'manual']),
            branches: z.array(z.string()).optional(),
            schedule: z.string().optional(),
          }),
        )
        .optional()
        .meta({ description: 'Trigger configurations for the pipeline' }),
      targets: z
        .array(entityRef(z, { kind: 'Component' }))
        .meta({ description: 'Components this pipeline builds or deploys' }),
      environments: z
        .array(z.enum(['development', 'staging', 'production']))
        .optional()
        .meta({ description: 'Target deployment environments' }),
      repository: z.string().url().optional().meta({ description: 'Git repository URL' }),
    }),
    metadata: {
      annotations: z => ({
        'pipeline.io/last-run': z
          .string()
          .optional()
          .meta({ description: 'ISO timestamp of last pipeline run' }),
        'backstage.io/source-location': z
          .string()
          .url()
          .optional()
          .meta({ description: 'Source location of pipeline configuration' }),
      }),
      labels: z => ({
        'pipeline.io/engine': z
          .string()
          .optional()
          .meta({ description: 'The CI engine type' }),
      }),
    },
  },
  relations: {
    'spec.owner': { forward: 'ownedBy', reverse: 'ownerOf' },
    'spec.targets': { forward: 'builds', reverse: 'builtBy' },
  },
});

// ============================================================================
// 7. Schema Merging
// ============================================================================

/**
 * Demonstration of enum union merging when multiple plugins extend the same field.
 * After the extension in section 5, Component.spec.type now accepts:
 * 'service' | 'library' | 'website' | 'mobile-app' | 'data-pipeline'
 */

// Another plugin extending Component.spec.type
registry.registerKindExtension('Component', {
  spec: z => ({
    type: z.enum(['documentation', 'tooling']),
  }),
});

// Now Component.spec.type is a union of all registered values:
// 'service' | 'library' | 'website' | 'mobile-app' | 'data-pipeline' | 'documentation' | 'tooling'

// ============================================================================
// 8. Serialization Output
// ============================================================================

/**
 * Generate JSON Schema using Zod 4's native conversion.
 * Key difference: z.toJSONSchema() is built-in, no external dependency.
 */
// const jsonSchemas = registry.toJsonSchema();

/**
 * Example output structure for Component kind.
 * Zod 4's native conversion produces cleaner, more accurate JSON Schema.
 */
// const componentJsonSchema = jsonSchemas.Component;

/**
 * Zod 4 improvements over Zod 3:
 * - Native z.toJsonSchema() with no external dependencies
 * - Better OpenAPI 3.0 compatibility
 * - More accurate schema generation for complex types
 * - Built-in support for $refStrategy and target formats
 * - Richer metadata via .meta() with title and description support
 */

// TypeScript type inference example
// type ComponentEntity = z.infer<ReturnType<typeof createComponentSchema>>;

// function createComponentSchema() {
//   const kind = registry['kinds'].get('Component')!;
//   return z.object({
//     apiVersion: z.string(),
//     kind: z.literal('Component'),
//     metadata: z.object({
//       name: z.string(),
//       annotations: z
//         .object(kind.metadataFields.annotations)
//         .passthrough()
//         .optional(),
//       labels: z.object(kind.metadataFields.labels).passthrough().optional(),
//     }),
//     spec: z.object(kind.specFields).passthrough(),
//   });
// }

/**
 * JSON Schema output example for Component kind.
 * Shows Zod 4's native conversion with OpenAPI 3.0 compatibility.
 */
/*
const exampleOutput = {
  Component: {
    type: 'object',
    properties: {
      apiVersion: {
        type: 'string',
        description: 'API version of the entity',
      },
      kind: {
        type: 'string',
        enum: ['Component'],
        description: 'Kind of the entity',
      },
      metadata: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Name of the entity' },
          namespace: { type: 'string', description: 'Namespace of the entity' },
          annotations: {
            type: 'object',
            properties: {
              'my-plugin.io/team-id': {
                type: 'string',
                description: 'Internal team identifier from HR system',
              },
              'my-plugin.io/cost-center': {
                type: 'string',
                description: 'Cost center for billing tracking',
              },
            },
            additionalProperties: true,
          },
          labels: {
            type: 'object',
            properties: {
              'my-plugin.io/tier': {
                type: 'string',
                description: 'Service tier classification',
              },
            },
            additionalProperties: true,
          },
        },
        required: ['name'],
      },
      spec: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: [
              'service',
              'library',
              'website',
              'mobile-app',
              'data-pipeline',
              'documentation',
              'tooling',
            ],
            description: 'Type of component',
          },
          lifecycle: {
            type: 'string',
            enum: ['experimental', 'production', 'deprecated'],
            description: 'Lifecycle stage of the entity',
          },
          owner: {
            type: 'string',
            pattern: '^[a-z0-9-]+:[a-z0-9-]+/[a-z0-9.-]+$',
            description:
              'Entity reference matching pattern kind:namespace/name. Allowed kinds: Group, User',
          },
          subtype: {
            type: 'string',
            enum: ['ios', 'android', 'react-native', 'batch', 'streaming'],
            description: 'Subtype providing more specific classification',
          },
        },
        required: ['type', 'lifecycle', 'owner'],
        additionalProperties: true,
      },
    },
    required: ['apiVersion', 'kind', 'metadata', 'spec'],
  },
};
*/

/**
 * Summary of Zod 4 advantages for catalog model extensions:
 *
 * 1. Native JSON Schema: No external zod-to-json-schema dependency
 * 2. Better accuracy: More precise schema generation with fewer edge cases
 * 3. OpenAPI support: Built-in targeting for OpenAPI 3.0/3.1
 * 4. Richer metadata: .meta() supports title and description for better schema output
 * 5. Better introspection: Easier to implement schema merging
 * 6. Performance: Built-in conversion is optimized
 *
 * This makes Zod 4 the clear choice for catalog model extensions.
 */

// ============================================================================
// 9. Example: Internal Company Extension
// ============================================================================

function registerCompanyExtensions(registry: CatalogModelRegistry): void {
  registry.registerKindExtension('Component', {
    spec: z => ({
      costCenter: z.string().meta({ description: 'Finance cost center code' }),
      tier: z.enum(['critical', 'high', 'medium', 'low']).meta({ description: 'Service tier for SLA' }),
    }),
    metadata: {
      annotations: z => ({
        'company.com/slack-channel': z.string().meta({ description: 'Primary Slack channel for team' }),
      }),
    },
  });

  registry.registerKindExtension('API', {
    spec: z => ({
      costCenter: z.string().meta({ description: 'Finance cost center code' }),
    }),
    metadata: {
      annotations: z => ({
        'company.com/slack-channel': z.string().meta({ description: 'Primary Slack channel for API owners' }),
      }),
    },
  });
}

// ============================================================================
// 10. Example: Third-Party Plugin Extension
// ============================================================================

function registerKubernetesPlugin(registry: CatalogModelRegistry): void {
  registry.registerKindExtension('Component', {
    metadata: {
      annotations: z => ({
        'backstage.io/kubernetes-id': z.string().meta({ description: 'Kubernetes app selector label' }),
        'backstage.io/kubernetes-namespace': z.string().optional().meta({ description: 'Kubernetes namespace' }),
      }),
    },
  });
}

function registerPagerDutyPlugin(registry: CatalogModelRegistry): void {
  registry.registerKindExtension('Component', {
    metadata: {
      annotations: z => ({
        'pagerduty.com/service-id': z.string().meta({ description: 'PagerDuty service identifier' }),
      }),
    },
  });
}

// ============================================================================
// 11. Example: Config-Driven Custom Kind
// ============================================================================

type CustomKindConfig = {
  apiVersion: string;
  kind: string;
  plural: string;
  spec: {
    [fieldName: string]: {
      type: 'string' | 'enum';
      values?: string[];
      description?: string;
    };
  };
};

function registerKindFromConfig(
  registry: CatalogModelRegistry,
  config: CustomKindConfig
): void {
  const specBuilder: SchemaBuilder = (z) => {
    const fields: Record<string, z.ZodTypeAny> = {};

    for (const [fieldName, fieldDef] of Object.entries(config.spec)) {
      if (fieldDef.type === 'enum' && fieldDef.values) {
        fields[fieldName] = z.enum(fieldDef.values as [string, ...string[]])
          .meta({ description: fieldDef.description || '' });
      } else if (fieldDef.type === 'string') {
        fields[fieldName] = z.string().meta({ description: fieldDef.description || '' });
      }
    }

    return fields;
  };

  registry.registerKind({
    apiVersion: config.apiVersion,
    names: {
      kind: config.kind,
      singular: config.kind.toLowerCase(),
      plural: config.plural,
    },
    schema: {
      spec: specBuilder,
    },
  });
}

const databaseKindConfig: CustomKindConfig = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Database',
  plural: 'databases',
  spec: {
    type: {
      type: 'enum',
      values: ['postgres', 'mysql', 'mongodb', 'redis'],
      description: 'Database engine type',
    },
    owner: {
      type: 'string',
      description: 'Team responsible for this database',
    },
  },
};

export {
  CatalogModelRegistry,
  entityRef,
  lifecycle,
  type KindDefinition,
  type KindExtension,
  type RelationMapping,
  registerCompanyExtensions,
  registerKubernetesPlugin,
  registerPagerDutyPlugin,
  registerKindFromConfig,
  databaseKindConfig,
};
