/*
 * Copyright 2022 The Backstage Authors
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
const { createTransformer: createSwcTransformer } = require('@swc/jest');

const ESM_REGEX = /\b(?:import|export)\b/;

function createTransformer(config) {
  const swcTransformer = createSwcTransformer({
    inputSourceMap: false,
    ...config,
  });
  const process = (source, filePath, jestOptions) => {
    // Skip transformation of .js files without ESM syntax, we never transform from CJS to ESM
    if (filePath.endsWith('.js') && !ESM_REGEX.test(source)) {
      return { code: source };
    }

    // Skip transformation of .mjs files, they should only be used if ESM support is available
    if (jestOptions.supportsStaticESM && filePath.endsWith('.mjs')) {
      return { code: source };
    }

    return swcTransformer.process(source, filePath, jestOptions);
  };

  const getCacheKey = swcTransformer.getCacheKey;

  return { process, getCacheKey };
}

module.exports = { createTransformer };
