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

export function ensureValidId(id: string, msg: string): string {
  const valid = id
    .split('.')
    .flatMap(part => part.split('-'))
    .flatMap(part => part.split(':'))
    .every(part => part.match(/^[a-z][a-z0-9]*$/));
  if (!valid) {
    throw new Error(
      `${msg}: Must only contain period separated lowercase alphanum ` +
        `tokens with dashes and colons, got '${id}'`,
    );
  }
  return id;
}
