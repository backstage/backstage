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

/**
 * Report from a PuppetDB.
 */
export type PuppetDbReport = {
  /**
   * The name of the node that the report was received from.
   */
  certname: string;
  /**
   * The ID of the report.
   */
  hash: string;
  /**
   * The environment assigned to the node that submitted the report.
   */
  environment: string;
  /**
   * The status associated to report's node.
   */
  status: string;
  /**
   * The job id associated with the report.
   */
  job_id?: string;
  /**
   *  A flag indicating whether the report was produced by a noop run.
   */
  noop: boolean;
  /**
   *  A flag indicating whether the report contains noop events.
   */
  noop_pending?: boolean;
  /**
   * The version of Puppet that generated the report.
   */
  puppet_version: string;
  /**
   * The version number of the report format that Puppet used to generate the original report data.
   */
  report_format: number;
  /**
   * An identifier string that Puppet uses to match a specific catalog for a node to a specific Puppet run.
   */
  configuration_version: string;
  /**
   * The time on the agent at which the Puppet run began.
   */
  start_time: string;
  /**
   * The time on the agent at which the Puppet run ended.
   */
  end_time: string;
  /**
   * The time of catalog submission from the Puppet Server to PuppetDB.
   */
  producer_timestamp: string;
  /**
   * The time at which PuppetDB received the report.
   */
  receive_time: string;
  /**
   * The certname of the Puppet Server that sent the report to PuppetDB.
   */
  producer: string;
  /**
   * A string used to identify a Puppet run.
   */
  transaction_uuid: string;
  /**
   * A string used to tie a catalog to a report to the catalog used from that Puppet run.
   */
  catalog_uuid: string;
  /**
   * A string used to tie a catalog to the Puppet code which generated the catalog.
   */
  code_id: string;
  /**
   * A string used to identify whether the Puppet run used a cached catalogs.
   */
  cached_catalog_status: string;
  /**
   * Either "agent", "plan", or "any" to restrict the results to reports submitted from that source.
   */
  type: string;
  /**
   * A flag indicating whether any of the report's events remediated configuration drift.
   */
  corrective_change: boolean;
  /**
   * Report metrics.
   */
  metrics: {
    /**
     * Metrics data.
     */
    data: PuppetDbReportMetric[];
    /**
     * Link to the metrics endpoint.
     */
    href: string;
  };
};

/**
 * A metric from a PuppetDB report.
 */
export type PuppetDbReportMetric = {
  /**
   * The name of the metric.
   */
  name: string;
  /**
   * The value of the metric.
   */
  value: string;
  /**
   * The category of the metric.
   */
  category: string;
};

export const puppetDbApiRef = createApiRef<PuppetDbApi>({
  id: 'plugin.puppetdb.service',
});

/**
 * The API provided by the PuppetDB plugin.
 */
export type PuppetDbApi = {
  /**
   *
   * @param puppetDbCertName - The name of the PuppetDB node.
   * @returns A PuppetDB node.
   */
  getPuppetDbNode(puppetDbCertName: string): Promise<PuppetDbNode | undefined>;
  /**
   * Get a list of PuppetDB reports for the specified node.
   *
   * @param puppetDbCertName - The name of the node that the report was received from.
   * @returns A list of PuppetDB reports for the specified node.
   */
  getPuppetDbNodeReports(
    puppetDbCertName: string,
  ): Promise<PuppetDbReport[] | undefined>;
  /**
   * Get a specific PuppetDB report.
   *
   * @param puppetDbReportHash - The ID of the report.
   * @returns A specific PuppetDB report.
   */
  getPuppetDbReport(
    puppetDbReportHash: string,
  ): Promise<PuppetDbReport | undefined>;
};
