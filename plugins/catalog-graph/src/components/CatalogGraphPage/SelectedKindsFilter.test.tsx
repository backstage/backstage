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

import { renderWithEffects } from '@backstage/test-utils';
import { mockApis, TestApiProvider } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectedKindsFilter } from './SelectedKindsFilter';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const catalogApi = catalogApiMock.mock({
  getEntityFacets: jest.fn().mockResolvedValue({
    facets: {
      kind: [
        { value: 'Component', count: 2 },
        { value: 'System', count: 1 },
        { value: 'API', count: 1 },
        { value: 'Resource', count: 1 },
      ],
    },
  }),
});
const apis = [
  mockApis.alert(),
  mockApis.translation(),
  mockApis.error(),
  catalogApi,
] as const;

describe('<SelectedKindsFilter/>', () => {
  it('should render current value and select another kind', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <TestApiProvider apis={apis}>
        <SelectedKindsFilter value={['api', 'component']} onChange={onChange} />
      </TestApiProvider>,
    );

    const trigger = await screen.findByRole('button', { name: /Kinds/ });
    expect(trigger).toHaveTextContent('API');
    expect(trigger).toHaveTextContent('Component');

    await userEvent.click(trigger);
    await userEvent.click(
      await screen.findByRole('option', { name: 'System' }),
    );

    expect(onChange).toHaveBeenCalledWith(['api', 'component', 'system']);
  });

  it('should return undefined if all values are selected', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <TestApiProvider apis={apis}>
        <SelectedKindsFilter
          value={['api', 'component', 'system']}
          onChange={onChange}
        />
      </TestApiProvider>,
    );

    await userEvent.click(await screen.findByRole('button', { name: /Kinds/ }));
    await userEvent.click(
      await screen.findByRole('option', { name: 'Resource' }),
    );

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('should return undefined when the last kind is deselected', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <TestApiProvider apis={apis}>
        <SelectedKindsFilter value={['api']} onChange={onChange} />
      </TestApiProvider>,
    );

    await userEvent.click(await screen.findByRole('button', { name: /Kinds/ }));
    await userEvent.click(await screen.findByRole('option', { name: 'API' }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
