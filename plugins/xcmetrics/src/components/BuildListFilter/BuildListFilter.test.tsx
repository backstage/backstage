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
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { BuildListFilter } from './BuildListFilter';
import { BuildFilters, xcmetricsApiRef } from '../../api';
import { RenderResult } from '@testing-library/react';

jest.mock('../../api/XcmetricsClient');
const client = require('../../api/XcmetricsClient');

jest.mock('../DatePicker', () => ({
  DatePicker: () => 'DatePicker',
}));

const initialValues = {
  from: '2020-07-30',
  to: '2021-07-30',
};

const renderWithFiltersVisible = async (
  callback?: (filters: BuildFilters) => void,
) => {
  const rendered = await renderInTestApp(
    <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
      <BuildListFilter
        initialValues={initialValues}
        onFilterChange={callback ?? jest.fn()}
      />
    </TestApiProvider>,
  );

  await userEvent.click(rendered.getByLabelText('show filters'));
  return rendered;
};

const setStatusFilter = async (rendered: RenderResult, option: string) => {
  const statusSelect = rendered.getAllByTestId('select')[0];
  await userEvent.click(statusSelect);
  await userEvent.click((await rendered.findAllByText(option))[0]);
};

const setProjectFilter = async (rendered: RenderResult, option: string) => {
  const statusSelect = rendered.getAllByTestId('select')[1];
  await userEvent.click(statusSelect);
  const options = await rendered.findAllByText(option);
  await userEvent.click(options[options.length - 1]);
};

describe('BuildListFilter', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[xcmetricsApiRef, client.XcmetricsClient]]}>
        <BuildListFilter
          initialValues={initialValues}
          onFilterChange={jest.fn()}
        />
      </TestApiProvider>,
    );

    expect(rendered.getByText('Filters (0)')).toBeInTheDocument();
  });

  it('should toggle between showing and hiding filters', async () => {
    const rendered = await renderWithFiltersVisible();

    expect((await rendered.findAllByText('DatePicker')).length).toEqual(2);
    expect(await rendered.findByText('Status')).toBeInTheDocument();
    expect(await rendered.findByText('Project')).toBeInTheDocument();

    await userEvent.click(rendered.getByLabelText('hide filters'));
    expect(rendered.queryByText('DatePicker')).toBeNull();
    expect(rendered.queryByText('Status')).toBeNull();
    expect(rendered.queryByText('Project')).toBeNull();
  });

  it('should load projects', async () => {
    const callback = jest.fn();
    const rendered = await renderWithFiltersVisible(callback);
    await userEvent.click((await rendered.findAllByText('All'))[1]);

    expect(
      await rendered.findByText(client.mockBuild.projectName),
    ).toBeInTheDocument();
  });

  it('should call back with a status when status is selected', async () => {
    const callback = jest.fn();
    const rendered = await renderWithFiltersVisible(callback);

    await setStatusFilter(rendered, 'Succeeded');
    expect(callback).toHaveBeenCalledWith({
      ...initialValues,
      buildStatus: 'succeeded',
    });

    await setStatusFilter(rendered, 'All');
    expect(callback).toHaveBeenCalledWith(initialValues);
  });

  it('should call back with a project when project is selected', async () => {
    const callback = jest.fn();
    const rendered = await renderWithFiltersVisible(callback);

    await setProjectFilter(rendered, client.mockBuild.projectName);
    expect(callback).toHaveBeenCalledWith({
      ...initialValues,
      project: client.mockBuild.projectName,
    });

    await setProjectFilter(rendered, 'All');
    expect(callback).toHaveBeenCalledWith(initialValues);
  });

  it('should display a count of active (changed) filters', async () => {
    const rendered = await renderWithFiltersVisible();

    await setStatusFilter(rendered, 'Failed');
    await setProjectFilter(rendered, client.mockBuild.projectName);

    expect(await rendered.findByText('Filters (2)')).toBeInTheDocument();
  });

  it('should clear all filters', async () => {
    const callback = jest.fn();
    const rendered = await renderWithFiltersVisible(callback);

    await setStatusFilter(rendered, 'Failed');
    await setProjectFilter(rendered, client.mockBuild.projectName);

    callback.mockClear();
    await userEvent.click(await rendered.findByText('Clear all'));

    expect(callback).toHaveBeenCalledWith(initialValues);
    expect(await rendered.findByText('Filters (0)')).toBeInTheDocument();
  });
});
