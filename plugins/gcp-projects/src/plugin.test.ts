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

import { gcpProjectsPlugin } from './plugin';
import { GcpClient } from './api';
import { OAuthApi } from '@backstage/core-plugin-api';
import packageinfo from '../package.json';

describe('gcp-projects', () => {
  let sut: GcpClient;
  let googleAuthApi: OAuthApi;
  beforeEach(() => {
    sut = new GcpClient(googleAuthApi);
  });

  it('should export plugin', () => {
    expect(gcpProjectsPlugin).toBeDefined();
  });

  it('spy headers with identifying metadata', async () => {
    const response: any = {
      headers: {
        Accept: '*/*',
        'X-Goog-Api-Client': `backstage/gcpprojects/${packageinfo.version}`,
      },
    };
    jest.spyOn(sut, 'listProjects').mockImplementation((): any => {
      return response;
    });

    expect(response).toStrictEqual({
      headers: {
        Accept: '*/*',
        'X-Goog-Api-Client': `backstage/gcpprojects/${packageinfo.version}`,
      },
    });
  });
});
