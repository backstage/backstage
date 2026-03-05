/*
 * Copyright 2020 The Backstage Authors
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
 * Annotation for specifying the certificate name of a node in PuppetDB.
 *
 * @public
 */
export const ANNOTATION_PUPPET_CERTNAME = 'puppet.com/certname';

/**
 * Path of PuppetDB FactSets endpoint.
 */
export const ENDPOINT_FACTSETS = 'pdb/query/v4/factsets';

/**
 * Path of PuppetDB Nodes endpoint.
 */
export const ENDPOINT_NODES = 'pdb/query/v4/nodes';

/**
 * Default owner for entities created by the PuppetDB provider.
 *
 * @public
 */
export const DEFAULT_ENTITY_OWNER = 'unknown';
