/*
 * Copyright 2020 The Backstage Authors
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

import { injectConfigIntoHtml } from './injectConfigIntoHtml';
import { injectConfigIntoStatic } from './injectConfigIntoStatic';
import { InjectOptions } from './types';

/**
 * Injects configs into the app bundle, replacing any existing injected config.
 * @internal
 */
export async function injectConfig(
  options: InjectOptions,
): Promise<string | undefined> {
  // In order to minimize the potential impact when rolling out the new config
  // injection, we use both methods for a few releases. This allows the frontend
  // app to be behind the backend by a version or two, but temporarily increases
  // config injection overhead.
  // TODO(Rugvip): After the 1.32 release we can stop calling the static injection if the HTML one is successful
  await injectConfigIntoHtml(options);

  return injectConfigIntoStatic(options);
}
