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
import {
  ActionsRegistryActionOptions,
  ActionsRegistryActionSchema,
  ActionsRegistryService,
  ActionsServiceAction,
} from '@backstage/backend-plugin-api/alpha';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

type ValidationResult = Awaited<
  ReturnType<ActionsRegistryActionSchema['~standard']['validate']>
>;

type ResolvedActionSchema = {
  validate(value: unknown): Promise<ValidationResult>;
  jsonSchema: ActionsServiceAction['schema']['input'];
};

type RegisteredAction = Omit<
  ActionsRegistryActionOptions<any, any, any>,
  'schema'
> & {
  schema: {
    input: ResolvedActionSchema;
    output: ResolvedActionSchema;
    secrets?: ResolvedActionSchema;
  };
};

type ActionEntry = [string, RegisteredAction];

export class DefaultActionsRegistryService implements ActionsRegistryService {
  private actions = new Map<string, RegisteredAction>();

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
    router.use('/.backstage/actions/', json());

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
            destructive:
              action.attributes?.destructive ?? !action.attributes?.readOnly,
            idempotent: action.attributes?.idempotent ?? false,
            readOnly: action.attributes?.readOnly ?? false,
          },
          examples: action.examples,
          schema: {
            input: action.schema.input.jsonSchema,
            output: action.schema.output.jsonSchema,
            ...(action.schema.secrets && {
              secrets: action.schema.secrets.jsonSchema,
            }),
          },
        })),
      });
    });

    const invokeHandler =
      (opts: { wrapped: boolean }) =>
      async (
        req: import('express').Request,
        res: import('express').Response,
      ) => {
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

        const rawInput = opts.wrapped ? req.body.input : req.body;
        const rawSecrets = opts.wrapped ? req.body.secrets : undefined;

        const input = await action.schema.input.validate(rawInput);

        if (input.issues) {
          throw new InputError(
            `Invalid input to action "${req.params.actionId}"`,
            formatValidationIssues(input.issues),
          );
        }

        if (action.schema.secrets && !rawSecrets) {
          throw new InputError(
            `Action "${req.params.actionId}" requires secrets but none were provided`,
          );
        }

        if (!action.schema.secrets && rawSecrets) {
          throw new InputError(
            `Action "${req.params.actionId}" does not accept secrets`,
          );
        }

        const secrets = action.schema.secrets
          ? await action.schema.secrets.validate(rawSecrets)
          : ({ value: undefined } as const);

        if (secrets.issues) {
          throw new InputError(
            `Invalid secrets for action "${req.params.actionId}"`,
            formatValidationIssues(secrets.issues),
          );
        }

        const result = await action.action({
          input: input.value,
          secrets: secrets.value,
          credentials,
          logger: this.logger,
        });

        const output = await action.schema.output.validate(result?.output);

        if (output.issues) {
          throw new InputError(
            `Invalid output from action "${req.params.actionId}"`,
            formatValidationIssues(output.issues),
          );
        }

        res.json({ output: output.value });
      };

    // Deprecated: remove v1 invoke route once all callers have migrated to v2
    router.post(
      '/.backstage/actions/v1/actions/:actionId/invoke',
      invokeHandler({ wrapped: false }),
    );

    router.post(
      '/.backstage/actions/v2/actions/:actionId/invoke',
      invokeHandler({ wrapped: true }),
    );

    return router;
  }

  register<
    TInputSchema extends ActionsRegistryActionSchema,
    TOutputSchema extends ActionsRegistryActionSchema,
    TSecretsSchema extends ActionsRegistryActionSchema | undefined = undefined,
  >(
    options: ActionsRegistryActionOptions<
      TInputSchema,
      TOutputSchema,
      TSecretsSchema
    >,
  ): void {
    const id = `${this.metadata.getId()}:${options.name}`;

    if (this.actions.has(id)) {
      throw new Error(`Action with id "${id}" is already registered`);
    }

    const schema = {
      input: resolveActionSchema(id, 'input', options.schema.input, 'input'),
      output: resolveActionSchema(
        id,
        'output',
        options.schema.output,
        'output',
      ),
      ...(options.schema.secrets && {
        secrets: resolveActionSchema(
          id,
          'secrets',
          options.schema.secrets,
          'input',
        ),
      }),
    };

    if (options.visibilityPermission) {
      this.permissionsRegistry.addPermissions([options.visibilityPermission]);
    }

    this.actions.set(id, { ...options, schema });
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

function resolveActionSchema(
  actionId: string,
  schemaKind: 'input' | 'output' | 'secrets',
  schema: ActionsRegistryActionSchema,
  conversion: 'input' | 'output',
): ResolvedActionSchema {
  const standard = schema?.['~standard'];
  if (!standard || typeof standard.validate !== 'function') {
    throw new Error(
      `The ${schemaKind} schema for action "${actionId}" is not a valid Standard Schema`,
    );
  }
  if (
    typeof standard.jsonSchema?.input !== 'function' ||
    typeof standard.jsonSchema?.output !== 'function'
  ) {
    throw new Error(
      `The ${schemaKind} schema for action "${actionId}" does not support Standard JSON Schema conversion`,
    );
  }

  let jsonSchema: Record<string, unknown>;
  try {
    jsonSchema = standard.jsonSchema[conversion]({ target: 'draft-07' });
  } catch (error) {
    throw new Error(
      `The ${schemaKind} schema for action "${actionId}" could not be converted to draft-07 JSON Schema`,
      { cause: error },
    );
  }

  return {
    async validate(value) {
      return await standard.validate(value);
    },
    jsonSchema,
  };
}

function formatValidationIssues(
  issues: ReadonlyArray<{
    message: string;
    path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>;
  }>,
): Error {
  return new Error(
    issues
      .map(issue => {
        const path = issue.path
          ?.map(segment =>
            String(typeof segment === 'object' ? segment.key : segment),
          )
          .join('.');
        return path ? `${issue.message} at '${path}'` : issue.message;
      })
      .join('; '),
  );
}
