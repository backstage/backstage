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
import { createApiRef } from '@backstage/core-plugin-api';

/**
 * A node in PuppetDB.
 */
export type PuppetDbNode = {
  /**
   * The name of the node that the report was received from.
   */
  certname: string;
  /**
   * The environment for the last received catalog.
   */
  catalog_environment: string;
  /**
   * The environment for the last received fact set.
   */
  facts_environment: string;
  /**
   * The environment for the last received report.
   */
  report_environment: string;
  /**
   * The last time a catalog was received. Timestamps are always ISO-8601 compatible date/time strings.
   */
  catalog_timestamp: string;
  /**
   * The last time a fact set was received. Timestamps are always ISO-8601 compatible date/time strings.
   */
  facts_timestamp: string;
  /**
   * The last time a report run was complete. Timestamps are always ISO-8601 compatible date/time strings.
   */
  report_timestamp: string;
  /**
   * The status of the latest report. Possible values come from Puppet's report status.
   */
  latest_report_status: string;
  /**
   * Indicates whether the most recent report for the node was a noop run.
   */
  latest_report_noop: boolean;
  /**
   * Indicates whether the most recent report for the node contained noop events.
   */
  latest_report_noop_pending: boolean;
  /**
   * A flag indicating whether the latest report for the node included events that remediated configuration drift.
   */
  latest_report_corrective_change: boolean;
  /**
   * Cached catalog status of the last puppet run for the node. Possible values are explicitly_requested, on_failure, not_used or null.
   */
  cached_catalog_status: string;
  /**
   * A hash of the latest report for the node.
   */
  latest_report_hash: string;
  /**
   * The job id associated with the latest report.
   */
  latest_report_job_id?: string;
  /**
   * Indicates whether the node is currently in the deactivated state.
   */
  deactivated?: boolean;
  /**
   * Indicates whether the node is currently in the expired state.
   */
  expired?: boolean;
};

export const puppetDbApiRef = createApiRef<PuppetDbApi>({
  id: 'plugin.puppetdb.service',
});

export type PuppetDbApi = {
  getPuppetDbNode(puppetDbCertName: string): Promise<PuppetDbNode | undefined>;
};
