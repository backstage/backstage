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
import { z, ZodType } from 'zod';
import { LoggerService } from './LoggerService';
import { BackstageCredentials } from './AuthService';

export type ActionsRegistryActionContext<TInputSchema extends ZodType> = {
  input: z.infer<TInputSchema>;
  logger: LoggerService;
  credentials: BackstageCredentials;
};

// todo: opaque type?
export type ActionsRegistryAction<
  TInputSchema extends ZodType,
  TOutputSchema extends ZodType,
> = {
  id: string;
  name: string;
  title: string;
  description: string;
  // todo: what about additional metadata?
  schema?: {
    input?: TInputSchema;
    output?: TOutputSchema;
  };
  action: (
    context: ActionsRegistryActionContext<TInputSchema>,
  ) => Promise<TOutputSchema extends ZodType ? z.infer<TOutputSchema> : void>;
};

export type ActionsRegistryActionOptions<
  TInputSchema extends ZodType,
  TOutputSchema extends ZodType,
> = {
  name: string;
  title: string;
  description: string;
  // todo: what about additional metadata?
  schema?: {
    input?: (zod: typeof z) => TInputSchema;
    output?: (zod: typeof z) => TOutputSchema;
  };
  action: (
    context: ActionsRegistryActionContext<TInputSchema>,
  ) => Promise<TOutputSchema extends ZodType ? z.infer<TOutputSchema> : void>;
};

export interface ActionsRegistryService {
  register<TInputSchema extends ZodType, TOutputSchema extends ZodType>(
    options: ActionsRegistryActionOptions<TInputSchema, TOutputSchema>,
  ): void;
}
