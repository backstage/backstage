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

import { CodeClimateData } from '../code-climate-data';
import { CodeClimateApi } from '../code-climate-api';
import maintainabilityMock from './code-climate-maintainability-mock.json';
import testCoverageMock from './code-climate-test-coverage-mock.json';
import { Duration } from 'luxon';
import humanizeDuration from 'humanize-duration';

const maintainabilityData = maintainabilityMock.data.attributes.ratings[0];
const testCoverageData = testCoverageMock.data.attributes.rating;

const maintainabilityValue: any = {};
maintainabilityValue[
  maintainabilityData.measure.meta.implementation_time.unit
] = maintainabilityData.measure.meta.implementation_time.value.toFixed();

export const mockData: CodeClimateData = {
  repoID: '6b8cc37a64b741dd9d516119',
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
  numberOfCodeSmells: 97,
  numberOfDuplication: 49,
  numberOfOtherIssues: 26,
};

export class MockCodeClimateApi implements CodeClimateApi {
  fetchData(): Promise<CodeClimateData> {
    return new Promise(resolve => {
      setTimeout(() => resolve(mockData), 800);
    });
  }
}
