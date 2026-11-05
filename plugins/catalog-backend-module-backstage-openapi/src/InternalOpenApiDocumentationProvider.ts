/*
 * Copyright 2023 The Backstage Authors
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
import yaml from 'yaml';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  type ApiEntity,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { merge, isErrorResult } from 'openapi-merge';
import { getOpenApiSpecRoute } from '@backstage/backend-openapi-utils';
import type {
  OpenAPIObject,
  OperationObject,
  PathItemObject,
} from 'openapi3-ts';
import fetch from 'cross-fetch';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
  RootSystemMetadataService,
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import { randomUUID } from 'node:crypto';
import lodash from 'lodash';

const HTTP_VERBS: (keyof PathItemObject)[] = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'trace',
  'options',
  'head',
];

const addTagsToSpec = (spec: OpenAPIObject, tag: string) => {
  Object.values(spec?.paths).forEach((path: PathItemObject) => {
    HTTP_VERBS.forEach(verb => {
      if (verb in path) {
        if (!('tags' in path[verb])) {
          (path[verb] as OperationObject).tags = [];
        }
        if (!(path[verb] as OperationObject).tags?.includes(tag)) {
          (path[verb] as OperationObject).tags?.push(tag);
        }
      }
    });
  });
};

/**
 * The OpenAPI major.minor the aggregator seeds the merge with and keeps the
 * merged document declaring. Plugins contributing specs on a different
 * major.minor are skipped (see {@link partitionByVersion}) because
 * `openapi-merge@2` refuses to merge mixed versions.
 */
const SEED_OPENAPI_VERSION = '3.1.0';

const toMinor = (openapi: string | undefined): string | undefined => {
  if (!openapi) return undefined;
  const match = /^(\d+)\.(\d+)\./.exec(openapi);
  return match ? `${match[1]}.${match[2]}` : undefined;
};

/**
 * Keep only the specs whose declared OpenAPI major.minor matches the seed;
 * surface the rest to the caller so each one can be logged by name.
 */
const partitionByVersion = <T extends { spec: OpenAPIObject }>(
  entries: T[],
  seedMinor: string,
): {
  kept: T[];
  skipped: Array<T & { declaredVersion: string | undefined }>;
} => {
  const kept: T[] = [];
  const skipped: Array<T & { declaredVersion: string | undefined }> = [];
  for (const entry of entries) {
    const declared = entry.spec.openapi;
    if (toMinor(declared) === seedMinor) {
      kept.push(entry);
    } else {
      skipped.push({ ...entry, declaredVersion: declared });
    }
  }
  return { kept, skipped };
};

/**
 * Collect every plugin that defines a given `components.securitySchemes` entry
 * so a conflict can be reported with the plugin ids involved rather than only
 * the opaque input indices `openapi-merge` surfaces.
 */
const findContributingPlugins = (
  specs: Array<{ pluginId: string; spec: OpenAPIObject }>,
  schemeName: string,
): string[] => {
  return specs
    .filter(e => e.spec.components?.securitySchemes?.[schemeName] !== undefined)
    .map(e => e.pluginId);
};

// openapi-merge@2 reports conflicts as:
//   Input N: the security scheme 'NAME' is already defined differently ...
const SECURITY_SCHEME_CONFLICT_RE = /security scheme ['"]([^'"]+)['"]/;

const mergeSpecs = async ({
  baseUrl,
  specs,
  logger,
}: {
  baseUrl: string;
  specs: Array<{ pluginId: string; spec: OpenAPIObject }>;
  logger: LoggerService;
}) => {
  const seedMinor = toMinor(SEED_OPENAPI_VERSION)!;
  const { kept, skipped } = partitionByVersion(specs, seedMinor);
  for (const entry of skipped) {
    const declared = entry.declaredVersion;
    const describedVersion =
      declared === undefined
        ? 'no OpenAPI version'
        : `an unsupported OpenAPI version '${declared}'`;
    logger.error(
      `Skipping plugin=${entry.pluginId}: its spec declares ${describedVersion} ` +
        `but the aggregator merges on ${seedMinor}.x. ` +
        `Convert the spec to ${seedMinor} to include it.`,
    );
  }

  const mergeResult = merge(
    [
      // Add the full API information as the first item for other items to merge against it with.
      {
        oas: {
          openapi: SEED_OPENAPI_VERSION,
          info: {
            title: 'Backstage API',
            version: '1',
          },
          servers: [{ url: baseUrl }],
          paths: {},
        },
      },
      // For each plugin whose spec version matched the seed, forward its spec.
      // Setting `dispute.prefix` per input lets `openapi-merge` resolve
      // non-security component conflicts (e.g. two plugins each declaring a
      // `components.schemas.Config` with different shapes) by renaming the
      // losing input's entry with that plugin's id as a prefix and rewriting
      // any internal `$ref`s to match. Security scheme conflicts stay strict
      // because operations reference them by name externally; see
      // `securitySchemesStrategy: 'error'` below.
      ...kept.map(
        ({ pluginId, spec }) =>
          ({
            oas: spec,
            dispute: { prefix: `${pluginId}-` },
            // Weird typing differences between this package and the client package's openapi 3.
          } as any),
      ),
    ],
    {
      // Fail loudly when two plugins define the same `securitySchemes` name
      // with different shapes, rather than silently renaming one of them
      // via the default `'merge'` dispute-prefix behaviour. See the
      // "OpenAPI spec conventions" section of this plugin's docs for the
      // conventions plugin authors are expected to follow.
      securitySchemesStrategy: 'error',
    },
  );

  if (isErrorResult(mergeResult)) {
    // When the conflict is on `components.securitySchemes`, enrich the error
    // with the plugin ids that contributed the colliding entry so the
    // operator does not have to map opaque input indices back to plugins.
    const schemeMatch = SECURITY_SCHEME_CONFLICT_RE.exec(mergeResult.message);
    if (mergeResult.type === 'component-definition-conflict' && schemeMatch) {
      const schemeName = schemeMatch[1];
      const contributors = findContributingPlugins(kept, schemeName);
      throw new ForwardedError(
        `Conflicting \`components.securitySchemes.${schemeName}\` ` +
          `definitions from plugins: ${contributors.join(', ')}. ` +
          `${mergeResult.message} (${mergeResult.type})`,
        mergeResult as unknown as Error,
      );
    }
    throw new ForwardedError(
      `${mergeResult.message} (${mergeResult.type})`,
      mergeResult as unknown as Error,
    );
  } else {
    return mergeResult.output;
  }
};

const loadSpecs = async ({
  baseUrl,
  discovery,
  plugins,
  logger,
  auth,
}: {
  baseUrl: string;
  plugins: string[];
  discovery: DiscoveryService;
  logger: LoggerService;
  auth: AuthService;
}) => {
  const specs: Array<{ pluginId: string; spec: OpenAPIObject }> = [];
  for (const pluginId of plugins) {
    const url = await discovery.getBaseUrl(pluginId);
    const openApiUrl = getOpenApiSpecRoute(url);
    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: await auth.getOwnServiceCredentials(),
      targetPluginId: pluginId,
    });
    const response = await fetch(openApiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const spec = await response.json();
      addTagsToSpec(spec, pluginId);
      specs.push({ pluginId, spec });
    } else if (response.status === 404) {
      logger.error(
        `Plugin=${pluginId} does not have an OpenAPI spec at '${openApiUrl}'.`,
      );
    } else {
      logger.error(
        `Failed to load spec for plugin=${pluginId} at ${openApiUrl}. Error (${
          response.status
        }): ${response.body ? await response.text() : response.statusText}`,
      );
    }
  }
  return mergeSpecs({ baseUrl, specs, logger });
};

const formatDefinition = (
  definition: any,
  format: string | 'json' | 'yaml',
) => {
  if (format === 'json') {
    return JSON.stringify(definition, null, 2);
  }
  if (format === 'yaml') {
    return yaml.stringify(definition);
  }
  throw new Error(`Unsupported format type: ${format}`);
};

export class InternalOpenApiDocumentationProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private readonly scheduleFn: () => Promise<void>;
  public readonly config: Config;
  public readonly discovery: DiscoveryService;
  public readonly logger: LoggerService;
  public readonly auth: AuthService;
  public readonly rootSystemMetadata: RootSystemMetadataService;

  constructor(
    config: Config,
    discovery: DiscoveryService,
    logger: LoggerService,
    auth: AuthService,
    rootSystemMetadata: RootSystemMetadataService,
    taskRunner: SchedulerServiceTaskRunner,
  ) {
    this.config = config;
    this.discovery = discovery;
    this.logger = logger;
    this.auth = auth;
    this.rootSystemMetadata = rootSystemMetadata;
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  static fromConfig(
    config: Config,
    options: {
      discovery: DiscoveryService;
      logger: LoggerService;
      schedule: SchedulerService;
      auth: AuthService;
      rootSystemMetadata: RootSystemMetadataService;
    },
  ) {
    const taskRunner = options.schedule.createScheduledTaskRunner({
      frequency: {
        minutes: 1,
      },
      timeout: {
        minutes: 1,
      },
    });
    return new InternalOpenApiDocumentationProvider(
      config,
      options.discovery,
      options.logger,
      options.auth,
      options.rootSystemMetadata,
      taskRunner,
    );
  }
  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName() {
    return `InternalOpenApiDocumentationProvider`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
    return await this.scheduleFn();
  }

  private createScheduleFn(
    taskRunner: SchedulerServiceTaskRunner,
  ): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          const logger = this.logger.child({
            class:
              InternalOpenApiDocumentationProvider.prototype.constructor.name,
            taskId,
            taskInstanceId: randomUUID(),
          });
          await this.refresh(logger);
        },
      });
    };
  }

  async refresh(logger: LoggerService) {
    const explicitPlugins = this.config.getOptionalStringArray(
      'catalog.providers.backstageOpenapi.plugins',
    );
    const pluginsToMerge = Array.from(
      new Set(
        explicitPlugins ??
          (await this.rootSystemMetadata.getInstalledPlugins()).map(
            p => p.pluginId,
          ),
      ),
    );
    const configToMerge = this.config.getOptional(
      'catalog.providers.backstageOpenapi.entityOverrides',
    );
    const formatConfig =
      this.config.getOptionalString(
        'catalog.providers.backstageOpenapi.definitionFormat',
      ) ?? 'json';

    const baseConfig = {
      metadata: {
        name: 'internal_backstage_openapi_doc',
        title: 'Backstage API',
      },
      spec: {
        lifecycle: 'production',
        owner: 'backstage',
      },
    };

    logger.info(`Loading specs from ${pluginsToMerge}.`);
    const requiredConfig = {
      apiVersion: 'backstage.io/v1beta1',
      kind: 'API',
      metadata: {
        annotations: {
          [ANNOTATION_LOCATION]:
            'internal-package:@backstage/plugin-catalog-backend-module-backstage-openapi',
          [ANNOTATION_ORIGIN_LOCATION]:
            'internal-package:@backstage/plugin-catalog-backend-module-backstage-openapi',
        },
      },
      spec: {
        type: 'openapi',
        definition: formatDefinition(
          await loadSpecs({
            baseUrl: this.config.getString('backend.baseUrl'),
            discovery: this.discovery,
            auth: this.auth,
            plugins: pluginsToMerge,
            logger,
          }),
          formatConfig,
        ),
      },
    };

    // Overwrite baseConfig with options from config file.
    const mergedConfig = lodash.merge(baseConfig, configToMerge);

    // Overwrite mergedConfig with requiredConfig (i.e., spec.type and spec.definition) to avoid bad configuration.
    const documentationEntity = lodash.merge(
      mergedConfig,
      requiredConfig,
    ) as ApiEntity;

    await this.connection?.applyMutation({
      type: 'full',
      entities: [
        {
          entity: documentationEntity,
          locationKey: 'internal-api-doc',
        },
      ],
    });
  }
}
