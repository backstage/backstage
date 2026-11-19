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

/**
 * Alpha entrypoint for the reference raw shell tool server.
 *
 * @remarks
 * Everything here follows the managed AI service's alpha compatibility policy
 * until the underlying seams settle; consume it from
 * `@backstage/ai-node-shell/alpha`.
 *
 * @packageDocumentation
 * @alpha
 */

export {
  createRawShellToolModule,
  rawShellToolModule,
} from './rawShellToolModule';
export type {
  RawShellArguments,
  RawShellResult,
  RawShellToolOptions,
} from './rawShellToolModule';
