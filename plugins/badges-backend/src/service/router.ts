/*
 * Copyright 2021 The Backstage Authors
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

import express from 'express';
import Router from 'express-promise-router';
import {
  errorHandler,
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { CatalogApi, CatalogClient } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import { NotFoundError } from '@backstage/errors';
import { BadgeBuilder, DefaultBadgeBuilder } from '../lib/BadgeBuilder';
import { BadgeContext, BadgeFactories } from '../types';
import { isEmpty, isNil } from 'lodash';
import crypto from 'crypto';
import { Logger } from 'winston';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
/** @public */
export interface RouterOptions {
  badgeBuilder?: BadgeBuilder;
  badgeFactories?: BadgeFactories;
  catalog?: CatalogApi;
  config: Config;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  logger: Logger;
  identity: IdentityApi;
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const catalog =
    options.catalog || new CatalogClient({ discoveryApi: options.discovery });
  const badgeBuilder =
    options.badgeBuilder ||
    new DefaultBadgeBuilder(options.badgeFactories || {});
  const router = Router();

  const tokenManager = options.tokenManager;
  let lookupTable: Map<
    string,
    {
      name: string;
      namespace: string;
      kind: string;
      creationDate: number;
    }
  > = new Map();

  // Check if the users have enabled the obfuscation of the entity name
  const obfuscate: boolean =
    options.config.getOptionalBoolean('app.badges.obfuscate') ?? false;

  if (obfuscate) {
    options.logger.info('Badges obfuscation is enabled');

    // Use the generated hash instead of the triplet namespace/kind/name
    router.get('/entity/:entityHash/badge-specs', async (req, res) => {
      const { entityHash } = req.params;

      if (isLookupTableToRefresh(lookupTable)) {
        lookupTable = await generateHashLookupTable();
      }
      // Try to match the queried hash with a key in the lookup table
      const entityInfo = await getEntityInfoFromLookupTable(entityHash);

      // If a mapping is found, map name, namespace and kind
      const name = entityInfo.name;
      const namespace = entityInfo.namespace;
      const kind = entityInfo.kind;
      const token = await tokenManager.getToken();

      // Query the catalog with the name, namespace, kind to get the entity informations
      const entity = await catalog.getEntityByRef(
        {
          namespace,
          kind,
          name,
        },
        token,
      );
      if (isNil(entity)) {
        throw new NotFoundError(
          `No ${kind} entity in ${namespace} named "${name}"`,
        );
      }

      // Create the badge specs
      const specs = [];
      for (const badgeInfo of await badgeBuilder.getBadges()) {
        const context: BadgeContext = {
          badgeUrl: await getBadgeObfuscatedUrl(
            namespace,
            kind,
            name,
            badgeInfo.id,
          ),
          config: options.config,
          entity,
        };

        const badge = await badgeBuilder.createBadgeJson({
          badgeInfo,
          context,
        });
        specs.push(badge);
      }

      res.status(200).json(specs);
    });

    // Use the generated hash instead of the triplet namespace/kind/name
    router.get('/entity/:entityHash/:badgeId', async (req, res) => {
      const { entityHash, badgeId } = req.params;

      if (isLookupTableToRefresh(lookupTable)) {
        lookupTable = await generateHashLookupTable();
      }

      // Try to match the queried hash with a key in the lookup table
      const entityInfo = await getEntityInfoFromLookupTable(entityHash);

      // If a mapping is found, map name, namespace and kind
      const name = entityInfo.name;
      const namespace = entityInfo.namespace;
      const kind = entityInfo.kind;
      const token = await tokenManager.getToken();
      const entity = await catalog.getEntityByRef(
        {
          namespace,
          kind,
          name,
        },
        token,
      );
      if (isNil(entity)) {
        throw new NotFoundError(
          `No ${kind} entity in ${namespace} named "${name}"`,
          res.sendStatus(404),
        );
      }

      let format =
        req.accepts(['image/svg+xml', 'application/json']) || 'image/svg+xml';
      if (req.query.format === 'json') {
        format = 'application/json';
      }

      // Generate the badge URL for the different types of badgeId
      const badgeOptions = {
        badgeInfo: { id: badgeId },
        context: {
          badgeUrl: await getBadgeObfuscatedUrl(namespace, kind, name, badgeId),
          config: options.config,
          entity,
        },
      };

      let data: string;
      if (format === 'application/json') {
        data = JSON.stringify(
          await badgeBuilder.createBadgeJson(badgeOptions),
          null,
          2,
        );
      } else {
        data = await badgeBuilder.createBadgeSvg(badgeOptions);
      }

      res.setHeader('Content-Type', format);
      res.status(200).send(data);
    });

    // Generate the hash for queried the namespace/kind/name triplet
    router.get(
      '/entity/:namespace/:kind/:name/obfuscated',
      function authenticate(req, res, next) {
        const token =
          getBearerTokenFromAuthorizationHeader(req.headers.authorization) ||
          (req.cookies?.token as string | undefined);

        if (!token) {
          res.status(401).send('Unauthorized');
          return;
        }

        try {
          req.user = options.identity.getIdentity({ request: req });
          next();
        } catch (error) {
          options.tokenManager.authenticate(token.toString());
          next(error);
        }
      },
      async (req, res) => {
        const { namespace, kind, name } = req.params;
        const salt = options.config.getString('custom.badges-backend.salt');
        const hash = crypto
          .createHash('sha256')
          .update(`${kind}:${namespace}:${name}:${salt}`)
          .digest('hex');

        return res.status(200).json({ hash });
      },
    );

    router.use(errorHandler());

    return router;

    // If the obfuscation is disabled, use the previously implemented routes
    // eslint-disable-next-line no-else-return
  } else {
    router.get(
      '/entity/:namespace/:kind/:name/badge-specs',
      async (req, res) => {
        const token = await tokenManager.getToken();
        const { namespace, kind, name } = req.params;
        const entity = await catalog.getEntityByRef(
          { namespace, kind, name },
          token,
        );
        if (!entity) {
          throw new NotFoundError(
            `No ${kind} entity in ${namespace} named "${name}"`,
          );
        }

        const specs = [];
        for (const badgeInfo of await badgeBuilder.getBadges()) {
          const context: BadgeContext = {
            badgeUrl: await getBadgeUrl(namespace, kind, name, badgeInfo.id),
            config: options.config,
            entity,
          };

          const badge = await badgeBuilder.createBadgeJson({
            badgeInfo,
            context,
          });
          specs.push(badge);
        }

        res.status(200).json(specs);
      },
    );

    router.get(
      '/entity/:namespace/:kind/:name/badge/:badgeId',
      async (req, res) => {
        const { namespace, kind, name, badgeId } = req.params;
        const token = await tokenManager.getToken();
        const entity = await catalog.getEntityByRef(
          { namespace, kind, name },
          token,
        );
        if (!entity) {
          throw new NotFoundError(
            `No ${kind} entity in ${namespace} named "${name}"`,
          );
        }

        let format =
          req.accepts(['image/svg+xml', 'application/json']) || 'image/svg+xml';
        if (req.query.format === 'json') {
          format = 'application/json';
        }

        const badgeOptions = {
          badgeInfo: { id: badgeId },
          context: {
            badgeUrl: await getBadgeUrl(namespace, kind, name, badgeId),
            config: options.config,
            entity,
          },
        };

        let data: string;
        if (format === 'application/json') {
          data = JSON.stringify(
            await badgeBuilder.createBadgeJson(badgeOptions),
            null,
            2,
          );
        } else {
          data = await badgeBuilder.createBadgeSvg(badgeOptions);
        }

        res.setHeader('Content-Type', format);
        res.status(200).send(data);
      },
    );

    router.use(errorHandler());

    return router;
  }

  // This function generate a table that maps the hash to the namespace/kind/name triplet
  async function generateHashLookupTable() {
    const logger = options.logger.child({ service: 'badges-backend' });
    const generationStartTimestamp = Date.now();
    logger.info('Start Generating lookup table');
    const token = await options.tokenManager.getToken();

    // The salt is used to increase the hash entropy
    const salt = options.config.getString('custom.badges-backend.salt');

    // Get all the entities in the catalog of kind "Component"
    const entitiesList = await catalog.getEntities(
      {
        filter: {
          kind: 'Component',
        },
      },
      token,
    );
    if (isEmpty(entitiesList)) {
      throw new NotFoundError(`No entities found`);
    }

    // For each entity, generate the hash with the triplet kind:namespace:name then add the salt. Finally add it to the lookup table
    entitiesList.items.map(async entity => {
      const name = entity.metadata.name.toLocaleLowerCase();
      const creationDate: number = Date.now();
      const namespace =
        entity.metadata.namespace?.toLocaleLowerCase() ?? 'default';
      const kind = entity.kind.toLocaleLowerCase();
      const hash = crypto
        .createHash('sha256')
        .update(`${kind}:${namespace}:${name}:${salt}`)
        .digest('hex');

      lookupTable.set(hash, { name, namespace, kind, creationDate });

      return lookupTable;
    });

    // Monitor the lookup generation time and log it
    logger.info(
      `Finished generating lookup table in ${
        Date.now() - generationStartTimestamp
      } ms`,
    );
    // Monitor the lookup table size in byte
    logger.info(`Lookup table size: ${lookupTable.size} entries`);

    return lookupTable;
  }

  // This function check if the lookup table is empty or if it is expired (based on the cacheTimeToLive config) and need to be refreshed
  function isLookupTableToRefresh(
    table: Map<
      string,
      {
        name: string;
        namespace: string;
        kind: string;
        creationDate: number;
      }
    >,
  ): boolean {
    const lookupTableLength = table.size;

    if (lookupTableLength === 0) {
      return true;
    }

    const now = Date.now();
    const cacheTimeToLive =
      options.config.getOptionalNumber(
        'custom.badges-backend.cacheTimeToLive',
      ) ?? 10 * 60 * 1000;

    const valuesArray = Array.from(table.values());
    const lastEntry = valuesArray[valuesArray.length - 1];
    const lastCreationDate = lastEntry.creationDate;

    return lastCreationDate + cacheTimeToLive < now;
  }

  // This function return the namespace/kind/name triplet from the lookup table based on the hash
  async function getEntityInfoFromLookupTable(
    entityHash: string,
  ): Promise<{ name: string; namespace: string; kind: string }> {
    if (lookupTable.get(entityHash) === undefined) {
      throw new NotFoundError(`No entity with hash "${entityHash}"`);
    }

    const name = lookupTable.get(entityHash)!.name;
    const namespace = lookupTable.get(entityHash)!.namespace;
    const kind = lookupTable.get(entityHash)!.kind;

    return { name, namespace, kind };
  }

  // This function return the obfuscated badge url based on the namespace/kind/name triplet
  async function getBadgeObfuscatedUrl(
    namespace: string,
    kind: string,
    name: string,
    badgeId: string,
  ): Promise<string> {
    const baseUrl = await options.discovery.getExternalBaseUrl('badges');
    const salt = options.config.getString('custom.badges-backend.salt');
    const hash = crypto
      .createHash('sha256')
      .update(`${kind}:${namespace}:${name}:${salt}`)
      .digest('hex');
    return `${baseUrl}/entity/${hash}/${badgeId}`;
  }

  // This function return the badge url based on the namespace/kind/name triplet
  async function getBadgeUrl(
    namespace: string,
    kind: string,
    name: string,
    badgeId: string,
  ): Promise<string> {
    const baseUrl = await options.discovery.getExternalBaseUrl('badges');
    return `${baseUrl}/entity/${namespace}/${kind}/${name}/badge/${badgeId}`;
  }
}
