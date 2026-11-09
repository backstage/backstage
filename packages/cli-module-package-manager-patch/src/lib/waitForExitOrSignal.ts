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

import { RunChildProcess } from '@backstage/cli-common';

/**
 * Thrown when a child process was terminated by a signal rather than exiting
 * on its own.
 */
export class SignalTerminatedError extends Error {
  constructor(readonly signal: string) {
    super(`Process was terminated by signal ${signal}`);
    this.name = 'SignalTerminatedError';
  }
}

/**
 * Like `child.waitForExit()`, but also rejects if the child was terminated by
 * a signal, which waitForExit treats as a successful exit.
 */
export async function waitForExitOrSignal(
  child: RunChildProcess,
): Promise<void> {
  await child.waitForExit();
  if (child.signalCode) {
    throw new SignalTerminatedError(child.signalCode);
  }
}
