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
  BackstageCredentials,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { InputError, NotFoundError } from '@backstage/errors';
import { JsonObject, JsonValue } from '@backstage/types';
import { mockCredentials } from '../../services';
import {
  ActionsRegistryActionOptions,
  ActionsRegistryActionSchema,
  ActionsRegistryService,
  ActionsService,
  ActionsServiceAction,
} from '@backstage/backend-plugin-api/alpha';

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

/**
 * A mock implementation of the ActionsRegistryService and ActionsService that can be used in tests.
 *
 * This is useful for testing actions that are registered with the ActionsRegistryService and ActionsService.
 *
 * The plugin ID is hardcoded to `testing` in the mock implementation.
 *
 * @example
 * ```ts
 * const actionsRegistry = mockServices.actionsRegistry();
 *
 * actionsRegistry.register({
 *   name: 'test',
 *   title: 'Test',
 *   description: 'Test',
 *   schema: {
 *     input: z.object({ name: z.string() }),
 *     output: z.object({ name: z.string() }),
 *   },
 *   action: async ({ input }) => ({ output: { name: input.name } }),
 * });
 *
 *
 * const result = await actionsRegistry.invoke({
 *   id: 'testing:test',
 *   input: { name: 'test' },
 * });
 *
 * expect(result).toEqual({ output: { name: 'test' } });
 * ```
 *
 * @alpha
 */
export class MockActionsRegistry
  implements ActionsRegistryService, ActionsService
{
  private readonly logger: LoggerService;

  private constructor(logger: LoggerService) {
    this.logger = logger;
  }

  static create(opts: { logger: LoggerService }) {
    return new MockActionsRegistry(opts.logger);
  }

  readonly actions: Map<string, ActionsRegistryActionOptions<any, any, any>> =
    new Map();

  private readonly resolvedActions = new Map<string, RegisteredAction>();

  async list(): Promise<{ actions: ActionsServiceAction[] }> {
    return {
      actions: Array.from(this.resolvedActions.entries()).map(
        ([id, action]) => ({
          id,
          pluginId: 'test',
          name: action.name,
          title: action.title,
          description: action.description,
          attributes: {
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
          } as ActionsServiceAction['schema'],
        }),
      ),
    };
  }

  async invoke(opts: {
    id: string;
    input?: JsonObject;
    secrets?: JsonObject;
    credentials?: BackstageCredentials;
  }): Promise<{ output: JsonValue }> {
    const action = this.resolvedActions.get(opts.id);

    if (!action) {
      const availableActionIds = Array.from(this.actions.keys()).join(', ');
      throw new NotFoundError(
        `Action "${opts.id}" not found, available actions: ${
          availableActionIds ? `"${availableActionIds}"` : 'none'
        }`,
      );
    }

    const input = await action.schema.input.validate(opts.input);

    if (input.issues) {
      throw new InputError(
        `Invalid input to action "${opts.id}"`,
        formatValidationIssues(input.issues),
      );
    }

    if (action.schema.secrets && !opts.secrets) {
      throw new InputError(
        `Action "${opts.id}" requires secrets but none were provided`,
      );
    }

    if (!action.schema.secrets && opts.secrets) {
      throw new InputError(`Action "${opts.id}" does not accept secrets`);
    }

    const secrets = action.schema.secrets
      ? await action.schema.secrets.validate(opts.secrets)
      : ({ value: undefined } as const);

    if (secrets.issues) {
      throw new InputError(
        `Invalid secrets for action "${opts.id}"`,
        formatValidationIssues(secrets.issues),
      );
    }

    const result = await action.action({
      input: input.value,
      secrets: secrets.value,
      credentials: opts.credentials ?? mockCredentials.none(),
      logger: this.logger,
    });

    const output = await action.schema.output.validate(result?.output);

    if (output.issues) {
      throw new InputError(
        `Invalid output from action "${opts.id}"`,
        formatValidationIssues(output.issues),
      );
    }

    return { output: output.value as JsonValue };
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
    // hardcode test: prefix similar to how the default actions registry does it
    // and other places around the testing ecosystem:
    // https://github.com/backstage/backstage/blob/a9219496d5c073aaa0b8caf32ece10455cf65e61/packages/backend-test-utils/src/next/services/mockServices.ts#L321
    // https://github.com/backstage/backstage/blob/861f162b4a39117b824669d67a951ed1db142e3d/packages/backend-test-utils/src/next/wiring/ServiceFactoryTester.ts#L99
    const id = `test:${options.name}`;

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

    this.actions.set(id, options);
    this.resolvedActions.set(id, { ...options, schema });
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
