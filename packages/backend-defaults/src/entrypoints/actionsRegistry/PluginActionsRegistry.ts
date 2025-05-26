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
  ActionsRegistryAction,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import PromiseRouter from 'express-promise-router';
import { Router, json } from 'express';
import { z, ZodType } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { InputError, NotFoundError } from '@backstage/errors';

export class PluginActionsRegistry {
  private constructor(
    private readonly actions: Map<
      string,
      ActionsRegistryAction<ZodType, ZodType>
    >,
    private readonly router: Router,
    private readonly logger: LoggerService,
    private readonly httpAuth: HttpAuthService,
  ) {
    this.bindRoutes();
  }

  static create({
    httpAuth,
    logger,
  }: {
    httpAuth: HttpAuthService;
    logger: LoggerService;
  }): PluginActionsRegistry {
    return new PluginActionsRegistry(
      new Map(),
      PromiseRouter(),
      logger,
      httpAuth,
    );
  }

  getRouter(): Router {
    return this.router;
  }

  register<TInputSchema extends ZodType, TOutputSchema extends ZodType>(
    options: ActionsRegistryAction<TInputSchema, TOutputSchema>,
  ): void {
    this.actions.set(options.id, options as ActionsRegistryAction<any, any>);
  }

  private bindRoutes() {
    this.router.use(json());

    this.router.get('/.backstage/v1/actions', (_, res) => {
      return res.json({
        actions: Array.from(this.actions.entries()).map(([_id, action]) => ({
          ...action,
          schema: {
            input: action.schema?.input
              ? zodToJsonSchema(action.schema.input)
              : zodToJsonSchema(z.any()),
            output: action.schema?.output
              ? zodToJsonSchema(action.schema.output)
              : zodToJsonSchema(z.any()),
          },
        })),
      });
    });

    this.router.post(
      '/.backstage/v1/actions/:actionId/invoke',
      async (req, res) => {
        const action = this.actions.get(req.params.actionId);

        if (!action) {
          throw new NotFoundError(`Action "${req.params.actionId}" not found`);
        }

        const input = action.schema?.input
          ? action.schema.input.safeParse(req.body)
          : ({ success: true, data: undefined } as const);

        if (!input.success) {
          throw new InputError(
            `Invalid input to action "${req.params.actionId}"`,
            input.error,
          );
        }

        const credentials = await this.httpAuth.credentials(req);

        const result = await action.action({
          input: input.data,
          credentials,
          logger: this.logger,
        });

        const output = action.schema?.output
          ? action.schema.output.safeParse(result)
          : ({ success: true, data: result } as const);

        if (!output.success) {
          throw new InputError(
            `Invalid output from action "${req.params.actionId}"`,
            output.error,
          );
        }

        return res.json({ response: output.data });
      },
    );
  }
}
