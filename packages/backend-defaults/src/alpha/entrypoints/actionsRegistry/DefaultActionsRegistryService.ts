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
  HttpAuthService,
  LoggerService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import PromiseRouter from 'express-promise-router';
import { Router, json } from 'express';
import { z, AnyZodObject } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  ActionsRegistryActionOptions,
  ActionsRegistryPromptOptions,
  ActionsRegistryResourceOptions,
  ActionsRegistryService,
} from '@backstage/backend-plugin-api/alpha';
import {
  ForwardedError,
  InputError,
  NotAllowedError,
  NotFoundError,
} from '@backstage/errors';

export class DefaultActionsRegistryService implements ActionsRegistryService {
  private actions: Map<string, ActionsRegistryActionOptions<any, any>> =
    new Map();
  private prompts: Map<string, ActionsRegistryPromptOptions<any>> = new Map();
  private resources: Map<string, ActionsRegistryResourceOptions> = new Map();

  private readonly logger: LoggerService;
  private readonly httpAuth: HttpAuthService;
  private readonly auth: AuthService;
  private readonly metadata: PluginMetadataService;

  private constructor(
    logger: LoggerService,
    httpAuth: HttpAuthService,
    auth: AuthService,
    metadata: PluginMetadataService,
  ) {
    this.logger = logger;
    this.httpAuth = httpAuth;
    this.auth = auth;
    this.metadata = metadata;
  }

  static create({
    httpAuth,
    logger,
    auth,
    metadata,
  }: {
    httpAuth: HttpAuthService;
    logger: LoggerService;
    auth: AuthService;
    metadata: PluginMetadataService;
  }): DefaultActionsRegistryService {
    return new DefaultActionsRegistryService(logger, httpAuth, auth, metadata);
  }

  createRouter(): Router {
    const router = PromiseRouter();
    router.use(json());

    router.get('/.backstage/actions/v1/actions', (_, res) => {
      return res.json({
        actions: Array.from(this.actions.entries()).map(([id, action]) => ({
          id,
          ...action,
          attributes: {
            // Inspired by the @modelcontextprotocol/sdk defaults for the hints.
            // https://github.com/modelcontextprotocol/typescript-sdk/blob/dd69efa1de8646bb6b195ff8d5f52e13739f4550/src/types.ts#L777-L812
            destructive: action.attributes?.destructive ?? true,
            idempotent: action.attributes?.idempotent ?? false,
            readOnly: action.attributes?.readOnly ?? false,
          },
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
        if (this.auth.isPrincipal(credentials, 'user')) {
          if (!credentials.principal.actor) {
            throw new NotAllowedError(
              `Actions must be invoked by a service, not a user`,
            );
          }
        } else if (this.auth.isPrincipal(credentials, 'none')) {
          throw new NotAllowedError(
            `Actions must be invoked by a service, not an anonymous request`,
          );
        }

        const action = this.actions.get(req.params.actionId);

        if (!action) {
          throw new NotFoundError(`Action "${req.params.actionId}" not found`);
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

        try {
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
        } catch (error) {
          throw new ForwardedError(
            `Failed execution of action "${req.params.actionId}"`,
            error,
          );
        }
      },
    );

    router.get('/.backstage/actions/v1/prompts', (_, res) => {
      return res.json({
        prompts: Array.from(this.prompts.entries()).map(([id, prompt]) => ({
          id,
          name: prompt.name,
          title: prompt.title,
          description: prompt.description,
          template: prompt.template,
          argsSchema: prompt.argsSchema
            ? zodToJsonSchema(prompt.argsSchema(z))
            : undefined,
        })),
      });
    });

    router.get('/.backstage/actions/v1/resources', (_, res) => {
      return res.json({
        resources: Array.from(this.resources.entries()).map(([id, resource]) => ({
          id,
          name: resource.name,
          uri: resource.uri,
          title: resource.title,
          description: resource.description,
          mimeType: resource.mimeType,
        })),
      });
    });

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

    this.actions.set(id, options);
  }

  registerPrompt<TArgsSchema extends AnyZodObject>(
    options: ActionsRegistryPromptOptions<TArgsSchema>,
  ): void {
    const id = `${this.metadata.getId()}:${options.name}`;

    if (this.prompts.has(id)) {
      throw new Error(`Prompt with id "${id}" is already registered`);
    }

    this.prompts.set(id, options);
  }

  registerResource(options: ActionsRegistryResourceOptions): void {
    const id = `${this.metadata.getId()}:${options.name}`;

    if (this.resources.has(id)) {
      throw new Error(`Resource with id "${id}" is already registered`);
    }

    this.resources.set(id, options);
  }
}
