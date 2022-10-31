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

const yaml = require('yaml');
const crypto = require('crypto');

function createTransformer(config) {
  const process = source => {
    const json = JSON.stringify(yaml.parse(source), null, 2);
    return { code: `module.exports = ${json}`, map: null };
  };

  const getCacheKey = sourceText => {
    return crypto
      .createHash('md5')
      .update(sourceText)
      .update(Buffer.alloc(1))
      .update(JSON.stringify(config))
      .update(Buffer.alloc(1))
      .update('1') // increment whenever the transform logic in this file changes
      .digest('hex');
  };

  return { process, getCacheKey };
}

module.exports = { createTransformer };
