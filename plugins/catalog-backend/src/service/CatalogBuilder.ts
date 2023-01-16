/*
 * Copyright 2020 The Backstage Authors
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

import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import {
  DefaultNamespaceEntityPolicy,
  Entity,
  EntityPolicies,
  EntityPolicy,
  FieldFormatEntityPolicy,
  makeValidator,
  NoForeignRootFieldsEntityPolicy,
  parseEntityRef,
  SchemaValidEntityPolicy,
  stringifyEntityRef,
  Validators,
} from '@backstage/catalog-model';
import { ScmIntegrations } from '@backstage/integration';
import { createHash } from 'crypto';
import { Router } from 'express';
import lodash, { keyBy } from 'lodash';

import {
  CatalogProcessor,
  CatalogProcessorParser,
  EntityProvider,
} from '@backstage/plugin-catalog-node';
import {
  AnnotateLocationEntityProcessor,
  BuiltinKindsEntityProcessor,
  CodeOwnersProcessor,
  FileReaderProcessor,
  PlaceholderProcessor,
  PlaceholderResolver,
  UrlReaderProcessor,
} from '../modules';
import { ConfigLocationEntityProvider } from '../modules/core/ConfigLocationEntityProvider';
import { DefaultLocationStore } from '../modules/core/DefaultLocationStore';
import { RepoLocationAnalyzer } from '../ingestion/LocationAnalyzer';
import {
  jsonPlaceholderResolver,
  textPlaceholderResolver,
  yamlPlaceholderResolver,
} from '../modules/core/PlaceholderProcessor';
import { defaultEntityDataParser } from '../modules/util/parse';
import { LocationAnalyzer, ScmLocationAnalyzer } from '../ingestion/types';
import { CatalogProcessingEngine } from '../processing';
import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { applyDatabaseMigrations } from '../database/migrations';
import { DefaultCatalogProcessingEngine } from '../processing/DefaultCatalogProcessingEngine';
import { DefaultLocationService } from './DefaultLocationService';
import { DefaultEntitiesCatalog } from './DefaultEntitiesCatalog';
import { DefaultCatalogProcessingOrchestrator } from '../processing/DefaultCatalogProcessingOrchestrator';
import { Stitcher } from '../stitching/Stitcher';
import {
  createRandomProcessingInterval,
  ProcessingIntervalFunction,
} from '../processing/refresh';
import { createRouter } from './createRouter';
import { DefaultRefreshService } from './DefaultRefreshService';
import { AuthorizedRefreshService } from './AuthorizedRefreshService';
import { DefaultCatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { connectEntityProviders } from '../processing/connectEntityProviders';
import { PermissionRuleParams } from '@backstage/plugin-permission-common';
import { EntitiesSearchFilter } from '../catalog/types';
import { permissionRules as catalogPermissionRules } from '../permissions/rules';
import { PermissionRule } from '@backstage/plugin-permission-node';
import {
  PermissionAuthorizer,
  PermissionEvaluator,
  toPermissionEvaluator,
} from '@backstage/plugin-permission-common';
import {
  createConditionTransformer,
  createPermissionIntegrationRouter,
} from '@backstage/plugin-permission-node';
import { AuthorizedEntitiesCatalog } from './AuthorizedEntitiesCatalog';
import { basicEntityFilter } from './request/basicEntityFilter';
import {
  catalogPermissions,
  RESOURCE_TYPE_CATALOG_ENTITY,
} from '@backstage/plugin-catalog-common/alpha';
import { AuthorizedLocationService } from './AuthorizedLocationService';
import { DefaultProviderDatabase } from '../database/DefaultProviderDatabase';
import { DefaultCatalogDatabase } from '../database/DefaultCatalogDatabase';

/**
 * This is a duplicate of the alpha `CatalogPermissionRule` type, for use in the stable API.
 *
 * @public
 */
export type CatalogPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<Entity, EntitiesSearchFilter, 'catalog-entity', TParams>;

/** @public */
export type CatalogEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  reader: UrlReader;
  permissions: PermissionEvaluator | PermissionAuthorizer;
};

/**
 * A builder that helps wire up all of the component parts of the catalog.
 *
 * The touch points where you can replace or extend behavior are as follows:
 *
 * - Entity policies can be added or replaced. These are automatically run
 *   after the processors' pre-processing steps. All policies are given the
 *   chance to inspect the entity, and all of them have to pass in order for
 *   the entity to be considered valid from an overall point of view.
 * - Location analyzers can be added. These are responsible for analyzing
 *   repositories when onboarding them into the catalog, by finding
 *   catalog-info.yaml files and other artifacts that can help automatically
 *   register or create catalog data on the user's behalf.
 * - Placeholder resolvers can be replaced or added. These run on the raw
 *   structured data between the parsing and pre-processing steps, to replace
 *   dollar-prefixed entries with their actual values (like $file).
 * - Field format validators can be replaced. These check the format of
 *   individual core fields such as metadata.name, to ensure that they adhere
 *   to certain rules.
 * - Processors can be added or replaced. These implement the functionality of
 *   reading, parsing, validating, and processing the entity data before it is
 *   persisted in the catalog.
 *
 * @public
 */
export class CatalogBuilder {
  private readonly env: CatalogEnvironment;
  private entityPolicies: EntityPolicy[];
  private entityPoliciesReplace: boolean;
  private placeholderResolvers: Record<string, PlaceholderResolver>;
  private fieldFormatValidators: Partial<Validators>;
  private entityProviders: EntityProvider[];
  private processors: CatalogProcessor[];
  private locationAnalyzers: ScmLocationAnalyzer[];
  private processorsReplace: boolean;
  private parser: CatalogProcessorParser | undefined;
  private onProcessingError?: (event: {
    unprocessedEntity: Entity;
    errors: Error[];
  }) => Promise<void> | void;
  private processingInterval: ProcessingIntervalFunction =
    createRandomProcessingInterval({
      minSeconds: 100,
      maxSeconds: 150,
    });
  private locationAnalyzer: LocationAnalyzer | undefined = undefined;
  private readonly permissionRules: CatalogPermissionRuleInput[];
  private allowedLocationType: string[];
  private legacySingleProcessorValidation = false;

  /**
   * Creates a catalog builder.
   */
  static create(env: CatalogEnvironment): CatalogBuilder {
    return new CatalogBuilder(env);
  }

  private constructor(env: CatalogEnvironment) {
    this.env = env;
    this.entityPolicies = [];
    this.entityPoliciesReplace = false;
    this.placeholderResolvers = {};
    this.fieldFormatValidators = {};
    this.entityProviders = [];
    this.processors = [];
    this.locationAnalyzers = [];
    this.processorsReplace = false;
    this.parser = undefined;
    this.permissionRules = Object.values(catalogPermissionRules);
    this.allowedLocationType = ['url'];
  }

  /**
   * Adds policies that are used to validate entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link CatalogBuilder#setFieldFormatValidators} instead.
   *
   * @param policies - One or more policies
   */
  addEntityPolicy(
    ...policies: Array<EntityPolicy | Array<EntityPolicy>>
  ): CatalogBuilder {
    this.entityPolicies.push(...policies.flat());
    return this;
  }

  /**
   * Processing interval determines how often entities should be processed.
   * Seconds provided will be multiplied by 1.5
   * The default processing interval is 100-150 seconds.
   * setting this too low will potentially deplete request quotas to upstream services.
   */
  setProcessingIntervalSeconds(seconds: number): CatalogBuilder {
    this.processingInterval = createRandomProcessingInterval({
      minSeconds: seconds,
      maxSeconds: seconds * 1.5,
    });
    return this;
  }

  /**
   * Overwrites the default processing interval function used to spread
   * entity updates in the catalog.
   */
  setProcessingInterval(
    processingInterval: ProcessingIntervalFunction,
  ): CatalogBuilder {
    this.processingInterval = processingInterval;
    return this;
  }

  /**
   * Overwrites the default location analyzer.
   */
  setLocationAnalyzer(locationAnalyzer: LocationAnalyzer): CatalogBuilder {
    this.locationAnalyzer = locationAnalyzer;
    return this;
  }

  /**
   * Sets what policies to use for validation of entities between the pre-
   * processing and post-processing stages. All such policies must pass for the
   * entity to be considered valid.
   *
   * If what you want to do is to replace the rules for what format is allowed
   * in various core entity fields (such as metadata.name), you may want to use
   * {@link CatalogBuilder#setFieldFormatValidators} instead.
   *
   * This function replaces the default set of policies; use with care.
   *
   * @param policies - One or more policies
   */
  replaceEntityPolicies(policies: EntityPolicy[]): CatalogBuilder {
    this.entityPolicies = [...policies];
    this.entityPoliciesReplace = true;
    return this;
  }

  /**
   * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
   * definition files.
   *
   * @param key - The key that identifies the placeholder, e.g. "file"
   * @param resolver - The resolver that gets values for this placeholder
   */
  setPlaceholderResolver(
    key: string,
    resolver: PlaceholderResolver,
  ): CatalogBuilder {
    this.placeholderResolvers[key] = resolver;
    return this;
  }

  /**
   * Sets the validator function to use for one or more special fields of an
   * entity. This is useful if the default rules for formatting of fields are
   * not sufficient.
   *
   * This function has no effect if used together with
   * {@link CatalogBuilder#replaceEntityPolicies}.
   *
   * @param validators - The (subset of) validators to set
   */
  setFieldFormatValidators(validators: Partial<Validators>): CatalogBuilder {
    lodash.merge(this.fieldFormatValidators, validators);
    return this;
  }

  /**
   * Adds or replaces entity providers. These are responsible for bootstrapping
   * the list of entities out of original data sources. For example, there is
   * one entity source for the config locations, and one for the database
   * stored locations. If you ingest entities out of a third party system, you
   * may want to implement that in terms of an entity provider as well.
   *
   * @param providers - One or more entity providers
   */
  addEntityProvider(
    ...providers: Array<EntityProvider | Array<EntityProvider>>
  ): CatalogBuilder {
    this.entityProviders.push(...providers.flat());
    return this;
  }

  /**
   * Adds entity processors. These are responsible for reading, parsing, and
   * processing entities before they are persisted in the catalog.
   *
   * @param processors - One or more processors
   */
  addProcessor(
    ...processors: Array<CatalogProcessor | Array<CatalogProcessor>>
  ): CatalogBuilder {
    this.processors.push(...processors.flat());
    return this;
  }

  /**
   * Sets what entity processors to use. These are responsible for reading,
   * parsing, and processing entities before they are persisted in the catalog.
   *
   * This function replaces the default set of processors, consider using with
   * {@link CatalogBuilder#getDefaultProcessors}; use with care.
   *
   * @param processors - One or more processors
   */
  replaceProcessors(processors: CatalogProcessor[]): CatalogBuilder {
    this.processors = [...processors];
    this.processorsReplace = true;
    return this;
  }

  /**
   * Returns the default list of entity processors. These are responsible for reading,
   * parsing, and processing entities before they are persisted in the catalog. Changing
   * the order of processing can give more control to custom processors.
   *
   * Consider using with {@link CatalogBuilder#replaceProcessors}
   *
   */
  getDefaultProcessors(): CatalogProcessor[] {
    const { config, logger, reader } = this.env;
    const integrations = ScmIntegrations.fromConfig(config);

    return [
      new FileReaderProcessor(),
      new UrlReaderProcessor({ reader, logger }),
      CodeOwnersProcessor.fromConfig(config, { logger, reader }),
      new AnnotateLocationEntityProcessor({ integrations }),
    ];
  }

  /**
   * Adds Location Analyzers. These are responsible for analyzing
   * repositories when onboarding them into the catalog, by finding
   * catalog-info.yaml files and other artifacts that can help automatically
   * register or create catalog data on the user's behalf.
   *
   * @param locationAnalyzers - One or more location analyzers
   */
  addLocationAnalyzers(
    ...analyzers: Array<ScmLocationAnalyzer | Array<ScmLocationAnalyzer>>
  ): CatalogBuilder {
    this.locationAnalyzers.push(...analyzers.flat());
    return this;
  }

  /**
   * Sets up the catalog to use a custom parser for entity data.
   *
   * This is the function that gets called immediately after some raw entity
   * specification data has been read from a remote source, and needs to be
   * parsed and emitted as structured data.
   *
   * @param parser - The custom parser
   */
  setEntityDataParser(parser: CatalogProcessorParser): CatalogBuilder {
    this.parser = parser;
    return this;
  }

  /**
   * Adds additional permission rules. Permission rules are used to evaluate
   * catalog resources against queries. See
   * {@link @backstage/plugin-permission-node#PermissionRule}.
   *
   * @param permissionRules - Additional permission rules
   */
  addPermissionRules(
    ...permissionRules: Array<
      CatalogPermissionRuleInput | Array<CatalogPermissionRuleInput>
    >
  ) {
    this.permissionRules.push(...permissionRules.flat());
    return this;
  }

  /**
   * Sets up the allowed location types from being registered via the location service.
   *
   * @param allowedLocationTypes - the allowed location types
   */
  setAllowedLocationTypes(allowedLocationTypes: string[]): CatalogBuilder {
    this.allowedLocationType = allowedLocationTypes;
    return this;
  }

  /**
   * Enables the legacy behaviour of canceling validation early whenever only a
   * single processor declares an entity kind to be valid.
   */
  useLegacySingleProcessorValidation(): this {
    this.legacySingleProcessorValidation = true;
    return this;
  }

  /**
   * Wires up and returns all of the component parts of the catalog
   */
  async build(): Promise<{
    processingEngine: CatalogProcessingEngine;
    router: Router;
  }> {
    const { config, database, logger, permissions } = this.env;

    const policy = this.buildEntityPolicy();
    const processors = this.buildProcessors();
    const parser = this.parser || defaultEntityDataParser;

    const dbClient = await database.getClient();
    if (!database.migrations?.skip) {
      logger.info('Performing database migration');
      await applyDatabaseMigrations(dbClient);
    }

    const processingDatabase = new DefaultProcessingDatabase({
      database: dbClient,
      logger,
      refreshInterval: this.processingInterval,
    });
    const providerDatabase = new DefaultProviderDatabase({
      database: dbClient,
      logger,
    });
    const catalogDatabase = new DefaultCatalogDatabase({
      database: dbClient,
      logger,
    });
    const integrations = ScmIntegrations.fromConfig(config);
    const rulesEnforcer = DefaultCatalogRulesEnforcer.fromConfig(config);
    const orchestrator = new DefaultCatalogProcessingOrchestrator({
      processors,
      integrations,
      rulesEnforcer,
      logger,
      parser,
      policy,
      legacySingleProcessorValidation: this.legacySingleProcessorValidation,
    });
    const stitcher = new Stitcher(dbClient, logger);
    const unauthorizedEntitiesCatalog = new DefaultEntitiesCatalog(
      dbClient,
      stitcher,
    );

    let permissionEvaluator: PermissionEvaluator;
    if ('authorizeConditional' in permissions) {
      permissionEvaluator = permissions as PermissionEvaluator;
    } else {
      logger.warn(
        'PermissionAuthorizer is deprecated. Please use an instance of PermissionEvaluator instead of PermissionAuthorizer in PluginEnvironment#permissions',
      );
      permissionEvaluator = toPermissionEvaluator(permissions);
    }

    const entitiesCatalog = new AuthorizedEntitiesCatalog(
      unauthorizedEntitiesCatalog,
      permissionEvaluator,
      createConditionTransformer(this.permissionRules),
    );
    const permissionIntegrationRouter = createPermissionIntegrationRouter({
      resourceType: RESOURCE_TYPE_CATALOG_ENTITY,
      getResources: async (resourceRefs: string[]) => {
        const { entities } = await unauthorizedEntitiesCatalog.entities({
          filter: {
            anyOf: resourceRefs.map(resourceRef => {
              const { kind, namespace, name } = parseEntityRef(resourceRef);

              return basicEntityFilter({
                kind,
                'metadata.namespace': namespace,
                'metadata.name': name,
              });
            }),
          },
        });

        const entitiesByRef = keyBy(entities, stringifyEntityRef);

        return resourceRefs.map(
          resourceRef =>
            entitiesByRef[stringifyEntityRef(parseEntityRef(resourceRef))],
        );
      },
      permissions: catalogPermissions,
      rules: this.permissionRules,
    });

    const locationStore = new DefaultLocationStore(dbClient);
    const configLocationProvider = new ConfigLocationEntityProvider(config);
    const entityProviders = lodash.uniqBy(
      [...this.entityProviders, locationStore, configLocationProvider],
      provider => provider.getProviderName(),
    );

    const processingEngine = new DefaultCatalogProcessingEngine(
      logger,
      processingDatabase,
      orchestrator,
      stitcher,
      () => createHash('sha1'),
      1000,
      event => {
        this.onProcessingError?.(event);
      },
    );

    const locationAnalyzer =
      this.locationAnalyzer ??
      new RepoLocationAnalyzer(logger, integrations, this.locationAnalyzers);
    const locationService = new AuthorizedLocationService(
      new DefaultLocationService(locationStore, orchestrator, {
        allowedLocationTypes: this.allowedLocationType,
      }),
      permissionEvaluator,
    );
    const refreshService = new AuthorizedRefreshService(
      new DefaultRefreshService({ database: catalogDatabase }),
      permissionEvaluator,
    );
    const router = await createRouter({
      entitiesCatalog,
      locationAnalyzer,
      locationService,
      orchestrator,
      refreshService,
      logger,
      config,
      permissionIntegrationRouter,
    });

    await connectEntityProviders(providerDatabase, entityProviders);

    return {
      processingEngine,
      router,
    };
  }

  subscribe(options: {
    onProcessingError: (event: {
      unprocessedEntity: Entity;
      errors: Error[];
    }) => Promise<void> | void;
  }) {
    this.onProcessingError = options.onProcessingError;
  }

  private buildEntityPolicy(): EntityPolicy {
    const entityPolicies: EntityPolicy[] = this.entityPoliciesReplace
      ? [new SchemaValidEntityPolicy(), ...this.entityPolicies]
      : [
          new SchemaValidEntityPolicy(),
          new DefaultNamespaceEntityPolicy(),
          new NoForeignRootFieldsEntityPolicy(),
          new FieldFormatEntityPolicy(
            makeValidator(this.fieldFormatValidators),
          ),
          ...this.entityPolicies,
        ];

    return EntityPolicies.allOf(entityPolicies);
  }

  private buildProcessors(): CatalogProcessor[] {
    const { config, reader } = this.env;
    const integrations = ScmIntegrations.fromConfig(config);

    this.checkDeprecatedReaderProcessors();

    const placeholderResolvers: Record<string, PlaceholderResolver> = {
      json: jsonPlaceholderResolver,
      yaml: yamlPlaceholderResolver,
      text: textPlaceholderResolver,
      ...this.placeholderResolvers,
    };

    // These are always there no matter what
    const processors: CatalogProcessor[] = [
      new PlaceholderProcessor({
        resolvers: placeholderResolvers,
        reader,
        integrations,
      }),
      new BuiltinKindsEntityProcessor(),
    ];

    // These are only added unless the user replaced them all
    if (!this.processorsReplace) {
      processors.push(...this.getDefaultProcessors());
    }

    // Add the ones (if any) that the user added
    processors.push(...this.processors);

    this.checkMissingExternalProcessors(processors);

    return processors;
  }

  // TODO(Rugvip): These old processors are removed, for a while we'll be throwing
  //               errors here to make sure people know where to move the config
  private checkDeprecatedReaderProcessors() {
    const pc = this.env.config.getOptionalConfig('catalog.processors');
    if (pc?.has('github')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.github, move to using integrations.github instead`,
      );
    }
    if (pc?.has('gitlabApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.gitlabApi, move to using integrations.gitlab instead`,
      );
    }
    if (pc?.has('bitbucketApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.bitbucketApi, move to using integrations.bitbucket instead`,
      );
    }
    if (pc?.has('azureApi')) {
      throw new Error(
        `Using deprecated configuration for catalog.processors.azureApi, move to using integrations.azure instead`,
      );
    }
  }

  // TODO(freben): This can be removed no sooner than June 2022, after adopters have had some time to adapt to the new package structure
  private checkMissingExternalProcessors(processors: CatalogProcessor[]) {
    const skipCheckVarName = 'BACKSTAGE_CATALOG_SKIP_MISSING_PROCESSORS_CHECK';
    if (process.env[skipCheckVarName]) {
      return;
    }

    const locationTypes = new Set(
      this.env.config
        .getOptionalConfigArray('catalog.locations')
        ?.map(l => l.getString('type')) ?? [],
    );
    const processorNames = new Set(processors.map(p => p.getProcessorName()));

    function check(
      locationType: string,
      processorName: string,
      installationUrl: string,
    ) {
      if (
        locationTypes.has(locationType) &&
        !processorNames.has(processorName)
      ) {
        throw new Error(
          [
            `Your config contains a "catalog.locations" entry of type ${locationType},`,
            `but does not have the corresponding catalog processor ${processorName} installed.`,
            `This processor used to be built into the catalog itself, but is now moved to an`,
            `external module that has to be installed manually. Please follow the installation`,
            `instructions at ${installationUrl} if you are using this ability, or remove the`,
            `location from your app config if you do not. You can also silence this check entirely`,
            `by setting the environment variable ${skipCheckVarName} to 'true'.`,
          ].join(' '),
        );
      }
    }

    check(
      'aws-cloud-accounts',
      'AwsOrganizationCloudAccountProcessor',
      'https://backstage.io/docs/integrations',
    );
    check(
      's3-discovery',
      'AwsS3DiscoveryProcessor',
      'https://backstage.io/docs/integrations/aws-s3/discovery',
    );
    check(
      'azure-discovery',
      'AzureDevOpsDiscoveryProcessor',
      'https://backstage.io/docs/integrations/azure/discovery',
    );
    check(
      'bitbucket-discovery',
      'BitbucketDiscoveryProcessor',
      'https://backstage.io/docs/integrations/bitbucket/discovery',
    );
    check(
      'github-discovery',
      'GithubDiscoveryProcessor',
      'https://backstage.io/docs/integrations/github/discovery',
    );
    check(
      'github-org',
      'GithubOrgReaderProcessor',
      'https://backstage.io/docs/integrations/github/org',
    );
    check(
      'gitlab-discovery',
      'GitLabDiscoveryProcessor',
      'https://backstage.io/docs/integrations/gitlab/discovery',
    );
    check(
      'ldap-org',
      'LdapOrgReaderProcessor',
      'https://backstage.io/docs/integrations/ldap/org',
    );
    check(
      'microsoft-graph-org',
      'MicrosoftGraphOrgReaderProcessor',
      'https://backstage.io/docs/integrations/azure/org',
    );
  }
}
