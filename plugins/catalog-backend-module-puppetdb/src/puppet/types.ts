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

import { ResourceEntity } from '@backstage/catalog-model';
import { JsonValue } from '@backstage/types';
import { PuppetDbEntityProviderConfig } from '../providers/PuppetDbEntityProviderConfig';

/**
 * Customize the ingested Resource entity.
 *
 * @param node - The found PuppetDB node entry in its source format. This is the entry that you want to transform.
 * @param config - The configuration for the entity provider.
 *
 * @returns A `ResourceEntity` or `undefined` if you want to ignore the found group for being ingested by the catalog.
 *
 * @public
 */
export type ResourceTransformer = (
  node: PuppetNode,
  config: PuppetDbEntityProviderConfig,
) => Promise<ResourceEntity | undefined>;

/**
 * A node in PuppetDB.
 *
 * @public
 */
export type PuppetNode = {
  /**
   * The most recent time of fact submission from the associated certname.
   */
  timestamp: string;
  /**
   * The certname associated with the factset.
   */
  certname: string;
  /**
   * A hash of the factset's certname, environment, timestamp, facts, and producer_timestamp.
   */
  latest_report_status: string;
  /**
   *  The status of the latest report. Possible values come from Puppet's report status failed, changed, or unchanged.
   */
  hash: string;
  /**
   *  The most recent time of fact submission for the relevant certname from the Puppet Server.
   */
  producer_timestamp: string;
  /**
   * The certname of the Puppet Server that sent the factset to PuppetDB.
   */
  producer: string;
  /**
   * The environment associated with the fact.
   */
  environment: string;
  /**
   * The facts associated with the factset.
   */
  facts: PuppetFactSet;
};

/**
 * The set of all facts for a single certname in PuppetDB.
 *
 * @public
 */
export type PuppetFactSet = {
  /**
   * The array of facts.
   */
  data: PuppetFact[];
  /**
   * The URL to retrieve more information about the facts.
   */
  href: string;
};

/**
 * A fact in PuppetDB.
 *
 * @public
 */
export type PuppetFact = {
  /**
   * The name of the fact.
   */
  name: string;
  /**
   * The value of the fact.
   */
  value: JsonValue;
};
