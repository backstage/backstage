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

export const resolvePackageName = (options: {
  baseName: string;
  scope?: string;
  plugin: boolean;
}) => {
  const { baseName, scope, plugin } = options;
  if (scope) {
    if (plugin) {
      const pluginName = scope.startsWith('backstage')
        ? 'plugin'
        : 'backstage-plugin';
      return scope.includes('/')
        ? `@${scope}${pluginName}-${baseName}`
        : `@${scope}/${pluginName}-${baseName}`;
    }
    return scope.includes('/')
      ? `@${scope}${baseName}`
      : `@${scope}/${baseName}`;
  }

  return plugin ? `backstage-plugin-${baseName}` : baseName;
};
