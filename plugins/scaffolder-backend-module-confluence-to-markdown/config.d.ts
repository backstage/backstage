/*
 * Copyright 2023 The Backstage Authors
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
  /** Configuration options for the Confluence to Markdown action */
  confluence?: {
    /**
     * The base URL for accessing the Confluence API
     */
    baseUrl: string;
    /**
     * Authentication method - basic, bearer, username/password
     */
    auth: 'basic' | 'bearer' | 'userpass';
    /**
     * Token used for the basic and bearer auth methods
     * @visibility secret
     */
    token?: string;
    /**
     * Email encoded with the token for the bearer auth method
     * @visibility secret
     */
    email?: string;
    /**
     * Username used with the Username/Password auth method
     * @visibility secret
     */
    username?: string;
    /**
     * Password used with the Username/Password auth method
     * @visibility secret
     */
    password?: string;
  };
}
