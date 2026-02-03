/*
 * Copyright 2024 The Backstage Authors
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

import { parseRepoUrl } from './AzureDevops';

describe('parseRepoUrl', () => {
  it('parses Azure DevOps Cloud url', async () => {
    const result = parseRepoUrl(
      'https://dev.azure.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );

    expect(result.host).toEqual('dev.azure.com');
    expect(result.org).toEqual('organization');
    expect(result.project).toEqual('project');
    expect(result.repo).toEqual('repository');
  });

  it('parses Azure DevOps Server url', async () => {
    const result = parseRepoUrl(
      'https://server.com/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );

    expect(result.host).toEqual('server.com');
    expect(result.org).toEqual('organization');
    expect(result.project).toEqual('project');
    expect(result.repo).toEqual('repository');
  });

  it('parses TFS subpath Url', async () => {
    const result = parseRepoUrl(
      'https://server.com/tfs/organization/project/_git/repository?path=%2Fcatalog-info.yaml',
    );

    expect(result.host).toEqual('server.com/tfs');
    expect(result.org).toEqual('organization');
    expect(result.project).toEqual('project');
    expect(result.repo).toEqual('repository');
  });
});
