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
import { useApi as useApiMocked } from '@backstage/core-plugin-api';
import { useEntityKinds as useEntityKindsMocked } from '@backstage/plugin-catalog-react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SelectedKindsFilter } from './SelectedKindsFilter';

jest.mock('@backstage/core-plugin-api');
jest.mock('@backstage/plugin-catalog-react');

const useApi = useApiMocked as jest.Mock<ReturnType<typeof useApiMocked>>;
const useEntityKinds = useEntityKindsMocked as jest.Mock<
  ReturnType<typeof useEntityKindsMocked>
>;

describe('<SelectedKindsFilter/>', () => {
  beforeEach(() => {
    useApi.mockReturnValue({});
    useEntityKinds.mockReturnValue({
      loading: false,
      kinds: ['API', 'Component', 'System', 'Domain', 'Resource'],
      error: undefined,
    });
  });

  afterEach(() => jest.resetAllMocks());

  test('should not explode while loading', () => {
    useEntityKinds.mockReturnValue({
      loading: true,
      kinds: undefined,
      error: undefined,
    });
    const { baseElement } = render(
      <SelectedKindsFilter value={['api', 'component']} onChange={() => {}} />,
    );

    expect(baseElement).toBeInTheDocument();
  });

  test('should render current value', () => {
    const { getByText } = render(
      <SelectedKindsFilter value={['api', 'component']} onChange={() => {}} />,
    );

    expect(getByText('API')).toBeInTheDocument();
    expect(getByText('Component')).toBeInTheDocument();
  });

  test('should select value', async () => {
    const onChange = jest.fn();
    const { getByText, getByLabelText } = render(
      <SelectedKindsFilter value={['api', 'component']} onChange={onChange} />,
    );

    userEvent.click(getByLabelText('Open'));

    await waitFor(() => expect(getByText('System')).toBeInTheDocument());

    userEvent.click(getByText('System'));

    await waitFor(() => {
      expect(onChange).toBeCalledWith(['api', 'component', 'system']);
    });
  });

  test('should return undefined if all values are selected', async () => {
    const onChange = jest.fn();
    const { getByText, getByLabelText } = render(
      <SelectedKindsFilter
        value={['api', 'component', 'system', 'domain']}
        onChange={onChange}
      />,
    );

    userEvent.click(getByLabelText('Open'));

    await waitFor(() => expect(getByText('Resource')).toBeInTheDocument());

    userEvent.click(getByText('Resource'));

    await waitFor(() => {
      expect(onChange).toBeCalledWith(undefined);
    });
  });

  test('should return all values when cleared', async () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <SelectedKindsFilter value={[]} onChange={onChange} />,
    );

    userEvent.click(getByRole('combobox'));
    userEvent.tab();

    await waitFor(() => {
      expect(onChange).toBeCalledWith(undefined);
    });
  });
});
