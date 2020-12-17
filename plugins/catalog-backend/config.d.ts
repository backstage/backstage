/*
 * Copyright 2020 Spotify AB
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

import { JsonValue } from '@backstage/config';

export interface Config {
  /** Configuration options for the catalog plugin */
  catalog?: {
    /**
     * Rules to apply to catalog entities - accepts an array of objects with below attributes
     *  attr: 'allow' - accepts an array of string. e.g. [Component, API, Group, User, Template, Location]
     *  opt-attr: 'locations' - accepts an array of key, value pair objects.
     *    keys: 'target', 'type'
     *    e.g.[{type: url, target: https://github.com}]
     */
    rules?: Array<{
      allow: Array<string>;
      locations?: Array<{ [key: string]: string }>;
    }>;
    /**
     * List of processor options and attributes
     */
    processors?: {
      /**
       * Github processor configuration
       */
      githubOrg?: {
        /**
         * attr: 'providers' - accepts an array of objects with below attributes
         */
        providers: Array<{
          /**
           * attr: 'target' - accepts url string
           * e.g. https://ghe.example.net
           */
          target: string;
          /**
           * opt-attr: 'apiBaseUrl' - accepts baseurl string
           * e.g. https://ghe.example.net/api
           */
          apiBaseUrl?: string;
          /**
           * opt-attr: 'token' - secret token to authenticate
           * e.g. {"$env": "GITHUB_TOKEN"}
           * @visibility secret
           * */
          token?: string;
        }>;
      };
      /**
       * LdapOrg processor configuration
       */
      ldapOrg?: {
        /**
         * attr: 'providers' - accepts an array of objects with below attributes
         */
        providers: {
          /**
           * attr: 'target' - accepts url string e.g. ldaps://ds.example.net
           */
          target: string;
          /**
           * The settings to use for the a command
           * opt-attr: 'bind' - accepts key value pair object
           * e.g. {"dn": "uid=ldap-reader-user","secret": {"$secret": {"env": "LDAP_SECRET"}}}
           */
          bind?: {
            /**
             * attr: 'dn' - accepts string with ldap related parameters
             * e.g. "dn": "uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net"
             */
            dn: string;
            /**
             * secret used to authenticate.
             * e.g. {"$secret": {"env": "LDAP_SECRET"}
             * @visibility secret
             * */
            secret: Object;
          };
          /**
           * The settings that govern the reading and interpretation of users.
           * attr: 'users' - accepts key value pair object
           */
          users: {
            /**
             * attr: 'dn' - accepts string with user governing parameters
             * e.g. "dn": "ou=people,ou=example,dc=example,dc=net"
             */

            dn: string;
            /**
             * attr: 'options' - accepts an object of key value pair
             * keys: 'scope', 'filter', 'attributes', 'sizeLimit', 'timeLimit', 'derefAliases', 'typesOnly', 'paged'
             */
            options: { [key: string]: string | boolean | number };
            /**
             * opt-attr: 'set - accepts an object of key value pair
             * keys: 'path', 'value'
             */
            set?: { [key: string]: string | JsonValue };
            /**
             * attr: 'map' - accepts an object og key value pair
             * keys: 'rdn', 'name', 'description', 'displayName', 'email', 'picture', 'memberOf'
             */
            map: { [key: string]: string };
          };
          /**
           * The settings that govern the reading and interpretation of groups.
           * attr: 'groups' - accepts key value pair object
           */
          groups: {
            /**
             * attr: 'dn' - accepts string with user governing parameters
             * e.g. "dn": "ou=people,ou=example,dc=example,dc=net"
             */

            dn: string;
            /**
             * attr: 'options' - accepts an object of key value pair
             * keys: 'scope', 'filter', 'attributes', 'sizeLimit', 'timeLimit', 'derefAliases', 'typesOnly', 'paged'
             */
            options: { [key: string]: string | boolean | number };
            /**
             * opt-attr: 'set - accepts an object of key value pair
             * keys: 'path', 'value'
             */
            set?: { [key: string]: string | JsonValue };
            /**
             * attr: 'map' - accepts an object og key value pair
             * keys: 'rdn', 'name', 'description', 'displayName', 'email', 'picture', 'memberOf'
             */
            map: { [key: string]: string };
          };
        };
      };
      /**
       * microsoftGraphOrg processor configuration
       */
      microsoftGraphOrg?: {
        /**
         * attr: 'providers' - accepts object with below attributes
         */
        providers: {
          /**
           * attr: 'target' - accepts string
           * e.g. https://graph.microsoft.com/v1.0
           */

          target: string;
          /**
           * attr: 'authority' - accepts string
           * e.g. https://login.microsoftonline.com
           */

          authority: string;
          /**
           * attr: 'tenantId' - accepts string
           * e.g. {"$env": "MICROSOFT_GRAPH_TENANT_ID"}
           * @visibility secret
           */

          tenantId: string;
          /**
           * attr: 'clientId' - accepts string
           * e.g. {"$env": "MICROSOFT_GRAPH_CLIENT_ID"}
           * @visibility secret
           */

          clientId: string;
          /**
           * attr: 'clientSecret' - accepts string
           * e.g. {"$env": "MICROSOFT_GRAPH_CLIENT_SECRET_TOKEN"}
           * @visibility secret
           */

          clientSecret: string;
          /**
           * opt-attr: 'userFilter' - accepts string
           * e.g. accountEnabled eq true and userType eq 'member'
           */

          userFilter?: string;
          /**
           * opt-attr: 'groupFilter' - accepts string
           * e.g. securityEnabled eq false and mailEnabled eq true
           */

          groupFilter?: string;
        };
      };
    };
    /**
     * Location specific rules used in catalog entities - accepts array of objects with below attributes
     */
    locations?: Array<{
      /**
       * attr: 'type' - accepts string
       * e.g. url
       */
      type: string;
      /**
       * attr: 'target' - accepts string
       * e.g. https://github.com/org/repo/blob/master/users.yaml
       */
      target: string;
      /**
       * opt-attr: 'rules' - accepts an array of objects with below attributes
       */
      rules?: Array<{
        /**
         * attr: 'allow' - accepts an array of string.
         * e.g. [Component, API, Group, User, Template, Location]
         */
        allow: Array<string>;
        /**
         * opt-attr: 'locations' - accepts an array of key, value pair objects.
         * keys: 'target', 'type'
         * e.g.[{type: url, target: https://github.com}]
         */
        locations?: Array<{ [key: string]: string }>;
      }>;
    }>;
  };
}
