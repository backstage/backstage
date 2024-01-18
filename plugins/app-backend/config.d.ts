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
  app?: {
    /**
     * The name of the app package (in most Backstage repositories, this is the
     * "name" field in `packages/app/package.json`) that content should be served
     * from. The same app package should be added as a dependency to the backend
     * package in order for it to be accessible at runtime.
     *
     * In a typical setup with a single app package, this will default to 'app'.
     */
    packageName?: string;

    /**
     * Disables the configuration injection. This can be useful if you're running in an environment
     * with a read-only filesystem, or for some other reason don't want configuration to be injected.
     *
     * Note that this will cause the configuration used when building the app bundle to be used, unless
     * a separate configuration loading strategy is set up.
     *
     * This also disables configuration injection though `APP_CONFIG_` environment variables.
     */
    disableConfigInjection?: boolean;

    /**
     * By default the app backend plugin will cache previously deployed static assets in the database.
     * If you disable this, it is recommended to set a `staticFallbackHandler` instead.
     */
    disableStaticFallbackCache?: boolean;
  };
}
