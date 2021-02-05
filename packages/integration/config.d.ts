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

export interface Config {
  /** Configuration for integrations towards various external repository provider systems */
  integrations?: {
    /** Integration configuration for Azure */
    azure?: Array<{
      /**
       * The hostname of the given Azure instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
    }>;

    /** Integration configuration for Bitbucket */
    bitbucket?: Array<{
      /**
       * The hostname of the given Bitbucket instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * The base url for the Bitbucket API, for example https://api.bitbucket.org/2.0
       * @visibility frontend
       */
      apiBaseUrl?: string;
      /**
       * The username to use for authenticated requests.
       * @visibility secret
       */
      username?: string;
      /**
       * Bitbucket app password used to authenticate requests.
       * @visibility secret
       */
      appPassword?: string;
    }>;

    /** Integration configuration for GitHub */
    github?: Array<{
      /**
       * The hostname of the given GitHub instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * The base url for the GitHub API, for example https://api.github.com
       * @visibility frontend
       */
      apiBaseUrl?: string;
      /**
       * The base url for GitHub raw resources, for example https://raw.githubusercontent.com
       * @visibility frontend
       */
      rawBaseUrl?: string;

      /**
       * GitHub Apps configuration
       * @visibility backend
       */
      apps?: Array<{
        /**
         * The numeric GitHub App ID
         */
        appId: number;
        /**
         * The private key to use for auth against the app
         * @visibility secret
         */
        privateKey: string;
        /**
         * The secret used for webhooks
         * @visibility secret
         */
        webhookSecret: string;
        /**
         * The client ID to use
         */
        clientId: string;
        /**
         * The client secret to use
         * @visibility secret
         */
        clientSecret: string;
      }>;
    }>;

    /** Integration configuration for GitLab */
    gitlab?: Array<{
      /**
       * The hostname of the given GitLab instance
       * @visibility frontend
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
    }>;
  };
}
