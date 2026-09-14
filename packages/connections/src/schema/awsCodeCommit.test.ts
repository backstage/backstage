/*
 * Copyright 2026 The Backstage Authors
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
import { AwsCodeCommitConnectionType } from './awsCodeCommit';

describe('AwsCodeCommitConnectionType', () => {
  it('requires an authenticated connection', () => {
    expect(
      AwsCodeCommitConnectionType.authMethods.map(({ method }) => method),
    ).toEqual(['accessKey', 'assumeRole']);

    expect(() =>
      AwsCodeCommitConnectionType.configSchema.parse({
        type: 'aws-codecommit',
        host: 'us-east-1.console.aws.amazon.com',
        region: 'us-east-1',
        auth: [{ method: 'none' }],
      }),
    ).toThrow();
  });
});
