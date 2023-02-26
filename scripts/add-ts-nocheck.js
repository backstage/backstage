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
const fs = require('fs');
const path = require('path');

const ADDED_STR = '// @ts-nocheck\n\n';
const FILES = [
  `${path.dirname(require.resolve('cross-fetch'))}/../index.d.ts`,
  `${path.dirname(require.resolve('@whatwg-node/fetch'))}/index.d.ts`,
  `${path.dirname(
    require.resolve('@whatwg-node/fetch', {
      paths: [path.dirname(require.resolve('@whatwg-node/server'))],
    }),
  )}/index.d.ts`,
];

Promise.allSettled(FILES.map(addTsNoCheck)).then(results => {
  let hasErrors = false;

  for (const result of results) {
    if (result.status === 'rejected') {
      hasErrors = true;
      console.error(result.reason);
    }
  }

  if (hasErrors) {
    process.exit(1);
  }
});

async function addTsNoCheck(file) {
  const content = fs.readFileSync(file).toString();

  if (content.includes(ADDED_STR)) {
    console.log(JSON.stringify(ADDED_STR), 'is already in', file);
  } else {
    fs.writeFileSync(file, ADDED_STR + content);
    console.log(JSON.stringify(ADDED_STR), 'added into', file);
  }
}
