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
 * Report from a PuppetDB.
 */
export type PuppetDbReport = {
  /** The name of the node that the report was received from. */
  certname: string;
  /** The ID of the report. */
  hash: string;
  /** The environment assigned to the node that submitted the report. */
  environment: string;
  /** The status associated to report's node. */
  status: string;
  /** The job id associated with the report. */
  job_id?: string;
  /** A flag indicating whether the report was produced by a noop run. */
  noop: boolean;
  /** A flag indicating whether the report contains noop events. */
  noop_pending?: boolean;
  /** The version of Puppet that generated the report. */
  puppet_version: string;
  /** The version number of the report format that Puppet used to generate the original report data. */
  report_format: number;
  /** An identifier string that Puppet uses to match a specific catalog for a node to a specific Puppet run. */
  configuration_version: string;
  /** The time on the agent at which the Puppet run began. */
  start_time: string;
  /** The time on the agent at which the Puppet run ended. */
  end_time: string;
  /** The time of catalog submission from the Puppet Server to PuppetDB. */
  producer_timestamp: string;
  /** The time at which PuppetDB received the report. */
  receive_time: string;
  /** The certname of the Puppet Server that sent the report to PuppetDB. */
  producer: string;
  /** A string used to identify a Puppet run. */
  transaction_uuid: string;
  /** A string used to tie a catalog to a report to the catalog used from that Puppet run. */
  catalog_uuid: string;
  /** A string used to tie a catalog to the Puppet code which generated the catalog. */
  code_id: string;
  /** A string used to identify whether the Puppet run used a cached catalogs. */
  cached_catalog_status: string;
  /** Either "agent", "plan", or "any" to restrict the results to reports submitted from that source. */
  type: string;
  /** A flag indicating whether any of the report's events remediated configuration drift. */
  corrective_change: boolean;
  /** Report metrics. */
  metrics: {
    /** Metrics data. */
    data: PuppetDbReportMetric[];
    /** Link to the metrics endpoint. */
    href: string;
  };
};

/**
 * Resource event generated from Puppet report.
 */
export type PuppetDbReportEvent = {
  /** The name of the node on which the event occurred. */
  certname: string;
  /** The ID of the report that the event occurred in. */
  report: string;
  /** The status of the event. Legal values are success, failure, noop, and skipped. */
  status: string;
  /** The timestamp (from the Puppet agent) at which the event occurred. Timestamps are always ISO-8601 compatible date/time strings. */
  timestamp: string;
  /** The timestamp (from the Puppet agent) at which the Puppet run began. Timestamps are always ISO-8601 compatible date/time strings. */
  run_start_time: string;
  /** The timestamp (from the Puppet agent) at which the Puppet run finished. Timestamps are always ISO-8601 compatible date/time strings. */
  run_end_time: string;
  /** The timestamp (from the PuppetDB server) at which the Puppet report was received. Timestamps are always ISO-8601 compatible date/time strings. */
  report_receive_time: string;
  /** The type of resource that the event occurred on, such as File, Package, etc. */
  resource_type: string;
  /** The title of the resource on which the event occurred. */
  resource_title: string;
  /** The property/parameter of the resource on which the event occurred. For example, on a Package resource, this field might have a value of ensure. */
  property: string | null;
  /** The name of the resource on which the event occurred. */
  name: string | null;
  /** The new value that Puppet was attempting to set for the specified resource property. Any rich data values will appear as readable strings. */
  new_value: string | null;
  /** The previous value of the resource property, which Puppet was attempting to change. Any rich data values will appear as readable strings. */
  old_value: string | null;
  /** A description (supplied by the resource provider) of what happened during the event. */
  message: string | null;
  /** The manifest file in which the resource definition is located. */
  file: string | null;
  /** The line (of the containing manifest file) at which the resource definition can be found. */
  line: number | null;
  /** The Puppet class where this resource is declared. */
  containing_class: string | null;
  /** Whether the event occurred in the most recent Puppet run (per-node). */
  latest_report?: boolean;
  /** The environment associated with the reporting node. */
  environment: string;
  /** An identifier string that Puppet uses to match a specific catalog for a node to a specific Puppet run. */
  configuration_version: string;
  /** The containment path associated with the event, as an ordered array that ends with the most specific containing element. */
  containment_path: string[];
  /** Whether the event represents a "corrective change", meaning the event rectified configuration drift. */
  corrective_change: boolean;
};

/**
 * Resource log generated from Puppet report.
 */
export type PuppetDbReportLog = {
  /** The manifest file in which the resource definition is located. */
  file: string | null;
  /** The line (of the containing manifest file) at which the resource definition can be found. */
  line: number | null;
  /** The timestamp (from the Puppet agent) at which the event occurred. Timestamps are always ISO-8601 compatible date/time strings. */
  time: string;
  /** A description (supplied by the resource provider) of what happened during the event. */
  message: string | null;
  /** The log level. */
  level: string;
  /** Log source */
  source: string;
  /** Resource tags */
  tags: string[];
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

  /**
   * Get a specific PuppetDB report events.
   *
   * @param puppetDbReportHash - The ID of the report.
   * @returns Events from a specific PuppetDB report.
   */
  getPuppetDbReportEvents(
    puppetDbReportHash: string,
  ): Promise<PuppetDbReportEvent[] | undefined>;

  /**
   * Get a specific PuppetDB report logs.
   *
   * @param puppetDbReportHash - The ID of the report.
   * @returns Logs from a specific PuppetDB report.
   */
  getPuppetDbReportLogs(
    puppetDbReportHash: string,
  ): Promise<PuppetDbReportLog[] | undefined>;
};
