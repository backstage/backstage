/*
 * Copyright 2021 The Backstage Authors
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

import { DateTime, Duration } from 'luxon';
import { AbortController, AbortSignal } from 'node-abort-controller';

export type ContextAbortState = {
  signal: AbortSignal;
  promise: Promise<void>;
  deadline: DateTime | undefined;
  abort: () => void;
};

export function abortManually(
  previous?: ContextAbortState | undefined,
): ContextAbortState {
  const controller = new AbortController();
  const abort = controller.abort.bind(controller);
  previous?.signal.addEventListener('abort', abort);

  return {
    signal: controller.signal,
    promise: new Promise<void>(resolve => {
      controller.signal.addEventListener('abort', resolve);
    }),
    deadline: previous?.deadline,
    abort,
  };
}

export function abortOnTimeout(
  timeout: Duration,
  previous?: ContextAbortState | undefined,
): ContextAbortState {
  const deadline = DateTime.now().plus(timeout);
  if (previous?.deadline && deadline > previous.deadline) {
    return previous;
  }

  const controller = new AbortController();

  const timeoutHandle = setTimeout(() => {
    controller.abort();
  }, timeout.as('milliseconds'));

  const abort = () => {
    previous?.signal.removeEventListener('abort', abort);
    clearTimeout(timeoutHandle);
    controller.abort();
  };

  previous?.signal.addEventListener('abort', abort);

  return {
    signal: controller.signal,
    promise: new Promise<void>(resolve => {
      controller.signal.addEventListener('abort', resolve);
    }),
    deadline,
    abort,
  };
}
