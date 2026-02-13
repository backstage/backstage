import { z, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// ============================================================================
// 1. Core Types and Registry API
// ============================================================================

type SchemaBuilder = (z: typeof import('zod').z) => ZodObject<any>;

type RelationMapping = {
  forward: string;
  reverse: string;
};

type KindExtension = {
  spec?: SchemaBuilder;
  metadata?: {
    annotations?: SchemaBuilder;
    labels?: SchemaBuilder;
  };
  relations?: Record<string, RelationMapping>;
};

type KindDefinition = {
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
    spec: SchemaBuilder;
    metadata?: {
      annotations?: SchemaBuilder;
      labels?: SchemaBuilder;
    };
  };
  relations?: Record<string, RelationMapping>;
};

function createBaseEntityEnvelope(
  kind: string,
  apiVersion: string,
  specSchema: ZodObject<any>,
  mergedAnnotations?: ZodObject<any>,
  mergedLabels?: ZodObject<any>
): ZodObject<any> {
  const annotationsSchema = mergedAnnotations || z.record(z.string()).describe('Entity annotations');
  const labelsSchema = mergedLabels || z.record(z.string()).describe('Key-value labels');

  return z.object({
    apiVersion: z.string().describe('API version of the entity').default(apiVersion),
    kind: z.literal(kind).describe('Kind of the entity'),
    metadata: z.object({
      name: z.string().describe('Name of the entity'),
      namespace: z.string().default('default').describe('Namespace of the entity'),
      title: z.string().optional().describe('Human-readable title'),
      description: z.string().optional().describe('Human-readable description'),
      annotations: annotationsSchema.optional(),
      labels: labelsSchema.optional(),
      tags: z.array(z.string()).optional().describe('Classification tags'),
      links: z.array(z.object({
        url: z.string().describe('URL of the link'),
        title: z.string().optional().describe('Title of the link'),
        icon: z.string().optional().describe('Icon identifier'),
      })).optional().describe('External links'),
    }),
    spec: specSchema,
  });
}

interface EntityRefOptions {
  kind?: string | string[];
  description?: string;
}

function entityRef(z: typeof import('zod').z, opts?: EntityRefOptions): ZodTypeAny {
  let schema = z.string().regex(/^[a-z0-9_\-\.]+:[a-z0-9_\-\.]+\/[a-z0-9_\-\.]+$/i);

  let description = opts?.description || 'Entity reference';
  if (opts?.kind) {
    const kinds = Array.isArray(opts.kind) ? opts.kind.join(' or ') : opts.kind;
    description += ` to ${kinds}`;
  }

  return schema.describe(description);
}

function lifecycle(z: typeof import('zod').z) {
  return z.enum(['experimental', 'production', 'deprecated']).describe('Lifecycle stage of the entity');
}

class CatalogModelRegistry {
  private kinds = new Map<string, KindState>();

  registerKind(definition: KindDefinition): void {
    const kind = definition.names.kind;

    if (this.kinds.has(kind)) {
      throw new Error(`Kind ${kind} already registered`);
    }

    const specSchema = definition.schema.spec(z);
    const annotationsSchema = definition.schema.metadata?.annotations?.(z);
    const labelsSchema = definition.schema.metadata?.labels?.(z);

    this.kinds.set(kind, {
      definition,
      specExtensions: [specSchema],
      annotationExtensions: annotationsSchema ? [annotationsSchema] : [],
      labelExtensions: labelsSchema ? [labelsSchema] : [],
      relations: definition.relations || {},
    });
  }

  registerKindExtension(kind: string, extension: KindExtension): void {
    let kindState = this.kinds.get(kind);

    if (!kindState) {
      kindState = {
        definition: {
          apiVersion: 'backstage.io/v1alpha1',
          names: {
            kind,
            singular: kind.toLowerCase(),
            plural: `${kind.toLowerCase()}s`,
          },
          schema: {
            spec: (z) => z.object({}),
          },
        },
        specExtensions: [],
        annotationExtensions: [],
        labelExtensions: [],
        relations: {},
      };
      this.kinds.set(kind, kindState);
    }

    if (extension.spec) {
      kindState.specExtensions.push(extension.spec(z));
    }

    if (extension.metadata?.annotations) {
      kindState.annotationExtensions.push(extension.metadata.annotations(z));
    }

    if (extension.metadata?.labels) {
      kindState.labelExtensions.push(extension.metadata.labels(z));
    }

    if (extension.relations) {
      kindState.relations = { ...kindState.relations, ...extension.relations };
    }
  }

  toJsonSchema(): Record<string, any> {
    const schemas: Record<string, any> = {};

    for (const [kind, state] of Array.from(this.kinds.entries())) {
      const mergedSpec = this.mergeSchemas(state.specExtensions);
      const mergedAnnotations = state.annotationExtensions.length > 0
        ? this.mergeSchemas(state.annotationExtensions)
        : undefined;
      const mergedLabels = state.labelExtensions.length > 0
        ? this.mergeSchemas(state.labelExtensions)
        : undefined;

      const entitySchema = createBaseEntityEnvelope(
        kind,
        state.definition.apiVersion,
        mergedSpec,
        mergedAnnotations,
        mergedLabels
      );

      schemas[kind] = zodToJsonSchema(entitySchema, {
        name: kind,
        $refStrategy: 'none',
      });
    }

    return schemas;
  }

  toTypeScript(): string {
    const lines: string[] = [
      '// Generated catalog model types',
      "import { Entity } from '@backstage/catalog-model';",
      '',
    ];

    for (const [kind, state] of Array.from(this.kinds.entries())) {
      // These are used for the actual type generation in a full implementation
      void this.mergeSchemas(state.specExtensions);
      void (state.annotationExtensions.length > 0
        ? this.mergeSchemas(state.annotationExtensions)
        : z.record(z.string()));

      if (state.definition.description) {
        lines.push(`/** ${state.definition.description} */`);
      }

      lines.push(`export interface ${kind}EntitySpec {`);
      lines.push(`  // Spec fields for ${kind}`);
      lines.push(`  [key: string]: any;`);
      lines.push(`}`);
      lines.push('');

      lines.push(`export interface ${kind}Entity extends Entity {`);
      lines.push(`  apiVersion: '${state.definition.apiVersion}';`);
      lines.push(`  kind: '${kind}';`);
      lines.push(`  spec: ${kind}EntitySpec;`);
      lines.push(`}`);
      lines.push('');
    }

    return lines.join('\n');
  }

  private mergeSchemas(schemas: ZodObject<any>[]): ZodObject<any> {
    if (schemas.length === 0) {
      return z.object({});
    }

    if (schemas.length === 1) {
      return schemas[0];
    }

    return schemas.reduce((acc, schema) => this.mergeTwoSchemas(acc, schema));
  }

  private mergeTwoSchemas(a: ZodObject<any>, b: ZodObject<any>): ZodObject<any> {
    const aShape = a.shape;
    const bShape = b.shape;
    const merged: ZodRawShape = { ...aShape };

    for (const [key, bSchema] of Object.entries(bShape)) {
      if (!(key in aShape)) {
        merged[key] = bSchema as ZodTypeAny;
      } else {
        const aSchema = aShape[key];
        merged[key] = this.mergeFieldSchemas(aSchema, bSchema as ZodTypeAny, key);
      }
    }

    return z.object(merged);
  }

  private mergeFieldSchemas(a: ZodTypeAny, b: ZodTypeAny, fieldPath: string): ZodTypeAny {
    if (a._def.typeName === 'ZodEnum' && b._def.typeName === 'ZodEnum') {
      const aValues = a._def.values as string[];
      const bValues = b._def.values as string[];
      const merged = Array.from(new Set([...aValues, ...bValues]));
      return z.enum(merged as [string, ...string[]]);
    }

    if (a._def.typeName === 'ZodObject' && b._def.typeName === 'ZodObject') {
      return this.mergeTwoSchemas(a as ZodObject<any>, b as ZodObject<any>);
    }

    if (a._def.typeName === b._def.typeName) {
      return b;
    }

    throw new Error(
      `Cannot merge incompatible schemas for field ${fieldPath}: ${a._def.typeName} vs ${b._def.typeName}`
    );
  }

  getRelations(kind: string): Record<string, RelationMapping> {
    return this.kinds.get(kind)?.relations || {};
  }
}

type KindState = {
  definition: KindDefinition;
  specExtensions: ZodObject<any>[];
  annotationExtensions: ZodObject<any>[];
  labelExtensions: ZodObject<any>[];
  relations: Record<string, RelationMapping>;
};

// ============================================================================
// 2. Relation Declarations
// ============================================================================

const registry = new CatalogModelRegistry();

registry.registerKindExtension('Component', {
  spec: (z) => z.object({
    owner: entityRef(z, { kind: ['Group', 'User'] }),
  }),
  relations: {
    'spec.owner': { forward: 'ownedBy', reverse: 'ownerOf' },
    'spec.providesApis': { forward: 'providesApi', reverse: 'apiProvidedBy' },
  },
});

// ============================================================================
// 3. CRD-style Kind Metadata
// ============================================================================

registry.registerKind({
  apiVersion: 'my-org.io/v1alpha1',
  names: {
    kind: 'Pipeline',
    singular: 'pipeline',
    plural: 'pipelines',
    shortNames: ['pl'],
  },
  description: 'A CI/CD pipeline definition',
  categories: ['ci', 'infrastructure'],
  schema: {
    spec: (z) => z.object({
      engine: z.enum(['github-actions', 'tekton', 'jenkins']).describe('Pipeline execution engine'),
      owner: entityRef(z, { kind: 'Group' }),
      triggers: z.array(z.string()).describe('Events that trigger this pipeline'),
    }),
    metadata: {
      annotations: (z) => z.object({
        'pipeline.io/last-run': z.string().describe('ISO timestamp of last run'),
      }),
      labels: (z) => z.object({
        'pipeline.io/engine': z.string().describe('The CI engine type'),
      }),
    },
  },
  relations: {
    'spec.owner': { forward: 'ownedBy', reverse: 'ownerOf' },
  },
});

// ============================================================================
// 4. Example: Define Built-in Component Kind
// ============================================================================

registry.registerKind({
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
    spec: (z) => z.object({
      type: z.string().describe('Component type such as service, website, or library'),
      lifecycle: lifecycle(z),
      owner: entityRef(z, { kind: ['Group', 'User'], description: 'Owner of the component' }),
      system: entityRef(z, { kind: 'System', description: 'System that this component belongs to' }).optional(),
      subcomponentOf: entityRef(z, { kind: 'Component', description: 'Parent component' }).optional(),
      providesApis: z.array(entityRef(z, { kind: 'API' })).optional().describe('APIs provided by this component'),
      consumesApis: z.array(entityRef(z, { kind: 'API' })).optional().describe('APIs consumed by this component'),
      dependsOn: z.array(entityRef(z, { kind: ['Component', 'Resource'] })).optional().describe('Dependencies of this component'),
      dependencyOf: z.array(entityRef(z, { kind: 'Component' })).optional().describe('Components that depend on this'),
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

registry.registerKindExtension('Component', {
  spec: (z) => z.object({
    type: z.enum(['service', 'website', 'library', 'documentation']).describe('Specific component type'),
    subtype: z.string().optional().describe('Fine-grained component classification'),
  }),
  metadata: {
    annotations: (z) => z.object({
      'my-plugin.io/team-id': z.string().describe('Internal team identifier'),
    }),
    labels: (z) => z.object({
      'my-plugin.io/tier': z.string().describe('Service tier classification'),
    }),
  },
});

// ============================================================================
// 6. Example: Plugin Creating New "Pipeline" Kind
// ============================================================================

registry.registerKind({
  apiVersion: 'ci.example.com/v1beta1',
  names: {
    kind: 'Pipeline',
    singular: 'pipeline',
    plural: 'pipelines',
    shortNames: ['pipe', 'pl'],
  },
  description: 'Represents a CI/CD pipeline that builds and deploys software',
  categories: ['ci', 'cd', 'automation'],
  schema: {
    spec: (z) => z.object({
      engine: z.enum(['github-actions', 'tekton', 'jenkins', 'gitlab-ci']).describe('Pipeline execution platform'),
      owner: entityRef(z, { kind: ['Group', 'User'], description: 'Team or user responsible for this pipeline' }),
      triggers: z.array(z.object({
        type: z.enum(['push', 'pull_request', 'schedule', 'manual']).describe('Trigger type'),
        branches: z.array(z.string()).optional().describe('Branch patterns that trigger the pipeline'),
        schedule: z.string().optional().describe('Cron expression for scheduled triggers'),
      })).describe('Events that trigger pipeline execution'),
      stages: z.array(z.object({
        name: z.string().describe('Stage name'),
        jobs: z.array(z.string()).describe('Jobs in this stage'),
      })).optional().describe('Pipeline stages'),
      environment: z.string().optional().describe('Deployment environment target'),
      repository: entityRef(z, { kind: 'Component', description: 'Source code repository' }).optional(),
    }),
    metadata: {
      annotations: (z) => z.object({
        'ci.example.com/dashboard-url': z.string().url().optional().describe('URL to pipeline dashboard'),
        'ci.example.com/config-path': z.string().optional().describe('Path to pipeline configuration file'),
      }),
    },
  },
  relations: {
    'spec.owner': { forward: 'ownedBy', reverse: 'ownerOf' },
    'spec.repository': { forward: 'buildsFrom', reverse: 'builtBy' },
  },
});

// ============================================================================
// 7. Schema Merging Demonstration
// ============================================================================

const mergeRegistry = new CatalogModelRegistry();

mergeRegistry.registerKind({
  apiVersion: 'backstage.io/v1alpha1',
  names: {
    kind: 'Component',
    singular: 'component',
    plural: 'components',
  },
  schema: {
    spec: (z) => z.object({
      owner: entityRef(z, { kind: 'Group' }),
    }),
  },
});

mergeRegistry.registerKindExtension('Component', {
  spec: (z) => z.object({
    type: z.enum(['service', 'website']).describe('Component type from Plugin A'),
  }),
});

mergeRegistry.registerKindExtension('Component', {
  spec: (z) => z.object({
    type: z.enum(['library', 'documentation']).describe('Component type from Plugin B'),
  }),
});

// ============================================================================
// 8. Serialization Output
// ============================================================================

// ============================================================================
// 9. Example: Internal Company Extension
// ============================================================================

function registerCompanyExtensions(registry: CatalogModelRegistry): void {
  registry.registerKindExtension('Component', {
    spec: (z) => z.object({
      costCenter: z.string().describe('Finance cost center code'),
      tier: z.enum(['critical', 'high', 'medium', 'low']).describe('Service tier for SLA'),
    }),
    metadata: {
      annotations: (z) => z.object({
        'company.com/slack-channel': z.string().describe('Primary Slack channel for team'),
      }),
    },
  });

  registry.registerKindExtension('API', {
    spec: (z) => z.object({
      costCenter: z.string().describe('Finance cost center code'),
    }),
    metadata: {
      annotations: (z) => z.object({
        'company.com/slack-channel': z.string().describe('Primary Slack channel for API owners'),
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
      annotations: (z) => z.object({
        'backstage.io/kubernetes-id': z.string().describe('Kubernetes app selector label'),
        'backstage.io/kubernetes-namespace': z.string().optional().describe('Kubernetes namespace'),
      }),
    },
  });
}

function registerPagerDutyPlugin(registry: CatalogModelRegistry): void {
  registry.registerKindExtension('Component', {
    metadata: {
      annotations: (z) => z.object({
        'pagerduty.com/service-id': z.string().describe('PagerDuty service identifier'),
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
    const fields: Record<string, any> = {};

    for (const [fieldName, fieldDef] of Object.entries(config.spec)) {
      if (fieldDef.type === 'enum' && fieldDef.values) {
        fields[fieldName] = z.enum(fieldDef.values as [string, ...string[]])
          .describe(fieldDef.description || '');
      } else if (fieldDef.type === 'string') {
        fields[fieldName] = z.string().describe(fieldDef.description || '');
      }
    }

    return z.object(fields);
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
  type EntityRefOptions,
  registerCompanyExtensions,
  registerKubernetesPlugin,
  registerPagerDutyPlugin,
  registerKindFromConfig,
  databaseKindConfig,
};
