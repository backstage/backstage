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

// @types/marked-terminal only covers v6 and is incompatible with
// marked-terminal v7 + marked v15. This declaration covers our usage.
declare module 'marked-terminal' {
  import type { MarkedExtension } from 'marked';

  export function markedTerminal(): MarkedExtension;
}
