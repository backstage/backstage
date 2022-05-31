#!/usr/bin/env node
'use strict';
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

const BASE_DOMAIN = 'https://developer.atlassian.com';
const SCHEMA_SOURCE = `${BASE_DOMAIN}/cloud/bitbucket/swagger.v3.json`;

const fetch = require('cross-fetch');
const fs = require('fs');

const destFile = `${__dirname}/../bitbucket-cloud.oas.json`;

const sortSelectedProperties = (key, value) => {
  if (key !== 'schemas' && key !== 'properties') {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((o, k) => {
        o[k] = value[k];
        return o;
      }, {});
  }

  return value;
};

// similar to definition of "slug" at ""#/components/schemas/group"
const repoSlugDefinition = {
  type: 'string',
  description:
    'The "sluggified" version of the repository\'s name. This contains only ASCII characters and can therefore be slightly different than the name',
};

const paginatedDefinition = {
  type: 'object',
  title: 'Paginated',
  description: 'A generic paginated list.',
  discriminator: {
    propertyName: 'type',
  },
  properties: {
    next: {
      type: 'string',
      format: 'uri',
      description:
        'Link to the next page if it exists. The last page of a collection does not have this value. Use this link to navigate the result set and refrain from constructing your own URLs.',
    },
    page: {
      type: 'integer',
      description:
        'Page number of the current results. This is an optional element that is not provided in all responses.',
    },
    pagelen: {
      type: 'integer',
      description:
        'Current number of objects on the existing page. The default value is 10 with 100 being the maximum allowed value. Individual APIs may enforce different values.',
    },
    previous: {
      type: 'string',
      format: 'uri',
      description:
        'Link to previous page if it exists. A collections first page does not have this value. This is an optional element that is not provided in all responses. Some result sets strictly support forward navigation and never provide previous links. Clients must anticipate that backwards navigation is not always available. Use this link to navigate the result set and refrain from constructing your own URLs.',
    },
    size: {
      type: 'integer',
      description:
        'Total number of objects in the response. This is an optional element that is not provided in all responses, as it can be expensive to compute.',
    },
    values: {
      description: 'The values of the current page.',
      oneOf: [
        {
          type: 'array',
          minItems: 0,
          items: {},
          uniqueItems: false,
        },
        {
          type: 'array',
          minItems: 0,
          items: {},
          uniqueItems: true,
        },
      ],
    },
  },
};

const addMissingRepoSlug = json => {
  const repoProperties = json.components.schemas.repository.allOf.find(
    item => item.properties,
  ).properties;
  if (repoProperties.slug) {
    // eslint-disable-next-line no-console
    console.log(
      '[WARN] repository schema already contains slug property. Patch got obsolete.',
    );
  } else {
    repoProperties.slug = repoSlugDefinition;
  }

  return json;
};

const removePageDefinition = json => {
  delete json.components.schemas.page;
  return json;
};

const renamePaginatedSnippetCommitToPlural = json => {
  if (!json.components.schemas.paginated_snippet_commit) {
    // eslint-disable-next-line no-console
    console.log(
      '[WARN] $.components.schemas.paginated_snippet_commit does not exist anymore. Patch got obsolete.',
    );
    return json;
  }

  json.components.schemas.paginated_snippet_commits =
    json.components.schemas.paginated_snippet_commit;
  delete json.components.schemas.paginated_snippet_commit;

  return JSON.parse(
    JSON.stringify(json).replace(
      '"#/components/schemas/paginated_snippet_commit"',
      '"#/components/schemas/paginated_snippet_commits"',
    ),
  );
};

const addPaginatedDefinition = json => {
  json.components.schemas.paginated = paginatedDefinition;
  return json;
};

// Changes "interface PaginatedXyz {" to "interface PaginatedXyz extends Paginated<Xyz> {"
// (generic type gets extracted from "values" property)
const paginatedDefinitionsExtendPaginated = json => {
  // exception to the standard naming pattern PaginatedXyz / paginated_xyz
  const exceptions = [
    'deployments_ddev_paginated_environments',
    'deployments_stg_west_paginated_environments',
    'search_result_page',
  ];

  Object.keys(json.components.schemas)
    .filter(name => name.startsWith('paginated_') || exceptions.includes(name))
    .forEach(name => {
      // modify other paginated_[...] schemas
      const old = json.components.schemas[name];
      const title = old.title;
      const description = old.description;
      delete old.title;
      delete old.description;
      delete old.properties.page;
      delete old.properties.pagelen;
      delete old.properties.size;
      delete old.properties.previous;
      delete old.properties.next;
      delete old.additionalProperties;
      old.properties.values.description =
        old.properties.values.description ??
        paginatedDefinition.properties.values.description;

      json.components.schemas[name] = {
        title: title,
        description: description,
        allOf: [
          {
            $ref: '#/components/schemas/paginated',
          },
          old,
        ],
      };
    });

  return json;
};

const preventHardToDetectDuplicateInterfacesDueToAllOf = json => {
  Object.keys(json.components.schemas).forEach(name => {
    const schema = json.components.schemas[name];
    if (!schema.allOf) {
      return;
    }

    schema.allOf.forEach(allOfItem => {
      if (allOfItem.title) {
        schema.title = schema.title ?? allOfItem.title;
        schema.description = schema.description ?? allOfItem.description;
        delete allOfItem.title;
        delete allOfItem.description;
      }
    });
  });

  return json;
};

const removeBuggyDescription = json => {
  const valueProp =
    json.components.schemas.branchrestriction.allOf[1].properties.value;
  if (!valueProp.description.startsWith('<staticmethod')) {
    // eslint-disable-next-line no-console
    console.log('[WARN] "removeBuggyDescription" is not necessary anymore.');
    return json;
  }

  delete valueProp.description;
  return json;
};

const resolveConflictingInheritance = json => {
  const schema = json.components.schemas.pipeline_selector;
  const extension = schema.allOf[1];
  delete schema.allOf;

  json.components.schemas.pipeline_selector = {
    ...schema,
    ...extension,
  };

  return json;
};

const escapeTsdocInDescription = json => {
  const prop = json.components.schemas.commitstatus.allOf[1].properties.url;
  prop.description = prop.description.replaceAll(/(\S*[{]\S+[}]\S*)/g, '`$1`');

  return json;
};

const relativeToAbsoluteUrls = json => {
  Object.keys(json.components.schemas).forEach(name => {
    const schema = json.components.schemas[name];
    if (schema.description) {
      schema.description = schema.description.replace(
        /]\(\/cloud\/bitbucket\//g,
        `](${BASE_DOMAIN}/cloud/bitbucket/`,
      );
    }
  });

  return json;
};

fetch(SCHEMA_SOURCE)
  .then(res => res.json())
  .then(addMissingRepoSlug)
  .then(removePageDefinition)
  .then(renamePaginatedSnippetCommitToPlural)
  .then(addPaginatedDefinition)
  .then(paginatedDefinitionsExtendPaginated)
  .then(preventHardToDetectDuplicateInterfacesDueToAllOf)
  .then(removeBuggyDescription)
  .then(resolveConflictingInheritance)
  .then(escapeTsdocInDescription)
  .then(relativeToAbsoluteUrls)
  .then(json => {
    fs.writeFileSync(destFile, JSON.stringify(json, sortSelectedProperties, 2));
    return json;
  });
