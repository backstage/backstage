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

/**
 * This script relies on docusaurus internals. It can be replaced in case
 * docusaurus adds proper validation of the sidebar items.
 */

require('@babel/polyfill');
require('@babel/register')({
  babelrc: false,
  only: [`${__dirname}/..`, `${process.cwd()}/core`],
  plugins: [
    require('docusaurus/lib/server/translate-plugin.js'),
    require('@babel/plugin-proposal-class-properties').default,
    require('@babel/plugin-proposal-object-rest-spread').default,
  ],
  presets: [
    require('@babel/preset-react').default,
    require('@babel/preset-env').default,
  ],
});

const readMetadata = require('docusaurus/lib/server/readMetadata.js');
readMetadata.generateMetadataDocs();
const metadata = require('docusaurus/lib/core/metadata.js');

const errors = [];
const ids = Object.keys(metadata);
for (let id of ids) {
  const { next, previous } = metadata[id];

  if (next && !ids.includes(next)) {
    errors.push(`Next ${next} does not exists in ${id}.`);
  }

  if (previous && !ids.includes(previous)) {
    errors.push(`Previous ${previous} does not exists in ${id}.`);
  }
}

if (errors.length) {
  for (let error of errors) {
    console.log(`❌ ${error}`);
  }
  process.exit(1);
}

console.log('✅ All sidebar links are correct.');
