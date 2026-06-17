/*
 * Copyright 2025 The Backstage Authors
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
import { screen } from '@testing-library/react';
import { CustomHomepageGrid } from './CustomHomepageGrid';
import {
  renderInTestApp,
  mockApis,
  TestApiProvider,
} from '@backstage/test-utils';
import { homePlugin } from '../../plugin';
import {
  createComponentExtension,
  storageApiRef,
} from '@backstage/core-plugin-api';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';

const ComponentA = homePlugin.provide(
  createComponentExtension({
    name: 'A',
    component: {
      sync: () => <div>A</div>,
    },
  }),
);

const ComponentB = homePlugin.provide(
  createComponentExtension({
    name: 'B',
    component: {
      sync: () => <div>B</div>,
    },
  }),
);

const ComponentC = homePlugin.provide(
  createComponentExtension({
    name: 'C',
    component: {
      sync: () => <div>C</div>,
    },
  }),
);

const defaultConfig: ComponentProps<typeof CustomHomepageGrid>['config'] = [
  {
    component: 'A',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  },
  {
    component: 'B',
    x: 10,
    y: 0,
    width: 10,
    height: 10,
  },
  {
    component: 'C',
    x: 0,
    y: 10,
    width: 20,
    height: 10,
  },
];

describe('CustomHomepageGrid', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should save edits', async () => {
    const mockStorage = mockApis.storage();

    await renderInTestApp(
      <TestApiProvider apis={[[storageApiRef, mockStorage]]}>
        <CustomHomepageGrid config={defaultConfig}>
          <ComponentA />
          <ComponentB />
          <ComponentC />
        </CustomHomepageGrid>
      </TestApiProvider>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();

    const editButton = screen.getByRole('button', { name: 'Edit' });
    await userEvent.click(editButton);
    expect(editButton).not.toBeVisible();

    await userEvent.click(
      screen.getAllByRole('button', { name: 'Delete widget' })[0],
    );

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await userEvent.click(saveButton);
    expect(saveButton).not.toBeVisible();

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();

    expect(
      mockStorage.forBucket('home.customHomepage').snapshot('home'),
    ).toEqual({
      key: 'home',
      presence: 'present',
      value: expect.any(String),
    });
  });

  it('should cancel edits', async () => {
    const mockStorage = mockApis.storage();

    await renderInTestApp(
      <TestApiProvider apis={[[storageApiRef, mockStorage]]}>
        <CustomHomepageGrid config={defaultConfig}>
          <ComponentA />
          <ComponentB />
          <ComponentC />
        </CustomHomepageGrid>
      </TestApiProvider>,
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    const widgets = screen.getAllByRole('button', { name: 'Delete widget' });

    for (const widget of widgets) {
      await userEvent.click(widget);
    }

    expect(screen.queryByText('A')).not.toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
    expect(screen.queryByText('C')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();

    expect(
      mockStorage.forBucket('home.customHomepage').snapshot('home'),
    ).toEqual(
      expect.objectContaining({ presence: 'absent', value: undefined }),
    );
  });
});
