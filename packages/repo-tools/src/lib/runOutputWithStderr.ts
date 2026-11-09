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

import { runOutput } from '@backstage/cli-common';

/**
 * Like runOutput, but a failure includes the stderr of the child process in
 * the error message, so that it is visible to whoever sees the error.
 */
export async function runOutputWithStderr(
  args: string[],
  options?: Parameters<typeof runOutput>[1],
): Promise<string> {
  try {
    return await runOutput(args, options);
  } catch (error) {
    const stderr = (error as { stderr?: string }).stderr?.trim();
    if (stderr && error instanceof Error) {
      error.message = `${error.message}\n${stderr}`;
    }
    throw error;
  }
}
