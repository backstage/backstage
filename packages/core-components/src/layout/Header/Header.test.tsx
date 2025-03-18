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

import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Header } from './Header';
import { ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';

jest.mock('react-helmet', () => {
  return {
    Helmet: ({ defaultTitle }: any) => <div>defaultTitle: {defaultTitle}</div>,
  };
});

describe('<Header/>', () => {
  it('should render with title', async () => {
    const rendered = await renderInTestApp(<Header title="Title" />);
    expect(rendered.getByText('Title')).toBeInTheDocument();
  });

  it('should set document title', async () => {
    const rendered = await renderInTestApp(<Header title="Title1" />);
    expect(rendered.getByText('Title1')).toBeInTheDocument();
    expect(
      rendered.getByText('defaultTitle: Title1 | Backstage'),
    ).toBeInTheDocument();
  });

  it('should override document title', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title1" pageTitleOverride="Title2" />,
    );
    expect(rendered.getByText('Title1')).toBeInTheDocument();
    expect(
      rendered.getByText('defaultTitle: Title2 | Backstage'),
    ).toBeInTheDocument();
  });

  it('should have subtitle', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title" subtitle="Subtitle" />,
    );
    expect(rendered.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should have type rendered', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title" type="tool" />,
    );
    expect(rendered.getByText('tool')).toBeInTheDocument();
  });

  it('should have breadcrumb rendered', async () => {
    const rendered = await renderInTestApp(
      <Header title="Title" type="tool" typeLink="/tool" />,
    );
    expect(rendered.getAllByText('Title')).toBeTruthy();
  });

  it('should use app.title', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[[configApiRef, new ConfigReader({ app: { title: 'Blah' } })]]}
      >
        <Header title="Title" type="tool" typeLink="/tool" />,
      </TestApiProvider>,
    );
    expect(rendered.getAllByText(/Title | Blah/)).toBeTruthy();
  });
});
