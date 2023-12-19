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

const workspace = {
  title: 'Workspace',
  description: `This can either be the workspace ID (slug) or the workspace UUID surrounded by curly-braces, for example {workspace UUID}.`,
  type: 'string',
};

const repo_slug = {
  title: 'The repository',
  description: 'The repository name',
  type: 'string',
};

const ref_type = {
  title: 'ref_type',
  type: 'string',
};

const type = {
  title: 'type',
  type: 'string',
};

const ref_name = {
  title: 'ref_name',
  type: 'string',
};
const source = {
  title: 'source',
  type: 'string',
};
const destination = {
  title: 'destination',
  type: 'string',
};
const hash = {
  title: 'hash',
  type: 'string',
};

const pattern = {
  title: 'pattern',
  type: 'string',
};

const id = {
  title: 'id',
  type: 'string',
};

const key = {
  title: 'key',
  type: 'string',
};
const value = {
  title: 'value',
  type: 'string',
};
const secured = {
  title: 'secured',
  type: 'boolean',
};

const token = {
  title: 'Authentication Token',
  type: 'string',
  description: 'The token to use for authorization to BitBucket Cloud',
};

const destination_commit = {
  title: 'destination_commit',
  type: 'object',
  properties: {
    hash,
  },
};

const commit = {
  title: 'commit',
  type: 'object',
  properties: {
    type,
    hash,
  },
};

const selector = {
  title: 'selector',
  type: 'object',
  properties: {
    type,
    pattern,
  },
};

const pull_request = {
  title: 'pull_request',
  type: 'object',
  properties: {
    id,
  },
};

const pipelinesRunBody = {
  title: '',
  description: '',
  type: 'object',
  properties: {
    target: {
      title: 'target',
      type: 'object',
      properties: {
        ref_type,
        type,
        ref_name,
        source,
        destination,
        destination_commit,
        commit,
        selector,
        pull_request,
      },
    },
    variables: {
      title: 'variables',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key,
          value,
          secured,
        },
      },
    },
  },
};

export { workspace, repo_slug, pipelinesRunBody, token };
