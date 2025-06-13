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
  ActionsRegistryActionOptions,
  ActionsRegistryService,
  ActionsService,
  ActionsServiceAction,
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { ForwardedError, InputError, NotFoundError } from '@backstage/errors';
import { JsonObject, JsonValue } from '@backstage/types';
import { z, AnyZodObject } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { mockCredentials } from './mockCredentials';

export class MockActionsRegistry
  implements ActionsRegistryService, ActionsService
{
  private constructor(private readonly logger: LoggerService) {}

  static create(opts: { logger: LoggerService }) {
    return new MockActionsRegistry(opts.logger);
  }

  readonly actions: Map<string, ActionsRegistryActionOptions<any, any>> =
    new Map();

  async list(): Promise<{ actions: ActionsServiceAction[] }> {
    return {
      actions: Array.from(this.actions.entries()).map(([id, action]) => ({
        id,
        name: action.name,
        title: action.title,
        description: action.description,
        attributes: {
          // todo(blam): what's safe defaults?
          destructive: action.attributes?.destructive ?? false,
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
        } as ActionsServiceAction['schema'],
      })),
    };
  }

  async invoke(opts: {
    id: string;
    input?: JsonObject;
    credentials?: BackstageCredentials;
  }): Promise<{ output: JsonValue }> {
    const action = this.actions.get(opts.id);

    if (!action) {
      const availableActionIds = Array.from(this.actions.keys()).join(', ');
      throw new NotFoundError(
        `Action "${opts.id}" not found, available actions: ${
          availableActionIds ? `"${availableActionIds}"` : 'none'
        }`,
      );
    }

    const input = action.schema?.input
      ? action.schema.input(z).safeParse(opts.input)
      : ({ success: true, data: undefined } as const);

    if (!input.success) {
      throw new InputError(`Invalid input to action "${opts.id}"`, input.error);
    }

    try {
      const result = await action.action({
        input: input.data,
        credentials: opts.credentials ?? mockCredentials.none(),
        logger: this.logger,
      });

      const output = action.schema?.output
        ? action.schema.output(z).safeParse(result?.output)
        : ({ success: true, data: result?.output } as const);

      if (!output.success) {
        throw new InputError(
          `Invalid output from action "${opts.id}"`,
          output.error,
        );
      }

      return { output: output.data };
    } catch (error) {
      throw new ForwardedError(
        `Failed execution of action "${opts.id}"`,
        error,
      );
    }
  }

  register<
    TInputSchema extends AnyZodObject,
    TOutputSchema extends AnyZodObject,
  >(options: ActionsRegistryActionOptions<TInputSchema, TOutputSchema>): void {
    // hardcode testing: prefix similar to how the default actions registry does it
    const id = `testing:${options.name}`;

    if (this.actions.has(id)) {
      throw new Error(`Action with id "${id}" is already registered`);
    }

    this.actions.set(id, options);
  }
}
