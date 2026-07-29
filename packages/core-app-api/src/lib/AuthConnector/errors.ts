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

/**
 * Thrown by an AuthConnector when a session refresh could not reach the backend
 * because of a network/connectivity problem, as opposed to the backend actively
 * rejecting the session.
 *
 * The browser can briefly lose connectivity — most commonly right after the
 * machine wakes from sleep — which makes the refresh `fetch` reject even though
 * the session is still valid. Session managers use this to tell a retryable
 * transient failure apart from an authentication failure, so they don't wipe
 * the session or escalate to an interactive login prompt for something that
 * will succeed on the next attempt.
 */
export class AuthConnectionError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'AuthConnectionError';
    if (cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = cause;
    }
  }
}

/**
 * Type guard for {@link AuthConnectionError}. Also matches by name so it keeps
 * working across module/realm boundaries where `instanceof` can be unreliable.
 */
export function isAuthConnectionError(
  error: unknown,
): error is AuthConnectionError {
  return (
    error instanceof AuthConnectionError ||
    (error instanceof Error && error.name === 'AuthConnectionError')
  );
}
