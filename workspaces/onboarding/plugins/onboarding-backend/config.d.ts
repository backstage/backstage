/*
 * Copyright 2026 Estehsan Tariq
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
  /**
   * Configuration for the onboarding plugin.
   */
  onboarding?: {
    /**
     * Whether to seed demo data on startup (development only).
     * @visibility backend
     */
    seedDemoData?: boolean;

    /**
     * Template configuration.
     * @visibility backend
     */
    templates?: {
      /**
       * Template source type.
       * @visibility backend
       */
      type?: string;

      /**
       * Inline template defaults (used when catalog has no OnboardingTemplate entities).
       * @visibility backend
       */
      defaults?: Array<{
        /** Template name identifier. */
        name: string;
        /** Human-readable title. */
        title?: string;
        /** Template description. */
        description?: string;
        /** Phase identifiers. */
        phases?: string[];
        /** Task definitions. */
        tasks?: Array<{
          id: string;
          phase: string;
          title: string;
          description?: string;
          type?: string;
          assignee?: string;
          dependsOn?: string[];
          duePhase?: string;
          estimatedMinutes?: number;
          resources?: Array<{
            type: string;
            title: string;
            url: string;
            duration?: string;
          }>;
        }>;
      }>;
    }[];

    /**
     * Azure AD user picker configuration.
     */
    azureAd?: {
      /**
       * Enable Azure AD user search picker for template assignment.
       * When true, shows a searchable autocomplete that queries catalog User entities
       * (requires Azure AD users synced via catalog-backend-module-msgraph).
       * When false or unset (default), shows the manual entity ref text input.
       * @visibility frontend
       */
      enabled?: boolean;
    };

    /**
     * Default configuration values.
     */
    defaults?: {
      /**
       * Number of days to consider a joiner as "active" in team stats.
       * @visibility backend
       */
      activeJoinerWindowDays?: number;

      /**
       * Buddy assignment configuration.
       */
      buddy?: {
        /**
         * Whether to auto-assign a buddy from team members.
         * @visibility backend
         */
        autoAssign?: boolean;
      };
    };
  };
}
