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

import { repoPickerValidation } from './validation';
import { FieldValidation } from '@rjsf/core';
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/core-app-api';
import { ApiHolder } from '@backstage/core-plugin-api';

describe('RepoPicker Validation', () => {
  const fieldValidator = () =>
    ({
      addError: jest.fn(),
    } as unknown as FieldValidation);

  const config = new ConfigReader({
    integrations: {
      bitbucket: [
        {
          host: 'bitbucket.org',
        },
        {
          host: 'server.bitbucket.com',
        },
      ],
      github: [
        {
          host: 'github.com',
        },
      ],
    },
  });

  const scmIntegrations = ScmIntegrations.fromConfig(config);

  const apiHolderMock: jest.Mocked<ApiHolder> = {
    get: jest.fn().mockImplementation(() => {
      return scmIntegrations;
    }),
  };

  it('validates when no repo', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('github.com?owner=a', mockFieldValidation, {
      apiHolder: apiHolderMock,
    });

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, repo not provided',
    );
  });

  it('validates when no owner', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('github.com?repo=a', mockFieldValidation, {
      apiHolder: apiHolderMock,
    });

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, owner not provided',
    );
  });

  it('validates when not a real url', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('', mockFieldValidation, { apiHolder: apiHolderMock });

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Unable to parse the Repository URL',
    );
  });

  it('validates properly with proper input', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('github.com?owner=a&repo=b', mockFieldValidation, {
      apiHolder: apiHolderMock,
    });

    expect(mockFieldValidation.addError).not.toHaveBeenCalled();
  });

  it('validates when no workspace, project or repo provided for bitbucket cloud', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('bitbucket.org', mockFieldValidation, {
      apiHolder: apiHolderMock,
    });

    expect(mockFieldValidation.addError).toHaveBeenNthCalledWith(
      1,
      'Incomplete repository location provided, workspace not provided',
    );
    expect(mockFieldValidation.addError).toHaveBeenNthCalledWith(
      2,
      'Incomplete repository location provided, project not provided',
    );
    expect(mockFieldValidation.addError).toHaveBeenNthCalledWith(
      3,
      'Incomplete repository location provided, repo not provided',
    );
  });

  it('validates when no workspace provided for bitbucket cloud', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation(
      'bitbucket.org?project=p&repo=r',
      mockFieldValidation,
      { apiHolder: apiHolderMock },
    );

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, workspace not provided',
    );
  });

  it('validates when no project provided for bitbucket cloud', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation(
      'bitbucket.org?workspace=w&repo=r',
      mockFieldValidation,
      { apiHolder: apiHolderMock },
    );

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, project not provided',
    );
  });

  it('validates when no repo provided for bitbucket cloud', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation(
      'bitbucket.org?workspace=w&project=p',
      mockFieldValidation,
      { apiHolder: apiHolderMock },
    );

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, repo not provided',
    );
  });

  it('validates when no project or repo provided for bitbucket server', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('server.bitbucket.com', mockFieldValidation, {
      apiHolder: apiHolderMock,
    });

    expect(mockFieldValidation.addError).toHaveBeenNthCalledWith(
      1,
      'Incomplete repository location provided, project not provided',
    );
    expect(mockFieldValidation.addError).toHaveBeenNthCalledWith(
      2,
      'Incomplete repository location provided, repo not provided',
    );
  });

  it('validates when no project provided for bitbucket server', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation('server.bitbucket.com?repo=r', mockFieldValidation, {
      apiHolder: apiHolderMock,
    });

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, project not provided',
    );
  });

  it('validates when no repo provided for bitbucket server', () => {
    const mockFieldValidation = fieldValidator();

    repoPickerValidation(
      'server.bitbucket.com?project=p',
      mockFieldValidation,
      { apiHolder: apiHolderMock },
    );

    expect(mockFieldValidation.addError).toHaveBeenCalledWith(
      'Incomplete repository location provided, repo not provided',
    );
  });
});
