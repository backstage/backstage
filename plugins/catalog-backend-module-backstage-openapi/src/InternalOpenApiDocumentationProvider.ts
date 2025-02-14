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
  SchedulerService,
  SchedulerServiceTaskRunner,
} from '@backstage/backend-plugin-api';
import * as uuid from 'uuid';
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

const mergeSpecs = async ({
  baseUrl,
  specs,
}: {
  baseUrl: string;
  specs: OpenAPIObject[];
}) => {
  const mergeResult = merge([
    // Add the full API information as the first item for other items to merge against it with.
    {
      oas: {
        openapi: '3.0.3',
        info: {
          title: 'Backstage API',
          version: '1',
        },
        servers: [{ url: baseUrl }],
        paths: {},
      },
    },
    // For each plugin, load its spec and the known endpoint that it sits under.
    ...specs.map(
      spec =>
        ({
          oas: spec,
          // Weird typing differences between this package and the client package's openapi 3.
        } as any),
    ),
  ]);

  if (isErrorResult(mergeResult)) {
    throw new ForwardedError(
      `${mergeResult.message} (${mergeResult.type})`,
      mergeResult,
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
  const specs: OpenAPIObject[] = [];
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
      specs.push(spec);
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
  return mergeSpecs({ baseUrl, specs });
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

  constructor(
    public readonly config: Config,
    public readonly discovery: DiscoveryService,
    public readonly logger: LoggerService,
    public readonly auth: AuthService,
    taskRunner: SchedulerServiceTaskRunner,
  ) {
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  static fromConfig(
    config: Config,
    options: {
      discovery: DiscoveryService;
      logger: LoggerService;
      schedule: SchedulerService;
      auth: AuthService;
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
            taskInstanceId: uuid.v4(),
          });
          try {
            await this.refresh(logger);
          } catch (error) {
            logger.error(`${this.getProviderName()} refresh failed`, error);
          }
        },
      });
    };
  }

  async refresh(logger: LoggerService) {
    const pluginsToMerge = this.config.getStringArray(
      'catalog.providers.backstageOpenapi.plugins',
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

    // Overwite mergedConfig with requiredConfig (i.e., spec.type and spec.definition) to avoid bad configuration.
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
