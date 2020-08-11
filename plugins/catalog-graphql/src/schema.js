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

const EntityMetadataFields = /* GraphQL */ `
  name: String!
  annotations: JSONObject!
  annotation(name: String!): JSON
  labels: JSONObject!
  label(name: String!): JSON
  uid: String!
  etag: String!
  generation: Int!
`;

const EntityMetadata = /* GraphQL */ `
  scalar JSON
  scalar JSONObject
  
  interface EntityMetadata {
    ${EntityMetadataFields}
  }

  type DefaultEntityMetadata implements EntityMetadata {
    ${EntityMetadataFields}
  }

  type ComponentMetadata implements EntityMetadata {
    ${EntityMetadataFields}
    # mock field to prove extensions working
    relationships: String
  }

  type TemplateMetadata implements EntityMetadata {
    ${EntityMetadataFields}
    # mock field to prove extensions working
    updatedBy: String
  }

  type TemplateEntitySpec {
    type: String!
    path: String
    schema: JSONObject!
    templater: String!
  }

  type ComponentEntitySpec {
    type: String!
    lifecycle: String!
    owner: String!
  }

  type DefaultEntitySpec {
    raw: JSONObject
  }

  union EntitySpec = DefaultEntitySpec | TemplateEntitySpec | ComponentEntitySpec
  
  type CatalogEntity {
    apiVersion: String!
    kind: String!
    metadata: EntityMetadata
    spec: EntitySpec!
  }

  type CatalogQuery {
    list: [CatalogEntity!]!
  }

  type Query {
    catalog: CatalogQuery!
  }
`;

module.exports = EntityMetadata;
