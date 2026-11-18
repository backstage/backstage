/*
 * Copyright 2026 The Backstage Authors
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

/** TypeSafe provider modules for the managed AI service. @packageDocumentation */

/** The alpha entrypoint; the main entrypoint intentionally exposes nothing. */

import type { AiProviderModule } from '@backstage/ai-node/modules';

import { typesafeSystemOne } from './typesafeSystemOne';

export { typesafeSystemOne } from './typesafeSystemOne';

/**
 * Every TypeSafe provider module, ready to register.
 *
 * @alpha
 */
export const typesafeProviderModules: readonly AiProviderModule[] =
  Object.freeze([typesafeSystemOne]);
