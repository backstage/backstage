/*
 * Copyright 2020 Spotify AB
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
  apiEntityV1alpha1Policy,
  componentEntityV1alpha1Policy,
  DefaultNamespaceEntityPolicy,
  EntityPolicies,
  EntityPolicy,
  FieldFormatEntityPolicy,
  groupEntityV1alpha1Policy,
  locationEntityV1alpha1Policy,
  makeValidator,
  NoForeignRootFieldsEntityPolicy,
  ReservedFieldsEntityPolicy,
  SchemaValidEntityPolicy,
  templateEntityV1alpha1Policy,
  userEntityV1alpha1Policy,
  Validators,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import lodash from 'lodash';
import { Logger } from 'winston';
import {
  DatabaseEntitiesCatalog,
  DatabaseLocationsCatalog,
  EntitiesCatalog,
  LocationsCatalog,
} from '../catalog';
import { DatabaseManager } from '../database';
import {
  AnnotateLocationEntityProcessor,
  AzureApiReaderProcessor,
  BitbucketApiReaderProcessor,
  CatalogProcessor,
  CodeOwnersProcessor,
  EntityPolicyProcessor,
  FileReaderProcessor,
  GithubOrgReaderProcessor,
  GithubReaderProcessor,
  GitlabApiReaderProcessor,
  GitlabReaderProcessor,
  HigherOrderOperation,
  HigherOrderOperations,
  LocationReaders,
  LocationRefProcessor,
  PlaceholderProcessor,
  PlaceholderResolver,
  StaticLocationProcessor,
  UrlReaderProcessor,
  YamlProcessor,
} from '../ingestion';
import { CatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { LdapOrgReaderProcessor } from '../ingestion/processors/LdapOrgReaderProcessor';
import {
  jsonPlaceholderResolver,
  textPlaceholderResolver,
  yamlPlaceholderResolver,
} from '../ingestion/processors/PlaceholderProcessor';

export type CatalogEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  config: Config;
  reader: UrlReader;
};

/**
 * A builder that helps wire up all of the component parts of the catalog.
 *
 * The touch points where you can replace or extend behavior are as follows:
 *
 * - Reader processors can be added or replaced. These implement the
 *   functionality of reading raw data from a location, in the form of an
 *   entity definition file.
 * - Parser processors can be added or replaced. These accept the raw data as
 *   read by the previous processors and parse it into raw structured data
 *   (for example, from a binary buffer containing yaml text, to a JS object
 *   structure).
 * - Placeholder resolvers can be replaced or added. These run on the raw
 *   structured data between the parsing and pre-processing steps, to replace
 *   dollar-prefixed entries with their actual values (like $file).
 * - Pre-processors can be added or replaced. These take the raw unvalidated
 *   data from the parser processors and can enrich or extend it before
 *   validation. This is the place where for example codeowners data can be
 *   injected into partial entity definitions.
 * - Entity policies can be added or replaced. These are the first line of
 *   validation from the output of the pre-processing step. All policies are
 *   given the chance to inspect the entity, and all of them have to pass in
 *   order for the entity to be considered valid from an overall point of
 *   view.
 * - Field format validators can be replaced. These check the format of
 *   individual core fields such as metadata.name, such that they adhere to
 *   certain rules.
 * - Entity kinds can be added or replaced. These are the second line of
 *   validation that is applied after the entity policies, which add additional
 *   kind-specific validation (usually based on a schema). Only one of the
 *   entity kinds has to accept the entity, but if none of them do, the
 *   entity is rejected as a whole.
 * - Post-processors can be added or replaced. These take the validated
 *   entities out of the validation step and can perform additional actions on
 *   them.
 */
export class CatalogBuilder {
  private readonly env: CatalogEnvironment;
  private entityPolicies: EntityPolicy[];
  private entityPoliciesReplace: boolean;
  private entityKinds: EntityPolicy[];
  private entityKindsReplace: boolean;
  private readerProcessors: CatalogProcessor[];
  private readerProcessorsReplace: boolean;
  private parserProcessors: CatalogProcessor[];
  private parserProcessorsReplace: boolean;
  private preProcessors: CatalogProcessor[];
  private preProcessorsReplace: boolean;
  private postProcessors: CatalogProcessor[];
  private postProcessorsReplace: boolean;
  private placeholderResolvers: Record<string, PlaceholderResolver>;
  private fieldFormatValidators: Partial<Validators>;

  constructor(env: CatalogEnvironment) {
    this.env = env;
    this.entityPolicies = [];
    this.entityPoliciesReplace = false;
    this.entityKinds = [];
    this.entityKindsReplace = false;
    this.readerProcessors = [];
    this.readerProcessorsReplace = false;
    this.parserProcessors = [];
    this.parserProcessorsReplace = false;
    this.preProcessors = [];
    this.preProcessorsReplace = false;
    this.postProcessors = [];
    this.postProcessorsReplace = false;
    this.placeholderResolvers = {};
    this.fieldFormatValidators = {};
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
   * @param policies One or more policies
   */
  addEntityPolicy(...policies: EntityPolicy[]): CatalogBuilder {
    this.entityPolicies.push(...policies);
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
   * @param policies One or more policies
   */
  replaceEntityPolicies(policies: EntityPolicy[]): CatalogBuilder {
    this.entityPolicies = [...policies];
    this.entityPoliciesReplace = true;
    return this;
  }

  /**
   * Adds entity kinds that are used to validate a certain apiVersion/kind. One
   * of the entity kind policies must match a given entity for it to be
   * considered valid.
   *
   * @param policies One or more policies
   */
  addEntityKind(...policies: EntityPolicy[]): CatalogBuilder {
    this.entityKinds.push(...policies);
    return this;
  }

  /**
   * Sets what entity policies that are used to validate a certain apiVersion/
   * kind. One of the entity kind policies must match a given entity for it to
   * be considered valid.
   *
   * This function replaces the default set of kinds; use with care.
   *
   * @param policies One or more policies
   */
  replaceEntityKinds(policies: EntityPolicy[]): CatalogBuilder {
    this.entityKinds = [...policies];
    this.entityKindsReplace = true;
    return this;
  }

  /**
   * Adds processors that support reading of definition files. These are run
   * before the entities are parsed, pre-processed, validated and post-
   * processed.
   *
   * @param processors One or more processors
   */
  addReaderProcessor(...processors: CatalogProcessor[]): CatalogBuilder {
    this.readerProcessors.push(...processors);
    return this;
  }

  /**
   * Sets what processors to use for the reading of definition files. These are
   * run before the entities are parsed, pre-processed, validated and post-
   * processed.
   *
   * This function replaces the default set of processors in this stage; use
   * with care.
   *
   * @param processors One or more processors
   */
  replaceReaderProcessors(processors: CatalogProcessor[]): CatalogBuilder {
    this.readerProcessors = [...processors];
    this.readerProcessorsReplace = true;
    return this;
  }

  /**
   * Adds processors that run after each definition file has been read, in
   * order to parse the raw data. These are run before the entities are
   * pre-processed, validated and post-processed.
   *
   * @param processors One or more processors
   */
  addParserProcessor(...processors: CatalogProcessor[]): CatalogBuilder {
    this.parserProcessors.push(...processors);
    return this;
  }

  /**
   * Sets what processors to run after each definition file has been read, in
   * order to parse the raw data. These are run before the entities are
   * pre-processed, validated and post-processed.
   *
   * This function replaces the default set of processors in this stage; use
   * with care.
   *
   * @param processors One or more processors
   */
  replaceParserProcessors(processors: CatalogProcessor[]): CatalogBuilder {
    this.parserProcessors = [...processors];
    this.parserProcessorsReplace = true;
    return this;
  }

  /**
   * Adds processors that run after each entity has been read and parsed,
   * but before being validated and post-processed.
   *
   * @param processors One or more processors
   */
  addPreProcessor(...processors: CatalogProcessor[]): CatalogBuilder {
    this.preProcessors.push(...processors);
    return this;
  }

  /**
   * Sets what processors to run after each entity has been read and parsed,
   * but before being validated and post-processed.
   *
   * This function replaces the default set of processors in this stage; use
   * with care.
   *
   * @param processors One or more processors
   */
  replacePreProcessors(processors: CatalogProcessor[]): CatalogBuilder {
    this.preProcessors = [...processors];
    this.preProcessorsReplace = true;
    return this;
  }

  /**
   * Adds processors that run after each entity has been read, parsed,
   * run through the pre-processors, and validated.
   *
   * @param processors One or more processors
   */
  addPostProcessor(...processors: CatalogProcessor[]): CatalogBuilder {
    this.postProcessors.push(...processors);
    return this;
  }

  /**
   * Sets what processors to run after each entity has been read, parsed,
   * run through the pre-processors, and validated.
   *
   * This function replaces the default set of processors in this stage; use
   * with care.
   *
   * @param processors One or more processors
   */
  replacePostProcessors(processors: CatalogProcessor[]): CatalogBuilder {
    this.postProcessors = [...processors];
    this.postProcessorsReplace = true;
    return this;
  }

  /**
   * Adds, or overwrites, a handler for placeholders (e.g. $file) in entity
   * definition files.
   *
   * @param key The key that identifies the placeholder, e.g. "file"
   * @param resolver The resolver that gets values for this placeholder
   */
  setPlaceholderResolver(key: string, resolver: PlaceholderResolver) {
    this.placeholderResolvers[key] = resolver;
  }

  /**
   * Sets the validator function to use for one or more special fields of an
   * entity. This is useful if the default rules for formatting of fields are
   * not sufficient.
   *
   * This function has no effect if used together with
   * {@link CatalogBuilder#replaceEntityPolicies}.
   *
   * @param validators The (subset of) validators to set
   */
  setFieldFormatValidators(validators: Partial<Validators>) {
    lodash.merge(this.fieldFormatValidators, validators);
  }

  /**
   * Wires up and returns all of the component parts of the catalog
   */
  async build(): Promise<{
    entitiesCatalog: EntitiesCatalog;
    locationsCatalog: LocationsCatalog;
    higherOrderOperation: HigherOrderOperation;
  }> {
    const { config, database, logger } = this.env;

    const entityPolicy = this.buildEntityPolicy();
    const processors = this.buildProcessors(entityPolicy);
    const rulesEnforcer = CatalogRulesEnforcer.fromConfig(config);

    const locationReader = new LocationReaders({
      ...this.env,
      processors,
      rulesEnforcer,
    });

    const db = await DatabaseManager.createDatabase(
      await database.getClient(),
      { logger },
    );

    const entitiesCatalog = new DatabaseEntitiesCatalog(db, this.env.logger);
    const locationsCatalog = new DatabaseLocationsCatalog(db);
    const higherOrderOperation = new HigherOrderOperations(
      entitiesCatalog,
      locationsCatalog,
      locationReader,
      logger,
    );

    return {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
    };
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
          new ReservedFieldsEntityPolicy(),
          ...this.entityPolicies,
        ];

    const entityKinds: EntityPolicy[] = this.entityKindsReplace
      ? this.entityKinds
      : [
          componentEntityV1alpha1Policy,
          groupEntityV1alpha1Policy,
          userEntityV1alpha1Policy,
          locationEntityV1alpha1Policy,
          templateEntityV1alpha1Policy,
          apiEntityV1alpha1Policy,
          ...this.entityKinds,
        ];

    return EntityPolicies.allOf([
      EntityPolicies.allOf(entityPolicies),
      EntityPolicies.oneOf(entityKinds),
    ]);
  }

  private buildProcessors(entityPolicy: EntityPolicy): CatalogProcessor[] {
    const { config, reader } = this.env;

    const placeholderResolvers = lodash.merge(
      {
        json: jsonPlaceholderResolver,
        yaml: yamlPlaceholderResolver,
        text: textPlaceholderResolver,
      },
      this.placeholderResolvers,
    );

    return [
      StaticLocationProcessor.fromConfig(config),
      ...this.buildReaderProcessors(),
      ...this.buildParserProcessors(),
      new PlaceholderProcessor({ resolvers: placeholderResolvers, reader }),
      ...this.buildPreProcessors(),
      new EntityPolicyProcessor(entityPolicy),
      ...this.buildPostProcessors(),
    ];
  }

  private buildReaderProcessors(): CatalogProcessor[] {
    const { config, logger, reader } = this.env;

    if (this.readerProcessorsReplace) {
      return this.readerProcessors;
    }

    // TODO(Rugvip): These are added for backwards compatibility if config exists
    //   The idea is to have everyone migrate from using the old processors to the new
    //   integration config driven UrlReaders. In an upcoming release we can then completely
    //   remove support for the old processors, but still keep handling the deprecated location
    //   types for a while, but with a warning.
    const oldProcessors = [];
    const pc = config.getOptionalConfig('catalog.processors');
    if (pc?.has('github')) {
      logger.warn(
        `Using deprecated configuration for catalog.processors.github, move to using integrations.github instead`,
      );
      oldProcessors.push(GithubReaderProcessor.fromConfig(config, logger));
    }
    if (pc?.has('gitlabApi')) {
      logger.warn(
        `Using deprecated configuration for catalog.processors.gitlabApi, move to using integrations.gitlab instead`,
      );
      oldProcessors.push(new GitlabApiReaderProcessor(config));
      oldProcessors.push(new GitlabReaderProcessor());
    }
    if (pc?.has('bitbucketApi')) {
      logger.warn(
        `Using deprecated configuration for catalog.processors.bitbucketApi, move to using integrations.bitbucket instead`,
      );
      oldProcessors.push(new BitbucketApiReaderProcessor(config));
    }
    if (pc?.has('azureApi')) {
      logger.warn(
        `Using deprecated configuration for catalog.processors.azureApi, move to using integrations.azure instead`,
      );
      oldProcessors.push(new AzureApiReaderProcessor(config));
    }

    return [
      new FileReaderProcessor(),
      ...oldProcessors,
      GithubOrgReaderProcessor.fromConfig(config, { logger }),
      LdapOrgReaderProcessor.fromConfig(config, { logger }),
      new UrlReaderProcessor({ reader, logger }),
      ...this.readerProcessors,
    ];
  }

  private buildParserProcessors(): CatalogProcessor[] {
    if (this.parserProcessorsReplace) {
      return this.parserProcessors;
    }

    return [new YamlProcessor(), ...this.parserProcessors];
  }

  private buildPreProcessors(): CatalogProcessor[] {
    const { reader } = this.env;

    if (this.preProcessorsReplace) {
      return this.preProcessors;
    }

    return [new CodeOwnersProcessor({ reader }), ...this.preProcessors];
  }

  private buildPostProcessors(): CatalogProcessor[] {
    if (this.postProcessorsReplace) {
      return this.postProcessors;
    }

    return [
      new LocationRefProcessor(),
      new AnnotateLocationEntityProcessor(),
      ...this.postProcessors,
    ];
  }
}
