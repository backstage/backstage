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
  HttpAuthService,
  LoggerService,
  PermissionsRegistryService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import PromiseRouter from 'express-promise-router';
import { Router, json } from 'express';
import { z, AnyZodObject } from 'zod/v3';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  ActionsRegistryActionOptions,
  ActionsRegistryService,
} from '@backstage/backend-plugin-api/alpha';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

type ActionEntry = [string, ActionsRegistryActionOptions<any, any>];

export class DefaultActionsRegistryService implements ActionsRegistryService {
  private actions: Map<string, ActionsRegistryActionOptions<any, any>> =
    new Map();

  private readonly logger: LoggerService;
  private readonly httpAuth: HttpAuthService;
  private readonly auth: AuthService;
  private readonly metadata: PluginMetadataService;
  private readonly permissions: PermissionsService;
  private readonly permissionsRegistry: PermissionsRegistryService;

  private constructor(
    logger: LoggerService,
    httpAuth: HttpAuthService,
    auth: AuthService,
    metadata: PluginMetadataService,
    permissions: PermissionsService,
    permissionsRegistry: PermissionsRegistryService,
  ) {
    this.logger = logger;
    this.httpAuth = httpAuth;
    this.auth = auth;
    this.metadata = metadata;
    this.permissions = permissions;
    this.permissionsRegistry = permissionsRegistry;
  }

  static create({
    httpAuth,
    logger,
    auth,
    metadata,
    permissions,
    permissionsRegistry,
  }: {
    httpAuth: HttpAuthService;
    logger: LoggerService;
    auth: AuthService;
    metadata: PluginMetadataService;
    permissions: PermissionsService;
    permissionsRegistry: PermissionsRegistryService;
  }): DefaultActionsRegistryService {
    return new DefaultActionsRegistryService(
      logger,
      httpAuth,
      auth,
      metadata,
      permissions,
      permissionsRegistry,
    );
  }

  createRouter(): Router {
    const router = PromiseRouter();
    router.use(json());

    router.get('/.backstage/actions/v1/actions', async (req, res) => {
      const credentials = await this.httpAuth.credentials(req);
      const entries = Array.from(this.actions.entries());

      const allowedActions = await this.filterByPermissions(
        entries,
        credentials,
      );

      return res.json({
        actions: allowedActions.map(([id, action]) => ({
          id,
          name: action.name,
          title: action.title,
          description: action.description,
          pluginId: this.metadata.getId(),
          attributes: {
            // Inspired by the @modelcontextprotocol/sdk defaults for the hints.
            // https://github.com/modelcontextprotocol/typescript-sdk/blob/dd69efa1de8646bb6b195ff8d5f52e13739f4550/src/types.ts#L777-L812
            destructive: action.attributes?.destructive ?? true,
            idempotent: action.attributes?.idempotent ?? false,
            readOnly: action.attributes?.readOnly ?? false,
          },
          examples: action.examples,
          schema: {
            input: action.schema?.input
              ? zodToJsonSchema(action.schema.input(z))
              : zodToJsonSchema(z.object({})),
            output: action.schema?.output
              ? zodToJsonSchema(action.schema.output(z))
              : zodToJsonSchema(z.object({})),
          },
        })),
      });
    });

    router.post(
      '/.backstage/actions/v1/actions/:actionId/invoke',
      async (req, res) => {
        const credentials = await this.httpAuth.credentials(req);
        if (this.auth.isPrincipal(credentials, 'none')) {
          throw new NotAllowedError(
            `Actions must be invoked by an authenticated principal, not an anonymous request`,
          );
        }

        const action = this.actions.get(req.params.actionId);

        if (!action) {
          throw new NotFoundError(`Action "${req.params.actionId}" not found`);
        }

        if (action.visibilityPermission) {
          const [decision] = await this.permissions.authorize(
            [{ permission: action.visibilityPermission }],
            { credentials },
          );
          if (decision.result !== AuthorizeResult.ALLOW) {
            throw new NotFoundError(
              `Action "${req.params.actionId}" not found`,
            );
          }
        }

        const input = action.schema?.input
          ? action.schema.input(z).safeParse(req.body)
          : ({ success: true, data: undefined } as const);

        if (!input.success) {
          throw new InputError(
            `Invalid input to action "${req.params.actionId}"`,
            input.error,
          );
        }

        const result = await action.action({
          input: input.data,
          credentials,
          logger: this.logger,
        });

        const output = action.schema?.output
          ? action.schema.output(z).safeParse(result?.output)
          : ({ success: true, data: result?.output } as const);

        if (!output.success) {
          throw new InputError(
            `Invalid output from action "${req.params.actionId}"`,
            output.error,
          );
        }

        res.json({ output: output.data });
      },
    );
    return router;
  }

  register<
    TInputSchema extends AnyZodObject,
    TOutputSchema extends AnyZodObject,
  >(options: ActionsRegistryActionOptions<TInputSchema, TOutputSchema>): void {
    const id = `${this.metadata.getId()}:${options.name}`;

    if (this.actions.has(id)) {
      throw new Error(`Action with id "${id}" is already registered`);
    }

    if (options.visibilityPermission) {
      this.permissionsRegistry.addPermissions([options.visibilityPermission]);
    }

    this.actions.set(id, options);
  }

  private async filterByPermissions(
    entries: ActionEntry[],
    credentials: BackstageCredentials,
  ): Promise<ActionEntry[]> {
    const permissionedEntries = entries.filter(
      ([_, action]) => action.visibilityPermission,
    );

    if (permissionedEntries.length === 0) {
      return entries;
    }

    const decisions = await this.permissions.authorize(
      permissionedEntries.map(([_, action]) => ({
        permission: action.visibilityPermission!,
      })),
      { credentials },
    );

    const deniedIds = new Set(
      permissionedEntries
        .filter((_, index) => decisions[index].result !== AuthorizeResult.ALLOW)
        .map(([id]) => id),
    );

    return entries.filter(([id]) => !deniedIds.has(id));
  }
}
