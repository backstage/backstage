/*
 * Copyright 2025 The Backstage Authors
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
 * Root PostCSS configuration for the Backstage monorepo.
 *
 * Integrates Tailwind CSS v4 into the CSS processing pipeline via
 * the `@tailwindcss/postcss` plugin. Tailwind CSS v4 includes
 * autoprefixer functionality built-in, so no separate autoprefixer
 * plugin is required.
 *
 * This configuration is consumed by:
 *  - Vite (^7.1.5) during development and production builds
 *  - Storybook 10 for component story rendering
 *  - Individual package builds via backstage-cli
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
