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
import { BasicPermission } from '@backstage/plugin-permission-common';
import { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec';
import {
  LoggerService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';

/**
 * @alpha
 */
export type ActionsRegistryActionContext<
  TInputSchema extends ActionsRegistryActionSchema,
  TSecretsSchema extends ActionsRegistryActionSchema | undefined = undefined,
> = {
  /** The action input after validation and any schema transformations. */
  input: StandardSchemaV1.InferOutput<TInputSchema>;
  /** The action secrets after validation and any schema transformations. */
  secrets: TSecretsSchema extends ActionsRegistryActionSchema
    ? StandardSchemaV1.InferOutput<TSecretsSchema>
    : undefined;
  logger: LoggerService;
  credentials: BackstageCredentials;
};

/**
 * A schema used by an action registry action.
 *
 * The schema must support Standard Schema validation, including asynchronous
 * validation, and Standard JSON Schema conversion for draft-07.
 *
 * @alpha
 */
export type ActionsRegistryActionSchema<
  TInput = unknown,
  TOutput = TInput,
> = StandardSchemaV1<TInput, TOutput> & StandardJSONSchemaV1<TInput, TOutput>;

/**
 * An example of how to use an action registered in the actions registry.
 *
 * @alpha
 */
export type ActionsRegistryActionExample<
  TInputSchema extends ActionsRegistryActionSchema,
  TOutputSchema extends ActionsRegistryActionSchema,
> = {
  title: string;
  description?: string;
  /** Example input as supplied by an action caller, before validation. */
  input: StandardSchemaV1.InferInput<TInputSchema>;
  /** Example output as observed by an action caller, after validation. */
  output?: StandardSchemaV1.InferOutput<TOutputSchema>;
};

/**
 * @alpha
 */
export type ActionsRegistryActionOptions<
  TInputSchema extends ActionsRegistryActionSchema,
  TOutputSchema extends ActionsRegistryActionSchema,
  TSecretsSchema extends ActionsRegistryActionSchema | undefined = undefined,
> = {
  name: string;
  title: string;
  description: string;
  schema: {
    /** Validates invocation input and describes its wire format. */
    input: TInputSchema;
    /** Validates action output and describes its observable format. */
    output: TOutputSchema;
    /** Validates invocation secrets and describes their wire format. */
    secrets?: TSecretsSchema extends ActionsRegistryActionSchema
      ? TSecretsSchema
      : never;
  };
  examples?: Array<ActionsRegistryActionExample<TInputSchema, TOutputSchema>>;
  visibilityPermission?: BasicPermission;
  attributes?: {
    /**
     * Whether the action may perform destructive updates. Defaults to `false`
     * when `readOnly` is `true`, and `true` otherwise.
     */
    destructive?: boolean;
    idempotent?: boolean;
    /** Whether the action only reads from its environment. Defaults to `false`. */
    readOnly?: boolean;
  };
  action: (
    context: ActionsRegistryActionContext<TInputSchema, TSecretsSchema>,
  ) => Promise<
    StandardSchemaV1.InferInput<TOutputSchema> extends void
      ? void
      : { output: StandardSchemaV1.InferInput<TOutputSchema> }
  >;
};

/**
 * @alpha
 */
export interface ActionsRegistryService {
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
  ): void;
}
