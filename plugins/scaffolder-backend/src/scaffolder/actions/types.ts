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
import { TemplateAction } from '@backstage/plugin-scaffolder-node';

/**
 * @public
 * @deprecated this type is deprecated, and there will be a new way to create Workers in the next major version.
 */
export interface TemplateActionRegistry {
  register(action: TemplateAction<any, any, any>): void;
  get(actionId: string): Promise<TemplateAction<any, any, any>>;
  list(): Promise<TemplateAction<any, any, any>[]>;
}
