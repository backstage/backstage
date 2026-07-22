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
import { PropsWithChildren } from 'react';
import { renderInTestApp } from '@backstage/test-utils';

import { useGoldenPathTask } from './GoldenPathExecution.utils';
import { GoldenPathExecution } from './GoldenPathExecution';
import { GP_TASK } from '../../mocks';

jest.mock('./GoldenPathExecution.utils.ts', () => ({
  useGoldenPathTask: jest.fn(),
}));

jest.mock('./useGoldenPathTaskContext', () => ({
  GoldenPathTaskContextProvider: ({ children }: PropsWithChildren) => (
    <div>{children}</div>
  ),
}));

const LAYOUT = 'Shire';
jest.mock('./ExecutionContentLayout', () => ({
  ExecutionContentLayout: () => <>{LAYOUT}</>,
}));

const MENU = 'Rohan';
jest.mock('./TaskContextMenu', () => ({
  TaskContextMenu: () => <>{MENU}</>,
}));

describe('GoldenPathExecution', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render Progress component when `loading === true`', async () => {
    (useGoldenPathTask as jest.Mock).mockReturnValue({ loading: true });

    const { getByTestId } = await renderInTestApp(<GoldenPathExecution />);

    expect(getByTestId('progress')).toBeInTheDocument();
  });

  it('should render Error panel when error is returned', async () => {
    const ERROR_MSG = 'Sauron saw you.';
    (useGoldenPathTask as jest.Mock).mockReturnValue({
      loading: false,
      error: new Error(ERROR_MSG),
    });

    const { getByText } = await renderInTestApp(<GoldenPathExecution />);

    expect(getByText(ERROR_MSG)).toBeInTheDocument();
  });

  it('should render Error panel when there is no task available', async () => {
    (useGoldenPathTask as jest.Mock).mockReturnValue({ loading: false });

    const { getByText } = await renderInTestApp(<GoldenPathExecution />);

    expect(
      getByText('There is no Golden Path created for this task ID'),
    ).toBeInTheDocument();
  });

  it('should render content when a task is available', async () => {
    (useGoldenPathTask as jest.Mock).mockReturnValue({
      loading: false,
      task: GP_TASK,
    });
    const { goldenPathInfo } = GP_TASK.spec;
    const TITLE =
      goldenPathInfo?.entity?.metadata.title ||
      goldenPathInfo?.entity?.metadata.name ||
      'Golden Path';

    const { getByText } = await renderInTestApp(<GoldenPathExecution />);

    expect(getByText(TITLE)).toBeInTheDocument();
    expect(getByText(LAYOUT)).toBeInTheDocument();
    expect(getByText(MENU)).toBeInTheDocument();
  });
});
