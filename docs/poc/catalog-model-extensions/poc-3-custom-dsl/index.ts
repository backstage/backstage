/**
 * POC 3: Custom DSL with Lazy Resolution Container
 *
 * This proof-of-concept demonstrates a custom DSL for extending the Backstage
 * catalog model. Plugin authors never see Zod directly. A lazy resolution
 * container handles ordering, so plugins don't need to coordinate. Cross-kind
 * references are first-class.
 *
 * This is a design demonstration for an RFC. It should type-check conceptually
 * but is not intended to be a runnable package.
 */


// =============================================================================
// 1. Field Builder API
// =============================================================================

/**
 * Options common to all field types.
 */
interface BaseFieldOptions {
  description?: string;
  optional?: boolean;
}

/**
 * Options for entity reference fields.
 */
interface EntityRefOptions extends BaseFieldOptions {
  kind?: string | string[];
  relations?: {
    forward: string;
    reverse: string;
  };
}

/**
 * Field definitions that capture type information at the TypeScript level.
 */
type FieldDefinition<T = unknown> = {
  _type: T;
  _internal: {
    fieldType: 'string' | 'enum' | 'boolean' | 'array' | 'object' | 'entityRef';
    options: BaseFieldOptions | EntityRefOptions;
    meta?: {
      enumValues?: readonly any[];
      itemField?: FieldDefinition;
      shape?: Record<string, FieldDefinition>;
    };
  };
  optional(): FieldDefinition<T>;
};

/**
 * The Field Builder API that plugin authors use to define fields.
 * This is the only API surface they interact with.
 */
class FieldBuilder {
  string(options?: BaseFieldOptions): FieldDefinition<string> {
    const self = this;
    return {
      _type: '' as string,
      _internal: {
        fieldType: 'string',
        options: options ?? {},
      },
      optional() {
        return self.string({ ...options, optional: true });
      },
    };
  }

  enum<T extends readonly string[]>(
    values: T,
    options?: BaseFieldOptions,
  ): FieldDefinition<T[number]> {
    const self = this;
    return {
      _type: '' as T[number],
      _internal: {
        fieldType: 'enum',
        options: options ?? {},
        meta: { enumValues: values },
      },
      optional() {
        return self.enum(values, { ...options, optional: true });
      },
    };
  }

  boolean(options?: BaseFieldOptions): FieldDefinition<boolean> {
    const self = this;
    return {
      _type: false,
      _internal: {
        fieldType: 'boolean',
        options: options ?? {},
      },
      optional() {
        return self.boolean({ ...options, optional: true });
      },
    };
  }

  array<T>(
    itemField: FieldDefinition<T>,
    options?: BaseFieldOptions,
  ): FieldDefinition<T[]> {
    const self = this;
    return {
      _type: [] as T[],
      _internal: {
        fieldType: 'array',
        options: options ?? {},
        meta: { itemField },
      },
      optional() {
        return self.array(itemField, { ...options, optional: true });
      },
    };
  }

  object<S extends Record<string, FieldDefinition>>(
    shape: S,
    options?: BaseFieldOptions,
  ): FieldDefinition<{ [K in keyof S]: S[K]['_type'] }> {
    const self = this;
    return {
      _type: {} as { [K in keyof S]: S[K]['_type'] },
      _internal: {
        fieldType: 'object',
        options: options ?? {},
        meta: { shape },
      },
      optional() {
        return self.object(shape, { ...options, optional: true });
      },
    };
  }

  entityRef(options?: EntityRefOptions): FieldDefinition<string> {
    const self = this;
    return {
      _type: '' as string,
      _internal: {
        fieldType: 'entityRef',
        options: options ?? {},
      },
      optional() {
        return self.entityRef({ ...options, optional: true });
      },
    };
  }

  lifecycle(): FieldDefinition<
    'experimental' | 'production' | 'deprecated'
  > {
    return this.enum(
      ['experimental', 'production', 'deprecated'] as const,
      {
        description: 'Lifecycle state of the entity',
      },
    );
  }

  /**
   * Creates a base entity envelope with standard metadata fields.
   * This is used internally by createKind to ensure all kinds inherit base fields.
   */
  baseEntityEnvelope() {
    return {
      apiVersion: this.string({ description: 'API version of the entity' }),
      kind: this.string({ description: 'Kind of the entity' }),
      metadata: {
        name: this.string({ description: 'Name of the entity' }),
        namespace: this.string({ description: 'Namespace of the entity, defaults to "default"' }).optional(),
        title: this.string({ description: 'Human-readable title' }).optional(),
        description: this.string({ description: 'Description of the entity' }).optional(),
        annotations: {} as Record<string, FieldDefinition>,
        labels: {} as Record<string, FieldDefinition>,
        tags: this.array(this.string(), { description: 'List of tags for categorization' }).optional(),
        links: this.array(
          this.object({
            url: this.string(),
            title: this.string().optional(),
            icon: this.string().optional(),
          }),
          { description: 'External hyperlinks related to the entity' },
        ).optional(),
      },
      spec: {} as Record<string, FieldDefinition>,
    };
  }
}

// =============================================================================
// 2. Lazy Resolution Container
// =============================================================================

/**
 * CRD-style metadata for a kind.
 */
interface KindMetadata {
  kind: string;
  apiVersion?: string;
  names?: {
    kind: string;
    singular?: string;
    plural?: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
}

/**
 * Schema definition for a kind, separate from identification.
 */
interface KindSchema {
  spec?: Record<string, FieldDefinition>;
  metadata?: {
    annotations?: Record<string, FieldDefinition>;
    labels?: Record<string, FieldDefinition>;
    [key: string]: FieldDefinition | Record<string, FieldDefinition> | undefined;
  };
  status?: Record<string, FieldDefinition>;
}

/**
 * Full kind definition with separation between identification and schema.
 */
interface KindDefinition {
  apiVersion: string;
  names: {
    kind: string;
    singular?: string;
    plural?: string;
    shortNames?: string[];
  };
  description?: string;
  categories?: string[];
  schema?: KindSchema;
}

/**
 * A section of a kind (spec, metadata, status, etc.) that can be extended.
 */
interface KindSection {
  fields: Record<string, FieldDefinition>;
  extend(fields: Record<string, FieldDefinition>): void;
}

/**
 * Lazy proxy representing a kind that may not exist yet.
 */
interface LazyKind {
  spec: KindSection;
  metadata: {
    extend(fields: Record<string, FieldDefinition>): void;
    fields: Record<string, FieldDefinition>;
    annotations: KindSection;
    labels: KindSection;
  };
  status: KindSection;
}

/**
 * Internal registration for a kind.
 */
interface KindRegistration {
  metadata: KindMetadata;
  sections: {
    spec: Record<string, FieldDefinition>;
    metadata: Record<string, FieldDefinition>;
    status: Record<string, FieldDefinition>;
    annotations: Record<string, FieldDefinition>;
    labels: Record<string, FieldDefinition>;
  };
  extensions: Array<{
    section: 'spec' | 'metadata' | 'status' | 'annotations' | 'labels';
    fields: Record<string, FieldDefinition>;
  }>;
}

/**
 * The lazy resolution container.
 * Phase 1: Collect all registrations and extensions.
 * Phase 2: Resolve, merge, and validate.
 */
class LazyResolutionContainer {
  private registrations = new Map<string, KindRegistration>();
  private resolved = false;
  public field = new FieldBuilder();

  /**
   * Get a lazy proxy for a kind. The kind doesn't need to exist yet.
   */
  getKind(kindName: string): LazyKind {
    if (!this.registrations.has(kindName)) {
      this.registrations.set(kindName, {
        metadata: { kind: kindName },
        sections: {
          spec: {},
          metadata: {},
          status: {},
          annotations: {},
          labels: {},
        },
        extensions: [],
      });
    }

    const registration = this.registrations.get(kindName)!;

    const self = this;
    const createSection = (
      sectionName: 'spec' | 'metadata' | 'status' | 'annotations' | 'labels',
    ): KindSection => {
      return {
        get fields() {
          return registration.sections[sectionName];
        },
        extend(fields: Record<string, FieldDefinition>) {
          if (self.resolved) {
            throw new Error(
              `Cannot extend ${kindName}.${sectionName} after resolution`,
            );
          }
          registration.extensions.push({
            section: sectionName,
            fields,
          });
        },
      };
    };

    return {
      spec: createSection('spec'),
      metadata: {
        get fields() {
          return registration.sections.metadata;
        },
        extend(fields: Record<string, FieldDefinition>) {
          if (self.resolved) {
            throw new Error(
              `Cannot extend ${kindName}.metadata after resolution`,
            );
          }
          registration.extensions.push({
            section: 'metadata',
            fields,
          });
        },
        annotations: createSection('annotations'),
        labels: createSection('labels'),
      },
      status: createSection('status'),
    };
  }

  /**
   * Create a new kind with initial fields.
   * Automatically applies the base entity envelope to all kinds.
   */
  createKind(definition: KindDefinition): void {
    if (this.resolved) {
      throw new Error(`Cannot create kind after resolution`);
    }

    const { apiVersion, names, description, categories, schema } = definition;
    const kind = names.kind;

    const baseEnvelope = this.field.baseEntityEnvelope();

    if (!this.registrations.has(kind)) {
      this.registrations.set(kind, {
        metadata: { kind, apiVersion, names, description, categories },
        sections: {
          spec: {},
          metadata: {},
          status: {},
          annotations: {},
          labels: {},
        },
        extensions: [],
      });
    }

    const registration = this.registrations.get(kind)!;
    registration.metadata = { kind, apiVersion, names, description, categories };

    Object.assign(registration.sections.metadata, {
      name: baseEnvelope.metadata.name,
      namespace: baseEnvelope.metadata.namespace,
      title: baseEnvelope.metadata.title,
      description: baseEnvelope.metadata.description,
      tags: baseEnvelope.metadata.tags,
      links: baseEnvelope.metadata.links,
    });

    if (schema?.spec) {
      Object.assign(registration.sections.spec, schema.spec);
    }
    if (schema?.metadata) {
      if ('annotations' in schema.metadata && schema.metadata.annotations) {
        Object.assign(registration.sections.annotations, schema.metadata.annotations);
      }
      if ('labels' in schema.metadata && schema.metadata.labels) {
        Object.assign(registration.sections.labels, schema.metadata.labels);
      }
      const metadataWithoutAnnotationsAndLabels = { ...schema.metadata };
      delete (metadataWithoutAnnotationsAndLabels as any).annotations;
      delete (metadataWithoutAnnotationsAndLabels as any).labels;
      Object.assign(registration.sections.metadata, metadataWithoutAnnotationsAndLabels);
    }
    if (schema?.status) {
      Object.assign(registration.sections.status, schema.status);
    }
  }

  /**
   * Resolve all registrations. This merges extensions and validates.
   * Called after all plugins have initialized.
   */
  resolve(): void {
    if (this.resolved) {
      throw new Error('Already resolved');
    }

    for (const [kindName, registration] of Array.from(this.registrations.entries())) {
      for (const extension of registration.extensions) {
        const targetSection = registration.sections[extension.section];

        for (const [fieldName, fieldDef] of Object.entries(extension.fields)) {
          const existingField = targetSection[fieldName];
          if (existingField) {
            targetSection[fieldName] = this.mergeFields(
              existingField as FieldDefinition,
              fieldDef,
              `${kindName}.${extension.section}.${fieldName}`,
            );
          } else {
            targetSection[fieldName] = fieldDef;
          }
        }
      }

      if (
        Object.keys(registration.sections.spec).length === 0 &&
        Object.keys(registration.sections.metadata).length === 0 &&
        Object.keys(registration.sections.status).length === 0 &&
        Object.keys(registration.sections.annotations).length === 0 &&
        Object.keys(registration.sections.labels).length === 0
      ) {
        throw new Error(
          `Kind "${kindName}" was referenced but never defined. ` +
          `Did you forget to call createKind("${kindName}")?`,
        );
      }
    }

    this.resolved = true;
  }

  /**
   * Merge two field definitions.
   * For enums, this takes the union of values.
   * For other types, this throws if they conflict.
   */
  private mergeFields(
    existing: FieldDefinition,
    incoming: FieldDefinition,
    path: string,
  ): FieldDefinition {
    if (existing._internal.fieldType !== incoming._internal.fieldType) {
      throw new Error(
        `Field type conflict at ${path}: ` +
        `${existing._internal.fieldType} vs ${incoming._internal.fieldType}`,
      );
    }

    if (existing._internal.fieldType === 'enum') {
      const existingValues = existing._internal.meta?.enumValues ?? [];
      const incomingValues = incoming._internal.meta?.enumValues ?? [];
      const mergedValues = Array.from(
        new Set([...existingValues, ...incomingValues]),
      );

      const mergedOptions = {
        ...existing._internal.options,
        ...incoming._internal.options,
      };

      return this.field.enum(
        mergedValues as any,
        mergedOptions,
      ) as FieldDefinition;
    }

    return existing;
  }

  /**
   * Export to JSON Schema.
   * Internally, this could use Zod via zodToJsonSchema for more complex validation,
   * but for this POC we generate JSON Schema directly. The key is that plugin
   * authors never see Zod in the public API.
   */
  toJsonSchema(): Record<string, any> {
    if (!this.resolved) {
      throw new Error('Must resolve before exporting');
    }

    const schemas: Record<string, any> = {};

    for (const [kindName, registration] of Array.from(this.registrations.entries())) {
      const metadataSchema = this.sectionToJsonSchema(registration.sections.metadata);

      if (Object.keys(registration.sections.annotations).length > 0) {
        metadataSchema.properties = metadataSchema.properties || {};
        metadataSchema.properties.annotations = this.sectionToJsonSchema(
          registration.sections.annotations,
        );
      }

      if (Object.keys(registration.sections.labels).length > 0) {
        metadataSchema.properties = metadataSchema.properties || {};
        metadataSchema.properties.labels = this.sectionToJsonSchema(
          registration.sections.labels,
        );
      }

      schemas[kindName] = {
        type: 'object',
        description: registration.metadata.description,
        properties: {
          apiVersion: { type: 'string' },
          kind: { type: 'string', const: kindName },
          metadata: metadataSchema,
          spec: this.sectionToJsonSchema(registration.sections.spec),
        },
        required: ['apiVersion', 'kind', 'metadata'],
        additionalProperties: true,
      };

      if (Object.keys(registration.sections.status).length > 0) {
        schemas[kindName].properties.status = this.sectionToJsonSchema(
          registration.sections.status,
        );
      }
    }

    return schemas;
  }

  private sectionToJsonSchema(
    section: Record<string, FieldDefinition>,
  ): any {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    for (const [fieldName, fieldDef] of Object.entries(section)) {
      properties[fieldName] = this.fieldToJsonSchema(fieldDef);

      if (!fieldDef._internal.options.optional) {
        required.push(fieldName);
      }
    }

    return {
      type: 'object',
      properties,
      required: required.length > 0 ? required : undefined,
      additionalProperties: true,
    };
  }

  private fieldToJsonSchema(field: FieldDefinition): any {
    const schema: any = {};

    if (field._internal.options.description) {
      schema.description = field._internal.options.description;
    }

    switch (field._internal.fieldType) {
      case 'string':
        schema.type = 'string';
        break;
      case 'boolean':
        schema.type = 'boolean';
        break;
      case 'enum':
        schema.type = 'string';
        schema.enum = field._internal.meta?.enumValues;
        break;
      case 'array':
        schema.type = 'array';
        schema.items = this.fieldToJsonSchema(field._internal.meta!.itemField!);
        break;
      case 'object':
        schema.type = 'object';
        const shape = field._internal.meta?.shape ?? {};
        schema.properties = {};
        for (const [key, value] of Object.entries(shape)) {
          schema.properties[key] = this.fieldToJsonSchema(value);
        }
        break;
      case 'entityRef':
        schema.type = 'string';
        const refOptions = field._internal.options as EntityRefOptions;
        if (refOptions.kind) {
          schema['x-backstage-entityRef'] = {
            allowedKinds: Array.isArray(refOptions.kind)
              ? refOptions.kind
              : [refOptions.kind],
          };
        }
        if (refOptions.relations) {
          schema['x-backstage-relations'] = refOptions.relations;
        }
        break;
    }

    return schema;
  }

  /**
   * Export to TypeScript type definitions.
   */
  toTypeScript(): string {
    if (!this.resolved) {
      throw new Error('Must resolve before exporting');
    }

    let output = '';

    for (const [kindName, registration] of Array.from(this.registrations.entries())) {
      output += `export interface ${kindName} {\n`;
      output += `  apiVersion: string;\n`;
      output += `  kind: '${kindName}';\n`;
      output += `  metadata: ${this.sectionToTypeScript(registration.sections.metadata, 2)};\n`;
      output += `  spec: ${this.sectionToTypeScript(registration.sections.spec, 2)};\n`;

      if (Object.keys(registration.sections.status).length > 0) {
        output += `  status?: ${this.sectionToTypeScript(registration.sections.status, 2)};\n`;
      }

      output += `}\n\n`;
    }

    return output;
  }

  private sectionToTypeScript(
    section: Record<string, FieldDefinition>,
    indent: number,
  ): string {
    const lines: string[] = [];
    const indentStr = ' '.repeat(indent);

    for (const [fieldName, fieldDef] of Object.entries(section)) {
      const typeStr = this.fieldToTypeScript(fieldDef);
      const optional = fieldDef._internal.options.optional ? '?' : '';
      const description = fieldDef._internal.options.description
        ? `${indentStr}/** ${fieldDef._internal.options.description} */\n`
        : '';

      lines.push(`${description}${indentStr}${fieldName}${optional}: ${typeStr};`);
    }

    if (lines.length === 0) {
      return '{}';
    }

    return `{\n${lines.join('\n')}\n${' '.repeat(indent - 2)}}`;
  }

  private fieldToTypeScript(field: FieldDefinition): string {
    switch (field._internal.fieldType) {
      case 'string':
        return 'string';
      case 'boolean':
        return 'boolean';
      case 'enum':
        const values = field._internal.meta?.enumValues ?? [];
        return values.map(v => `'${v}'`).join(' | ');
      case 'array':
        const itemType = this.fieldToTypeScript(field._internal.meta!.itemField!);
        return `${itemType}[]`;
      case 'object':
        const shape = field._internal.meta?.shape ?? {};
        const props = Object.entries(shape)
          .map(([key, value]) => {
            const optional = value._internal.options.optional ? '?' : '';
            return `${key}${optional}: ${this.fieldToTypeScript(value)}`;
          })
          .join('; ');
        return `{ ${props} }`;
      case 'entityRef':
        return 'string';
      default:
        return 'unknown';
    }
  }
}

// =============================================================================
// 3. Relation Declarations
// =============================================================================

/**
 * Relations are built into entity reference field definitions.
 * Example:
 *
 * component.spec.extend({
 *   owner: model.field.entityRef({
 *     kind: ['Group', 'User'],
 *     description: 'The entity responsible for this component',
 *     relations: { forward: 'ownedBy', reverse: 'ownerOf' },
 *   }),
 *   providesApis: model.field.array(
 *     model.field.entityRef({
 *       kind: 'API',
 *       relations: { forward: 'providesApi', reverse: 'apiProvidedBy' },
 *     }),
 *   ).optional(),
 * });
 */

// =============================================================================
// 4. CRD-style Kind Metadata
// =============================================================================

/**
 * Example kind metadata definition:
 *
 * model.createKind({
 *   apiVersion: 'my-org.io/v1alpha1',
 *   names: {
 *     kind: 'Pipeline',
 *     singular: 'pipeline',
 *     plural: 'pipelines',
 *     shortNames: ['pl'],
 *   },
 *   description: 'A CI/CD pipeline definition',
 *   categories: ['ci', 'infrastructure'],
 *   schema: {
 *     spec: { ... },
 *     metadata: {
 *       annotations: {
 *         'pipeline.io/last-run': model.field.string({ description: 'ISO timestamp of last run' }),
 *       },
 *       labels: {
 *         'pipeline.io/engine': model.field.string({ description: 'CI engine type' }),
 *       },
 *     },
 *   },
 * });
 */

// =============================================================================
// 5. Example: Define Built-in Component Kind
// =============================================================================

const model = new LazyResolutionContainer();

model.createKind({
  apiVersion: 'backstage.io/v1alpha1',
  names: {
    kind: 'Component',
    singular: 'component',
    plural: 'components',
    shortNames: ['comp'],
  },
  description: 'A software component',
  categories: ['catalog'],
  schema: {
    spec: {
      type: model.field.enum(['service', 'website', 'library'] as const, {
        description: 'The type of component',
      }),
      lifecycle: model.field.lifecycle(),
      owner: model.field.entityRef({
        kind: ['Group', 'User'],
        description: 'The entity responsible for this component',
        relations: { forward: 'ownedBy', reverse: 'ownerOf' },
      }),
      system: model.field.entityRef({
        kind: 'System',
        description: 'The system this component belongs to',
        relations: { forward: 'partOf', reverse: 'hasPart' },
      }).optional(),
      subcomponentOf: model.field.entityRef({
        kind: 'Component',
        description: 'The parent component',
        relations: { forward: 'subcomponentOf', reverse: 'hasSubcomponent' },
      }).optional(),
      providesApis: model.field.array(
        model.field.entityRef({
          kind: 'API',
          relations: { forward: 'providesApi', reverse: 'apiProvidedBy' },
        }),
      ).optional(),
      consumesApis: model.field.array(
        model.field.entityRef({
          kind: 'API',
          relations: { forward: 'consumesApi', reverse: 'apiConsumedBy' },
        }),
      ).optional(),
      dependsOn: model.field.array(
        model.field.entityRef({
          kind: ['Component', 'Resource'],
          relations: { forward: 'dependsOn', reverse: 'dependencyOf' },
        }),
      ).optional(),
    },
  },
});

// =============================================================================
// 6. Example: Plugin Extending Component
// =============================================================================

const component = model.getKind('Component');

component.spec.extend({
  subtype: model.field.string({
    description: 'Further classification beyond type',
  }).optional(),
});

component.metadata.annotations.extend({
  'my-plugin.io/team-id': model.field.string({
    description: 'Team identifier for custom integration',
  }),
  'my-plugin.io/deployment-region': model.field.enum(
    ['us-east-1', 'us-west-2', 'eu-west-1'] as const,
    { description: 'Primary deployment region' },
  ).optional(),
});

component.metadata.labels.extend({
  'my-plugin.io/tier': model.field.enum(
    ['gold', 'silver', 'bronze'] as const,
    { description: 'Service tier classification' },
  ).optional(),
});

// =============================================================================
// 7. Example: Plugin Creating New "Pipeline" Kind with Cross-Kind References
// =============================================================================

model.createKind({
  apiVersion: 'my-org.io/v1alpha1',
  names: {
    kind: 'Pipeline',
    singular: 'pipeline',
    plural: 'pipelines',
    shortNames: ['pl', 'pipe'],
  },
  description: 'A CI/CD pipeline definition',
  categories: ['ci', 'infrastructure'],
  schema: {
    spec: {
      owner: component.spec.fields.owner,
      components: model.field.array(
        model.field.entityRef({
          kind: 'Component',
          relations: { forward: 'builds', reverse: 'builtBy' },
        }),
      ),
      stages: model.field.array(
        model.field.object({
          name: model.field.string(),
          steps: model.field.array(
            model.field.object({
              name: model.field.string(),
              command: model.field.string(),
              timeout: model.field.string().optional(),
            }),
          ),
        }),
      ),
      triggers: model.field.object({
        manual: model.field.boolean().optional(),
        schedule: model.field.string({ description: 'Cron expression' }).optional(),
        webhook: model.field.boolean().optional(),
      }).optional(),
    },
    metadata: {
      annotations: {
        'pipeline.io/last-run': model.field.string({
          description: 'ISO timestamp of last run',
        }).optional(),
      },
      labels: {
        'pipeline.io/engine': model.field.enum(
          ['jenkins', 'github-actions', 'gitlab-ci'] as const,
          { description: 'CI engine type' },
        ).optional(),
      },
    },
  },
});

// =============================================================================
// 8. Schema Merging
// =============================================================================

/**
 * Multiple plugins can extend the same field. For enums, values are merged
 * as a union. For other types, conflicts throw errors.
 */

const anotherPlugin = model.getKind('Component');

anotherPlugin.spec.extend({
  type: model.field.enum(['cli-tool', 'data-pipeline'] as const, {
    description: 'Additional component types from another plugin',
  }),
});

// =============================================================================
// 9. Serialization
// =============================================================================

/**
 * After all plugins have registered their kinds and extensions, resolve
 * the model and serialize it.
 */
model.resolve();

const jsonSchemas = model.toJsonSchema();
console.log('JSON Schemas:', JSON.stringify(jsonSchemas, null, 2));

const typescriptTypes = model.toTypeScript();
console.log('TypeScript Types:\n', typescriptTypes);

/**
 * Example JSON Schema output:
 * {
 *   "Component": {
 *     "type": "object",
 *     "description": "A software component",
 *     "properties": {
 *       "apiVersion": { "type": "string" },
 *       "kind": { "type": "string", "const": "Component" },
 *       "metadata": { ... },
 *       "spec": {
 *         "type": "object",
 *         "properties": {
 *           "type": {
 *             "type": "string",
 *             "enum": ["service", "website", "library", "cli-tool", "data-pipeline"]
 *           },
 *           "owner": {
 *             "type": "string",
 *             "x-backstage-entityRef": { "allowedKinds": ["Group", "User"] },
 *             "x-backstage-relations": { "forward": "ownedBy", "reverse": "ownerOf" }
 *           },
 *           ...
 *         }
 *       }
 *     }
 *   }
 * }
 */

// =============================================================================
// 10. Type Safety
// =============================================================================

/**
 * TypeScript inference works with the custom DSL. The FieldBuilder uses
 * generics to carry type information.
 */

const myComponentSpec = {
  type: model.field.enum(['service', 'website'] as const),
  owner: model.field.entityRef(),
  replicas: model.field.string({ optional: true }),
};

type InferredSpec = {
  [K in keyof typeof myComponentSpec]: typeof myComponentSpec[K]['_type'];
};

/**
 * InferredSpec is:
 * {
 *   type: 'service' | 'website';
 *   owner: string;
 *   replicas: string;
 * }
 */

export const _exampleValidation = (_spec: InferredSpec) => {
  void _spec;
};

/**
 * The lazy resolution container ensures that:
 * 1. Plugin order doesn't matter
 * 2. Cross-kind references work even if kinds are registered later
 * 3. Extensions are merged automatically
 * 4. Conflicts are detected at resolution time
 * 5. Plugin authors never see Zod
 *
 * Internally, the container could translate FieldDefinitions to Zod schemas
 * for validation and use zodToJsonSchema for JSON Schema generation, but this
 * is an implementation detail hidden from plugin authors. For this POC, we
 * generate JSON Schema directly to keep the example focused on the DSL design.
 */

/**
 * Error handling example: referencing a kind that never gets registered.
 */
const orphanedReference = model.getKind('NonexistentKind');
orphanedReference.spec.extend({
  someField: model.field.string(),
});

/**
 * When resolve() is called, this will throw:
 * Error: Kind "NonexistentKind" was referenced but never defined.
 * Did you forget to call createKind("NonexistentKind")?
 */

// =============================================================================
// Summary
// =============================================================================

/**
 * This POC demonstrates:
 *
 * 1. Field Builder API: model.field.string(), model.field.enum(), etc.
 *    Plugin authors use a purpose-built DSL, never Zod directly.
 *
 * 2. Lazy Resolution Container: getKind() returns a lazy proxy. Kinds don't
 *    need to exist yet. Order doesn't matter.
 *
 * 3. Relation Declarations: Relations are first-class, defined alongside
 *    entity reference fields.
 *
 * 4. CRD-style Metadata: apiVersion, names, description, categories.
 *
 * 5. Built-in Component Kind: Full example with all standard fields.
 *
 * 6. Plugin Extensions: Plugins can extend existing kinds.
 *
 * 7. New Kind Creation: Plugins can create new kinds and reuse fields
 *    from other kinds (even before they're defined).
 *
 * 8. Schema Merging: Enum values are unioned. Other conflicts throw errors.
 *
 * 9. Serialization: toJsonSchema() and toTypeScript() for code generation.
 *    Could use Zod internally, but plugin authors never see it.
 *
 * 10. Type Safety: TypeScript inference works end-to-end.
 *
 * Key insight: The lazy container is the differentiator. Plugin order doesn't
 * matter, and cross-kind references work seamlessly.
 */

// =============================================================================
// 12. Example: Internal Company Extension
// =============================================================================

function registerCompanyExtensions(model: LazyResolutionContainer): void {
  const component = model.getKind('Component');

  component.spec.extend({
    costCenter: model.field.string({
      description: 'Finance cost center code',
    }),
    tier: model.field.enum(['critical', 'high', 'medium', 'low'] as const, {
      description: 'Service tier for SLA',
    }),
  });

  component.metadata.annotations.extend({
    'company.com/slack-channel': model.field.string({
      description: 'Primary Slack channel for team',
    }),
  });

  const api = model.getKind('API');

  api.spec.extend({
    costCenter: model.field.string({
      description: 'Finance cost center code',
    }),
  });

  api.metadata.annotations.extend({
    'company.com/slack-channel': model.field.string({
      description: 'Primary Slack channel for API owners',
    }),
  });
}

// =============================================================================
// 13. Example: Third-Party Plugin Extension
// =============================================================================

function registerKubernetesPlugin(model: LazyResolutionContainer): void {
  const component = model.getKind('Component');

  component.metadata.annotations.extend({
    'backstage.io/kubernetes-id': model.field.string({
      description: 'Kubernetes app selector label',
    }),
    'backstage.io/kubernetes-namespace': model.field.string({
      description: 'Kubernetes namespace',
    }).optional(),
  });
}

function registerPagerDutyPlugin(model: LazyResolutionContainer): void {
  const component = model.getKind('Component');

  component.metadata.annotations.extend({
    'pagerduty.com/service-id': model.field.string({
      description: 'PagerDuty service identifier',
    }),
  });
}

// =============================================================================
// 14. Example: Config-Driven Custom Kind
// =============================================================================

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
  model: LazyResolutionContainer,
  config: CustomKindConfig
): void {
  const specFields: Record<string, FieldDefinition> = {};

  for (const [fieldName, fieldDef] of Object.entries(config.spec)) {
    if (fieldDef.type === 'enum' && fieldDef.values) {
      specFields[fieldName] = model.field.enum(
        fieldDef.values as any,
        { description: fieldDef.description },
      );
    } else if (fieldDef.type === 'string') {
      specFields[fieldName] = model.field.string({
        description: fieldDef.description,
      });
    }
  }

  model.createKind({
    apiVersion: config.apiVersion,
    names: {
      kind: config.kind,
      singular: config.kind.toLowerCase(),
      plural: config.plural,
    },
    schema: {
      spec: specFields,
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
  LazyResolutionContainer,
  FieldBuilder,
  type KindDefinition,
  type KindSchema,
  type FieldDefinition,
  type EntityRefOptions,
  registerCompanyExtensions,
  registerKubernetesPlugin,
  registerPagerDutyPlugin,
  registerKindFromConfig,
  databaseKindConfig,
};
