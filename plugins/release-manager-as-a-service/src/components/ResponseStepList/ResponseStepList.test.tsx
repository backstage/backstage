/*
 * Copyright 2021 Spotify AB
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
import React from 'react';
import { render } from '@testing-library/react';

import { TEST_IDS } from '../../test-helpers/test-ids';
import { ResponseStepList } from './ResponseStepList';

describe('ResponseStepList', () => {
  it('should render loading state when loading', () => {
    const { getByTestId } = render(
      <ResponseStepList
        loading
        setRefetch={jest.fn()}
        title="mock_responseStepList_title"
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.circularProgress),
    ).toBeInTheDocument();
  });

  it('should render loading state when no responseSteps', () => {
    const { getByTestId } = render(
      <ResponseStepList
        loading={false}
        setRefetch={jest.fn()}
        title="mock_responseStepList_title"
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.circularProgress),
    ).toBeInTheDocument();
  });

  it('should render dialog content when loading is completed', () => {
    const { getByTestId } = render(
      <ResponseStepList
        loading={false}
        setRefetch={jest.fn()}
        title="mock_responseStepList_title"
        responseSteps={[]}
      />,
    );

    expect(
      getByTestId(TEST_IDS.components.responseStepListDialogContent),
    ).toBeInTheDocument();
  });
});
