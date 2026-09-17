/*
 * Copyright 2024 The Backstage Authors
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

export interface Config {
  /** Configuration options for the auth plugin */
  auth?: {
    providers: {
      guest?: {
        /**
         * The entity reference to use for the guest user.
         * @default user:development/guest
         */
        userEntityRef?: string;

        /**
         * A list of entity references to user for ownership of the guest user if the user
         *  is not found in the catalog.
         * @default [userEntityRef]
         */
        ownershipEntityRefs?: string[];

        /**
         * Allow users to sign in with the guest provider outside of their development environments.
         */
        dangerouslyAllowOutsideDevelopment?: boolean;
      };
    };
  };
}
