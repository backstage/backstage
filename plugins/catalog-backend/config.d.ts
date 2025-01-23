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

import { HumanDuration } from '@backstage/types';

export interface Config {
  /**
   * Configuration options for the catalog plugin.
   */
  catalog?: {
    /**
     * Rules to apply to all catalog entities, from any location.
     *
     * An undefined list of matchers means match all, an empty list of
     * matchers means match none.
     *
     * This is commonly used to put in what amounts to an allowlist of kinds
     * that regular users of Backstage are permitted to register locations
     * for. This can be used to stop them from registering yaml files
     * describing for example a Group entity called "admin" that they make
     * themselves members of, or similar.
     */
    rules?: Array<{
      /**
       * Allow entities of these particular kinds.
       *
       * E.g. ["Component", "API", "Template", "Location"]
       */
      allow: Array<string>;
      /**
       * Limit this rule to a specific location
       *
       * Example with a fixed location
       *  { "type": "url", "exact": "https://github.com/a/b/blob/file.yaml"}
       *
       * Example using a Regex
       *  { "type": "url", "pattern": "https://github.com/org/*\/blob/master/*.yaml"}
       *
       * Using both exact and pattern will result in an error starting the application
       */
      locations?: Array<{
        /**
         * The type of location, e.g. "url".
         */
        type: string;
        /**
         * The exact location, e.g.
         * "https://github.com/org/repo/blob/master/users.yaml".
         *
         * The exact location can also be used to match on locations
         * that contain glob characters themselves, e.g.
         * "https://github.com/org/*\/blob/master/*.yaml".
         */
        exact?: string;
        /**
         * The pattern allowed for the location, e.g.
         * "https://github.com/org/*\/blob/master/*.yaml".
         */
        pattern?: string;
      }>;
    }>;

    /**
     * Readonly defines whether the catalog allows writes after startup.
     *
     * Setting 'readonly=false' allows users to register their own components.
     * This is the default value.
     *
     * Setting 'readonly=true' configures catalog to only allow reads. This can
     * be used in combination with static locations to only serve operator
     * provided locations. Effectively this removes the ability to register new
     * components to a running backstage instance.
     */
    readonly?: boolean;

    /**
     * A set of static locations that the catalog shall always keep itself
     * up-to-date with. This is commonly used for large, permanent integrations
     * that are defined by the Backstage operators at an organization, rather
     * than individual things that users register dynamically.
     *
     * These have (optional) rules of their own. These override what the global
     * rules above specify. This way, you can prevent everybody from register
     * e.g. User and Group entities, except for one or a few static locations
     * that have those two kinds explicitly allowed.
     *
     * For example:
     *
     * ```yaml
     * rules:
     *   - allow: [Component, API, Template, Location]
     * locations:
     *   - type: url
     *     target: https://github.com/org/repo/blob/master/users.yaml
     *     rules:
     *       - allow: [User, Group]
     *   - type: url
     *     target: https://github.com/org/repo/blob/master/systems.yaml
     *     rules:
     *       - allow: [System]
     * ```
     */
    locations?: Array<{
      /**
       * The type of location, e.g. "url".
       */
      type: string;
      /**
       * The target URL of the location, e.g.
       * "https://github.com/org/repo/blob/master/users.yaml".
       */
      target: string;
      /**
       * Optional extra rules that apply to this particular location.
       *
       * These override the global rules above.
       */
      rules?: Array<{
        /**
         * Allow entities of these particular kinds.
         *
         * E.g. ["Group", "User"]
         */
        allow: Array<string>;
      }>;
    }>;

    /**
     * Disables the compatibility layer for relations in returned entities that
     * ensures that all relations objects have both `target` and `targetRef`.
     *
     * Enabling this option significantly reduces the memory usage of the
     * catalog, and slightly increases performance, but may break consumers that
     * rely on the existence of `target` in the relations objects.
     */
    disableRelationsCompatibility?: boolean;

    /**
     * The strategy to use for entities that are orphaned, i.e. no longer have
     * any other entities or providers referencing them. The default value is
     * "keep".
     */
    orphanStrategy?: 'keep' | 'delete';

    /**
     * The strategy to use when stitching together the final entities.
     */
    stitchingStrategy?:
      | {
          /** Perform stitching in-band immediately when needed */
          mode: 'immediate';
        }
      | {
          /** Defer stitching to be performed asynchronously */
          mode: 'deferred';
          /** Polling interval for tasks in seconds */
          pollingInterval?: HumanDuration | string;
          /** How long to wait for a stitch to complete before giving up in seconds */
          stitchTimeout?: HumanDuration | string;
        };

    /**
     * The interval at which the catalog should process its entities.
     * @remarks
     *
     * Example:
     *
     * ```yaml
     * catalog:
     *   processingInterval: { minutes: 30 }
     * ```
     *
     * or to disabled processing:
     *
     * ```yaml
     * catalog:
     *  processingInterval: false
     * ```
     *
     * Note that this is only a suggested minimum, and the actual interval may
     * be longer. Internally, the catalog will scale up this number by a small
     * factor and choose random numbers in that range to spread out the load. If
     * the catalog is overloaded and cannot process all entities during the
     * interval, the time taken between processing runs of any given entity may
     * also be longer than specified here.
     *
     * Setting this value too low risks exhausting rate limits on external
     * systems that are queried by processors, such as version control systems
     * housing catalog-info files.
     */
    processingInterval?: HumanDuration | false;
  };
}
