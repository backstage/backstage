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

import { JsonValue } from '@backstage/types';

/**
 * Parameters used to issue new ID Tokens
 *
 * @public
 */
export type TokenParams = {
  /**
   * The claims that will be embedded within the token. At a minimum, this should include
   * the subject claim, `sub`. It is common to also list entity ownership relations in the
   * `ent` list. Additional claims may also be added at the developer's discretion except
   * for the following list, which will be overwritten by the TokenIssuer: `iss`, `aud`,
   * `iat`, and `exp`. The Backstage team also maintains the right add new claims in the future
   * without listing the change as a "breaking change".
   */
  claims: {
    /** The token subject, i.e. User ID */
    sub: string;
    /** A list of entity references that the user claims ownership through */
    ent?: string[];
  } & Record<string, JsonValue>;
};
