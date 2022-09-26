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

import {
  CodeClimateData,
  CodeClimateRepoData,
  CodeClimateMaintainabilityData,
  CodeClimateTestCoverageData,
  CodeClimateIssuesData,
} from './code-climate-data';
import { CodeClimateApi } from './code-climate-api';
import { DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import { Duration } from 'luxon';
import humanizeDuration from 'humanize-duration';

const pageQuery = encodeURIComponent('page[size]');
const statusFilter = encodeURIComponent('filter[status][$in][]');
const categoriesFilter = encodeURIComponent('filter[categories][$in][]');
const basicIssuesOptions = `${pageQuery}=1&${statusFilter}=open&${statusFilter}=confirmed`;
const codeSmellsQuery = `${basicIssuesOptions}&${categoriesFilter}=Complexity`;
const duplicationQuery = `${basicIssuesOptions}&${categoriesFilter}=Duplication`;
const otherIssuesQuery = `${basicIssuesOptions}&${categoriesFilter}=Bug%20Risk`;

/** @public */
export class ProductionCodeClimateApi implements CodeClimateApi {
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;

  constructor(options: { discoveryApi: DiscoveryApi; fetchApi: FetchApi }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
  }

  async fetchAllData(options: {
    apiUrl: string;
    repoID: string;
    snapshotID: string;
    testReportID: string;
  }): Promise<any> {
    const { apiUrl, repoID, snapshotID, testReportID } = options;
    const [
      maintainabilityResponse,
      testCoverageResponse,
      codeSmellsResponse,
      duplicationResponse,
      otherIssuesResponse,
    ] = await Promise.all([
      await this.fetchApi.fetch(
        `${apiUrl}/repos/${repoID}/snapshots/${snapshotID}`,
      ),
      await this.fetchApi.fetch(
        `${apiUrl}/repos/${repoID}/test_reports/${testReportID}`,
      ),
      await this.fetchApi.fetch(
        `${apiUrl}/repos/${repoID}/snapshots/${snapshotID}/issues?${codeSmellsQuery}`,
      ),
      await this.fetchApi.fetch(
        `${apiUrl}/repos/${repoID}/snapshots/${snapshotID}/issues?${duplicationQuery}`,
      ),
      await this.fetchApi.fetch(
        `${apiUrl}/repos/${repoID}/snapshots/${snapshotID}/issues?${otherIssuesQuery}`,
      ),
    ]);

    if (
      !maintainabilityResponse.ok ||
      !testCoverageResponse.ok ||
      !codeSmellsResponse.ok ||
      !duplicationResponse.ok ||
      !otherIssuesResponse.ok
    ) {
      throw new Error('Failed fetching Code Climate info');
    }

    const maintainabilityData = (
      (await maintainabilityResponse.json()) as CodeClimateMaintainabilityData
    ).data.attributes.ratings[0];
    const testCoverageData = (
      (await testCoverageResponse.json()) as CodeClimateTestCoverageData
    ).data.attributes.rating;
    const codeSmellsData = (
      (await codeSmellsResponse.json()) as CodeClimateIssuesData
    ).meta.total_count;
    const duplicationData = (
      (await duplicationResponse.json()) as CodeClimateIssuesData
    ).meta.total_count;
    const otherIssuesData = (
      (await otherIssuesResponse.json()) as CodeClimateIssuesData
    ).meta.total_count;

    return [
      maintainabilityData,
      testCoverageData,
      codeSmellsData,
      duplicationData,
      otherIssuesData,
    ];
  }

  async fetchData(repoID: string): Promise<CodeClimateData> {
    if (!repoID) {
      throw new Error('No Repo id found');
    }

    const apiUrl = `${await this.discoveryApi.getBaseUrl(
      'proxy',
    )}/codeclimate/api`;

    const repoResponse = await this.fetchApi.fetch(`${apiUrl}/repos/${repoID}`);

    if (!repoResponse.ok) {
      throw new Error('Failed fetching Code Climate info');
    }

    const repoData = ((await repoResponse.json()) as CodeClimateRepoData).data;
    const snapshotID =
      repoData.relationships.latest_default_branch_snapshot.data.id;
    const testReportID =
      repoData.relationships.latest_default_branch_test_report.data.id;

    const [
      maintainabilityData,
      testCoverageData,
      codeSmellsData,
      duplicationData,
      otherIssuesData,
    ] = await this.fetchAllData({
      apiUrl,
      repoID,
      snapshotID,
      testReportID,
    });

    const maintainabilityValue: any = {};
    maintainabilityValue[
      maintainabilityData.measure.meta.implementation_time.unit
    ] = maintainabilityData.measure.meta.implementation_time.value.toFixed();

    return {
      repoID,
      maintainability: {
        letter: maintainabilityData.letter,
        value: humanizeDuration(
          Duration.fromObject(maintainabilityValue).toMillis(),
          { largest: 1 },
        ),
      },
      testCoverage: {
        letter: testCoverageData.letter,
        value: testCoverageData.measure.value.toFixed(),
      },
      numberOfCodeSmells: codeSmellsData,
      numberOfDuplication: duplicationData,
      numberOfOtherIssues: otherIssuesData,
    };
  }
}
