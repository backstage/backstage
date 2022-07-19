/*
 * Copyright 2022 The Backstage Authors
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
 * Parses the given authorization header and returns the bearer token, or
 * undefined if no bearer token is given.
 *
 * @remarks
 *
 * This function is explicitly built to tolerate bad inputs safely, so you may
 * call it directly with e.g. the output of `req.header('authorization')`
 * without first checking that it exists.
 *
 * @public
 */
export function getBearerTokenFromAuthorizationHeader(
  authorizationHeader: unknown,
): string | undefined {
  if (typeof authorizationHeader !== 'string') {
    return undefined;
  }
  const matches = authorizationHeader.match(/^Bearer[ ]+(\S+)$/i);
  return matches?.[1];
}
