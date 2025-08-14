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
 * @alpha
 */
export interface ActionsRegistryService {
  register<
    TInputSchema extends AnyZodObject,
    TOutputSchema extends AnyZodObject,
  >(
    options: ActionsRegistryActionOptions<TInputSchema, TOutputSchema>,
  ): void;
}
