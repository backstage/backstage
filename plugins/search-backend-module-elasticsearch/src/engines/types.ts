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

/**
 * Elasticsearch specific index template
 * @public
 */
export type ElasticSearchCustomIndexTemplate = {
  name: string;
  body: ElasticSearchCustomIndexTemplateBody;
};

/**
 * Elasticsearch specific index template body
 * @public
 */
export type ElasticSearchCustomIndexTemplateBody = {
  /**
   * Array of wildcard (*) expressions used to match the names of data streams and indices during creation.
   */
  index_patterns: string[];
  /**
   * An ordered list of component template names.
   * Component templates are merged in the order specified,
   * meaning that the last component template specified has the highest precedence.
   */
  composed_of?: string[];
  /**
   * See available properties of template
   * https://www.elastic.co/guide/en/elasticsearch/reference/7.15/indices-put-template.html#put-index-template-api-request-body
   */
  template?: Record<string, any>;
};
