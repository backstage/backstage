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
import { z, AnyZodObject } from 'zod';
import {
  LoggerService,
  BackstageCredentials,
} from '@backstage/backend-plugin-api';

/**
 * @alpha
 */
export type ActionsRegistryActionContext<TInputSchema extends AnyZodObject> = {
  input: z.infer<TInputSchema>;
  logger: LoggerService;
  credentials: BackstageCredentials;
};

/**
 * @alpha
 */
export type ActionsRegistryActionOptions<
  TInputSchema extends AnyZodObject,
  TOutputSchema extends AnyZodObject,
> = {
  name: string;
  title: string;
  description: string;
  schema: {
    input: (zod: typeof z) => TInputSchema;
    output: (zod: typeof z) => TOutputSchema;
  };
  attributes?: {
    destructive?: boolean;
    idempotent?: boolean;
    readOnly?: boolean;
  };
  action: (
    context: ActionsRegistryActionContext<TInputSchema>,
  ) => Promise<
    z.infer<TOutputSchema> extends void
      ? void
      : { output: z.infer<TOutputSchema> }
  >;
};

/**
 * Options for registering a prompt with the Actions Registry.
 * Prompts provide context and guidance to AI clients about how to use actions.
 * @alpha
 */
export type ActionsRegistryPromptOptions<TArgsSchema extends AnyZodObject> = {
  /** Unique identifier for the prompt */
  name: string;
  /** Human-readable title */
  title: string;
  /** Detailed description of what this prompt does */
  description: string;
  /** The template text that provides context to AI clients */
  template: string;
  /** Optional schema for prompt arguments */
  argsSchema?: (zod: typeof z) => TArgsSchema;
};

/**
 * Options for registering a resource with the Actions Registry.
 * Resources provide browsable, read-only data that AI clients can access for context.
 * @alpha
 */
export type ActionsRegistryResourceOptions = {
  /** Unique identifier for the resource */
  name: string;
  /** URI template for the resource (e.g., "catalog://entities/{kind}") */
  uri: string;
  /** Human-readable title */
  title: string;
  /** Detailed description of what this resource provides */
  description: string;
  /** MIME type of the resource content */
  mimeType?: string;
  /** Handler function that provides the resource content */
  handler: (
    uri: URL,
    params: Record<string, string>,
    context: { credentials: BackstageCredentials; logger: LoggerService },
  ) => Promise<{
    contents: Array<{
      uri: string;
      text: string;
      mimeType?: string;
    }>;
  }>;
};

/**
 * @alpha
 */
export interface ActionsRegistryService {
  register<
    TInputSchema extends AnyZodObject,
    TOutputSchema extends AnyZodObject,
  >(
    options: ActionsRegistryActionOptions<TInputSchema, TOutputSchema>,
  ): void;

  /**
   * Register a prompt that provides context and guidance to AI clients.
   * Prompts help AI understand how to use available actions effectively.
   */
  registerPrompt<TArgsSchema extends AnyZodObject>(
    options: ActionsRegistryPromptOptions<TArgsSchema>,
  ): void;

  /**
   * Register a resource that provides browsable, read-only data.
   * Resources give AI clients contextual information about the system.
   */
  registerResource(options: ActionsRegistryResourceOptions): void;
}
