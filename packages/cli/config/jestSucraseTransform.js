/*
 * Copyright 2021 The Backstage Authors
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

const { createHash } = require('crypto');
const { transform } = require('sucrase');
const sucrasePkg = require('sucrase/package.json');

const ESM_REGEX = /\b(?:import|export)\b/;

function createTransformer(config) {
  const process = (source, filePath) => {
    let transforms;

    if (filePath.endsWith('.esm.js')) {
      transforms = ['imports'];
    } else if (filePath.endsWith('.js')) {
      // This is a very rough filter to avoid transforming things that we quickly
      // can be sure are definitely not ESM modules.
      if (ESM_REGEX.test(source)) {
        transforms = ['imports', 'jsx']; // JSX within .js is currently allowed
      }
    } else if (filePath.endsWith('.jsx')) {
      transforms = ['jsx', 'imports'];
    } else if (filePath.endsWith('.ts')) {
      transforms = ['typescript', 'imports'];
    } else if (filePath.endsWith('.tsx')) {
      transforms = ['typescript', 'jsx', 'imports'];
    }

    // Only apply the jest transform to the test files themselves
    if (transforms && filePath.includes('.test.')) {
      transforms.push('jest');
    }

    if (transforms) {
      const { code, sourceMap: map } = transform(source, {
        transforms,
        filePath,
        disableESTransforms: true,
        sourceMapOptions: {
          compiledFilename: filePath,
        },
      });
      if (config.enableSourceMaps) {
        const b64 = Buffer.from(JSON.stringify(map), 'utf8').toString('base64');
        const suffix = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${b64}`;
        // Include both inline and object source maps, as inline source maps are
        // needed for support of some editor integrations.
        return { code: `${code}\n${suffix}`, map };
      }
      // We only return the `map` result if source maps are enabled, as they
      // have a negative impact on the coverage accuracy.
      return { code };
    }

    return { code: source };
  };

  const getCacheKey = sourceText => {
    return createHash('md5')
      .update(sourceText)
      .update(Buffer.alloc(1))
      .update(sucrasePkg.version)
      .update(Buffer.alloc(1))
      .update(JSON.stringify(config))
      .update(Buffer.alloc(1))
      .update('1') // increment whenever the transform logic in this file changes
      .digest('hex');
  };

  return { process, getCacheKey };
}

module.exports = { createTransformer };
