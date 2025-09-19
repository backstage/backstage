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
module.exports = {
  // Force full rebuild when these files change
  externals: [
    'packages/ui/**/*.css',
    'packages/ui/css/**',
    'packages/ui/src/**/*.css',
    'packages/ui/css/styles.css', // Specific file that was changed
    'packages/ui/src/components/Button/styles.css', // Specific file that was changed
  ],

  // Additional configuration for better change detection
  turboSnap: {
    // Force rebuild for CSS changes
    externals: [
      'packages/ui/**/*.css',
      'packages/ui/css/**',
      'packages/ui/src/**/*.css',
    ],
  },
};
