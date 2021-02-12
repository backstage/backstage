#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
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
 * This script takes the config schema on stdin, and produces
 * documentation in markdown format on stdout.
 */

const fs = require('fs');
const handlebars = require('handlebars');
const YAML = require('yaml');

const schema_doc_template = `
# Configuration Options

The configuration options for app-config.yaml.

{{#each pkgs}}
## {{schema.title}} [{{path}}]

{{schema.description}}

{{#each docs}}
### {{config}}

{{#if schema.type}}
Type: {{schema.type}}
{{/if}}
{{#if schema.visibility}}
Visibility: {{schema.visibility}}
{{/if}}

{{#if schema.description}}
{{schema.description}}
{{else}}
No description.
{{/if}}
{{/each}}
{{/each}}
`;

function* process(schemas) {
  for (const schema of schemas) {
    const docs = [];
    for (const doc of generateDocs(schema.value, [])) {
      docs.push(doc);
    }

    yield {
      docs,
      schema: schema.value,
      path: schema.path,
    };
  }
}

function* generateDocs(obj, path) {
  if (obj.type === 'object' && obj.properties) {
    for (const [key, value] of Object.entries(obj.properties)) {
      yield* generateDocs(value, [...path, key]);
    }
    return;
  }

  yield {
    config: path.join('.'),
    schema: obj,
  };
}

async function main() {
  const data = fs.readFileSync(0).toString();
  const schema = YAML.parse(data);
  const tpl = handlebars.compile(schema_doc_template);
  const pkgs = Array.from(process(schema.schemas));
  console.info(tpl({ pkgs, schema }));
}

main().catch(error => {
  console.error(error.stack);
  process.exit(1);
});
