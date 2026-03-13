/*
 * Copyright 2025 The Backstage Authors
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
  AuthService,
  BackstageCredentials,
  DiscoveryService,
  LoggerService,
  PermissionsService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { ResponseError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import {
  ActionsService,
  ActionsServiceAction,
} from '@backstage/backend-plugin-api/alpha';
import { Minimatch } from 'minimatch';
import { Config } from '@backstage/config';
import {
  AuthorizeResult,
  createPermission,
} from '@backstage/plugin-permission-common';

export class DefaultActionsService implements ActionsService {
  private readonly discovery: DiscoveryService;
  private readonly config: RootConfigService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly permissions: PermissionsService;

  private constructor(
    discovery: DiscoveryService,
    config: RootConfigService,
    logger: LoggerService,
    auth: AuthService,
    permissions: PermissionsService,
  ) {
    this.discovery = discovery;
    this.config = config;
    this.logger = logger;
    this.auth = auth;
    this.permissions = permissions;
  }

  static create({
    discovery,
    config,
    logger,
    auth,
    permissions,
  }: {
    discovery: DiscoveryService;
    config: RootConfigService;
    logger: LoggerService;
    auth: AuthService;
    permissions: PermissionsService;
  }) {
    return new DefaultActionsService(
      discovery,
      config,
      logger,
      auth,
      permissions,
    );
  }

  async list({ credentials }: { credentials: BackstageCredentials }) {
    const pluginSources =
      this.config.getOptionalStringArray('backend.actions.pluginSources') ?? [];

    const remoteActionsList = await Promise.all(
      pluginSources.map(async source => {
        try {
          const response = await this.makeRequest({
            path: `/.backstage/actions/v1/actions`,
            pluginId: source,
            credentials,
          });
          if (!response.ok) {
            throw await ResponseError.fromResponse(response);
          }
          const { actions } = (await response.json()) as {
            actions: ActionsServiceAction;
          };

          return actions;
        } catch (error) {
          this.logger.warn(`Failed to fetch actions from ${source}`, error);
          return [];
        }
      }),
    );

    const filtered = this.applyFilters(remoteActionsList.flat());
    const overridden = this.applyOverrides(filtered);
    const permitted = await this.filterByOverridePermissions(
      overridden,
      credentials,
    );
    return { actions: permitted };
  }

  async invoke(opts: {
    id: string;
    input?: JsonObject;
    credentials: BackstageCredentials;
  }) {
    const pluginId = this.pluginIdFromActionId(opts.id);
    const response = await this.makeRequest({
      path: `/.backstage/actions/v1/actions/${encodeURIComponent(
        opts.id,
      )}/invoke`,
      pluginId,
      credentials: opts.credentials,
      options: {
        method: 'POST',
        body: JSON.stringify(opts.input),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const { output } = await response.json();
    return { output };
  }

  private async makeRequest(opts: {
    path: string;
    pluginId: string;
    options?: RequestInit;
    credentials: BackstageCredentials;
  }) {
    const { path, pluginId, credentials, options } = opts;
    const baseUrl = await this.discovery.getBaseUrl(pluginId);

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: opts.pluginId,
    });

    return fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private pluginIdFromActionId(id: string): string {
    const colonIndex = id.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid action id: ${id}`);
    }
    return id.substring(0, colonIndex);
  }

  private applyFilters(
    actions: ActionsServiceAction[],
  ): ActionsServiceAction[] {
    const filterConfig = this.config.getOptionalConfig(
      'backend.actions.filter',
    );

    if (!filterConfig) {
      return actions;
    }

    const includeRules = this.parseFilterRules(
      filterConfig.getOptionalConfigArray('include') ?? [],
    );
    const excludeRules = this.parseFilterRules(
      filterConfig.getOptionalConfigArray('exclude') ?? [],
    );

    return actions.filter(action => {
      const excluded = excludeRules.some(rule =>
        this.matchesRule(action, rule),
      );

      if (excluded) {
        return false;
      }

      // If no include rules, include by default
      if (includeRules.length === 0) {
        return true;
      }

      // Must match at least one include rule
      return includeRules.some(rule => this.matchesRule(action, rule));
    });
  }

  private parseFilterRules(configArray: Array<Config>): Array<{
    idMatcher?: Minimatch;
    attributes?: Partial<
      Record<'destructive' | 'readOnly' | 'idempotent', boolean>
    >;
  }> {
    return configArray.map(ruleConfig => {
      const idPattern = ruleConfig.getOptionalString('id');
      const attributesConfig = ruleConfig.getOptionalConfig('attributes');

      const rule: {
        idMatcher?: Minimatch;
        attributes?: Partial<
          Record<'destructive' | 'readOnly' | 'idempotent', boolean>
        >;
      } = {};

      if (idPattern) {
        rule.idMatcher = new Minimatch(idPattern);
      }

      if (attributesConfig) {
        rule.attributes = {};
        for (const key of ['destructive', 'readOnly', 'idempotent'] as const) {
          const value = attributesConfig.getOptionalBoolean(key);
          if (value !== undefined) {
            rule.attributes[key] = value;
          }
        }
      }

      return rule;
    });
  }

  private matchesRule(
    action: ActionsServiceAction,
    rule: {
      idMatcher?: Minimatch;
      attributes?: Partial<
        Record<'destructive' | 'readOnly' | 'idempotent', boolean>
      >;
    },
  ): boolean {
    // If id pattern is specified, it must match
    if (rule.idMatcher && !rule.idMatcher.match(action.id)) {
      return false;
    }

    // If attributes are specified, all must match
    if (rule.attributes) {
      for (const [key, value] of Object.entries(rule.attributes)) {
        if (
          action.attributes[
            key as 'destructive' | 'readOnly' | 'idempotent'
          ] !== value
        ) {
          return false;
        }
      }
    }

    return true;
  }

  private applyOverrides(
    actions: ActionsServiceAction[],
  ): ActionsServiceAction[] {
    const overridesConfig = this.config.getOptionalConfig(
      'backend.actions.overrides',
    );

    if (!overridesConfig) {
      return actions;
    }

    return actions.map(action => {
      const actionConfig = overridesConfig.getOptionalConfig(action.id);
      if (!actionConfig) {
        return action;
      }

      const title = actionConfig.getOptionalString('title') ?? action.title;
      const description =
        actionConfig.getOptionalString('description') ?? action.description;

      const schemaConfig = actionConfig.getOptionalConfig('schema');
      const inputSchema = { ...action.schema.input };
      const outputSchema = { ...action.schema.output };

      if (schemaConfig) {
        const inputOverride = schemaConfig.getOptionalConfig('input');
        if (inputOverride) {
          inputSchema.title =
            inputOverride.getOptionalString('title') ?? inputSchema.title;
          inputSchema.description =
            inputOverride.getOptionalString('description') ??
            inputSchema.description;
        }

        const outputOverride = schemaConfig.getOptionalConfig('output');
        if (outputOverride) {
          outputSchema.title =
            outputOverride.getOptionalString('title') ?? outputSchema.title;
          outputSchema.description =
            outputOverride.getOptionalString('description') ??
            outputSchema.description;
        }
      }

      return {
        ...action,
        title,
        description,
        schema: { input: inputSchema, output: outputSchema },
      };
    });
  }

  private async filterByOverridePermissions(
    actions: ActionsServiceAction[],
    credentials: BackstageCredentials,
  ): Promise<ActionsServiceAction[]> {
    const overridesConfig = this.config.getOptionalConfig(
      'backend.actions.overrides',
    );

    if (!overridesConfig) {
      return actions;
    }

    const actionsWithPermissions = actions.filter(action => {
      const actionConfig = overridesConfig.getOptionalConfig(action.id);
      return actionConfig?.has('visibilityPermission');
    });

    if (actionsWithPermissions.length === 0) {
      return actions;
    }

    const permissions = actionsWithPermissions.map(action => {
      const permConfig = overridesConfig
        .getConfig(action.id)
        .getConfig('visibilityPermission');
      return createPermission({
        name: permConfig.getString('name'),
        attributes: {
          action: permConfig.getOptionalString('attributes.action') as
            | 'create'
            | 'read'
            | 'update'
            | 'delete'
            | undefined,
        },
      });
    });

    const decisions = await this.permissions.authorize(
      permissions.map(permission => ({ permission })),
      { credentials },
    );

    const deniedIds = new Set(
      actionsWithPermissions
        .filter((_, index) => decisions[index].result === AuthorizeResult.DENY)
        .map(action => action.id),
    );

    return actions.filter(action => !deniedIds.has(action.id));
  }
}
