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

import {
  ReadTreeResponseFile,
  UrlReaders,
  UrlReader,
} from '@backstage/backend-common';
import { TaskRunner } from '@backstage/backend-tasks';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { assertError, NotModifiedError } from '@backstage/errors';
import { ScmIntegration, ScmIntegrations } from '@backstage/integration';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';

import {
  CodeOwnersEntry,
  matchFile as matchCodeowner,
  parse as parseCodeowners,
} from 'codeowners-utils';
import { Logger } from 'winston';
import { ZodError } from 'zod';

import { PackageJson } from './PackageJsonParser';
import {
  BackstagePackageJson,
  BackstagePluginsEntityTransformer,
  BackstagePluginsProviderOptions,
} from './types';

type PkgJson = {
  file: ReadTreeResponseFile;
  data: BackstagePackageJson;
};

const isPkgJson = (candidate: PkgJson | undefined): candidate is PkgJson => {
  return candidate !== undefined;
};

const entityNotOmitted = (opts: {
  pkgJson: PkgJson;
  entity: Entity | undefined;
}): opts is { pkgJson: PkgJson; entity: Entity } => {
  return opts.entity !== undefined;
};

/**
 * Discovers package.json files located in a given Backstage monorepo and
 * provides entities that are derived from those packages that represent
 * Backstage plugins.
 *
 * @public
 */
export class BackstagePluginsProvider implements EntityProvider {
  private readonly logger: Logger;
  private readonly reader: UrlReader;
  private readonly integration: ScmIntegration;
  private readonly location: string;
  private readonly defaultOwner: string;
  private readonly transformer: BackstagePluginsEntityTransformer;
  private readonly scheduleFn: () => Promise<void>;
  private connection?: EntityProviderConnection;
  private codeowners: CodeOwnersEntry[] | undefined;
  private lastEtag = '';

  static fromConfig(
    config: Config,
    options: BackstagePluginsProviderOptions,
  ): BackstagePluginsProvider {
    const readers = UrlReaders.default({ config, logger: options.logger });
    const integrations = ScmIntegrations.fromConfig(config);

    const integration = integrations.byUrl(options.location);
    if (integration === undefined) {
      throw new Error(
        `There is no integration config that matches url ${options.location}. Please add a configuration entry for it under integrations.`,
      );
    }

    const taskRunner = options.scheduler.createScheduledTaskRunner(
      options.scheduleDefinition,
    );

    return new BackstagePluginsProvider(
      readers,
      integration,
      options.location,
      options.defaultOwner,
      options.logger,
      taskRunner,
      options.transformer,
    );
  }

  private constructor(
    reader: UrlReader,
    integration: ScmIntegration,
    location: string,
    defaultOwner: string,
    logger: Logger,
    taskRunner: TaskRunner,
    transformer?: BackstagePluginsEntityTransformer | undefined,
  ) {
    this.reader = reader;
    this.integration = integration;
    this.location = location;
    this.defaultOwner = defaultOwner;
    this.transformer =
      transformer === undefined ? opts => opts.entity : transformer;
    this.logger = logger.child({
      target: this.getProviderName(),
    });
    this.scheduleFn = this.createScheduleFn(taskRunner);
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.getProviderName} */
  getProviderName(): string {
    return `backstage-plugins-provider ${this.location}`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-backend#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
    return await this.scheduleFn();
  }

  private createScheduleFn(taskRunner: TaskRunner): () => Promise<void> {
    return async () => {
      const taskId = `${this.getProviderName()}:refresh`;
      return taskRunner.run({
        id: taskId,
        fn: async () => {
          try {
            await this.refresh(this.logger);
          } catch (error) {
            this.logger.error(
              `${this.getProviderName()} refresh failed`,
              error,
            );
          }
        },
      });
    };
  }

  async refresh(logger: Logger) {
    if (!this.connection) {
      throw new Error('Not initialized');
    }

    // Retrieve package.json files and prime any codeowners metadata.
    const { etag, packageJsonFiles } = await this.readPackageJsons();
    if (this.lastEtag === etag) {
      logger.info('No changes since last refresh. Skipping.');
      return;
    }

    // Safely parse any/all package.json files that were returned.
    const packageJsons = await Promise.allSettled(
      packageJsonFiles.map(async file => ({
        file,
        data: PackageJson.safeParse(
          JSON.parse((await file.content()).toString()),
        ),
      })),
    );

    // Convert package.json files into components of type backstage-plugin.
    const entities = packageJsons
      // Filter out invalid package.json files
      .map(promise => {
        if (promise.status === 'fulfilled') {
          if (promise.value.data.success === true) {
            return { file: promise.value.file, data: promise.value.data.data };
          }

          // Ignore issues related to missing "backstage" key. It's probably
          // just not a backstage package.json.
          if (!isMissingBackstageKeyError(promise.value.data.error)) {
            logger.warn(
              `Unable to parse backstage package.json file ${promise.value.file.path}`,
            );
          }
        } else {
          logger.warn(
            `Unable to read backstage package.json file: ${promise.reason}`,
          );
        }
        return undefined;
      })
      .filter(isPkgJson)

      // Map the package.json to a component entity
      .map((pkgJson): { pkgJson: PkgJson; entity: Entity | undefined } => {
        const editUrl = this.integration.resolveEditUrl(
          `${this.location}/${pkgJson.file.path}`,
        );

        return {
          pkgJson,
          // Apply and configured transformer.
          entity: this.transformer({
            readTreeResponse: pkgJson.file,
            packageJson: pkgJson.data,
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                // Provide default name/title/description values.
                name: pkgJson.data.name
                  .replace(/[^a-z0-9_\-\.]+/g, '-')
                  .replace(/^[^a-z0-9]|[^a-z0-9]$/g, ''),
                title: pkgJson.data.name,
                description: pkgJson.data.description,

                // Allow arbitrary metadata to be provided under catalogInfo key.
                ...(pkgJson.data.catalogInfo?.metadata ?? {}),

                // Provide default location annotations
                annotations: {
                  'backstage.io/managed-by-location': `url:${editUrl}`,
                  'backstage.io/managed-by-origin-location': `url:${editUrl}`,

                  // But allow arbitrary annotations under catalogInfo key
                  ...(pkgJson.data.catalogInfo?.metadata?.annotations ?? {}),
                },
              },
              spec: {
                owner:
                  this.getOwnerFromCodeowners(pkgJson.file.path) ??
                  this.defaultOwner,

                // Allow arbitrary spec metadata to be provided
                ...(pkgJson.data.catalogInfo?.spec ?? {}),
              },
            },
          }),
        };
      })
      // Filter out "undefined" if transformer's intention was to filter.
      .filter(entityNotOmitted)

      // Apply consistent defaults.
      .map(({ pkgJson, entity }) => {
        // Provide consistent type and plugin_role values.
        entity.spec!.type = 'backstage-plugin';
        entity.spec!.plugin_role = pkgJson.data.backstage.role;

        // If no lifecycle was provided, set "experimental" as the default.
        entity.spec!.lifecycle = entity.spec!.lifecycle ?? 'experimental';

        return entity;
      })
      // Convert the given entity into a DeferredEntity.
      .map(entity => ({ entity }));

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });

    // (Re)set class state for subsequent refreshes.
    this.lastEtag = etag;
    this.codeowners = undefined;

    logger.info(
      `Read ${packageJsonFiles.length} package.json files (${entities.length} plugin components provided)`,
    );
  }

  private async readPackageJsons(): Promise<{
    etag: string;
    packageJsonFiles: ReadTreeResponseFile[];
  }> {
    try {
      const response = await this.reader.readTree(this.location, {
        etag: this.lastEtag,
        filter: path =>
          path.endsWith('CODEOWNERS') || path.endsWith('package.json'),
      });
      const files = await response.files();

      // Find/parse any codeowners files, if available.
      const codeowners = files.find(file => file.path.endsWith('/CODEOWNERS'));
      if (codeowners) {
        try {
          this.codeowners = parseCodeowners(
            (await codeowners.content()).toString(),
          );
        } catch (e) {
          this.logger.warn(
            `Unable to parse codeowners file ${codeowners.path}: ${e}`,
          );
        }
      }

      return {
        etag: response.etag,
        packageJsonFiles: files.filter(file =>
          file.path.endsWith('/package.json'),
        ),
      };
    } catch (e) {
      assertError(e);
      if (e.name === NotModifiedError.name) {
        return {
          etag: this.lastEtag,
          packageJsonFiles: [],
        };
      }
      throw e;
    }
  }

  /**
   * Given a file path, attempts to find the relevant code owner for the file.
   *
   * This assumes that the code owner resembles `@user` or `@{org}/{group}`,
   * where `{org}` is an artifact of the SCM's representation of an organization and
   * not tied to an internal representation of the group.
   */
  private getOwnerFromCodeowners(path: string): string | undefined {
    if (this.codeowners === undefined) return undefined;

    const codeowner = matchCodeowner(path, this.codeowners);
    return codeowner
      ? (codeowner.owners[0].match(/(?:\@[^\/]+\/)?([^\@\/]*)/gm) || [])[1]
      : undefined;
  }
}

/**
 * Returns true if the given Zod error corresponds to a missing "backstage" key
 * at the root of the package.json (indicating: this is just a regular
 * package.json, not a Backstage plugin).
 */
function isMissingBackstageKeyError(error: ZodError) {
  return (
    error.issues.findIndex(
      issue =>
        issue.path.length === 1 &&
        issue.path[0] === 'backstage' &&
        issue.message === 'Required',
    ) >= 0
  );
}
