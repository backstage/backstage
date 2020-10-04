/*
 * Copyright 2020 Spotify AB
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
import { act, render, RenderResult } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';
import { ThemeProvider } from '@material-ui/core';
import { customPageTheme } from '@backstage/theme';
import { Header } from './Header';

jest.mock('react-helmet', () => {
  return {
    Helmet: ({ defaultTitle }: any) => <div>defaultTitle: {defaultTitle}</div>,
  };
});

const ThemeProviderWrapper: React.FC = ({ children }) => (
  <ThemeProvider
    theme={{
      pageTheme: customPageTheme.pageTheme.home,
      ...customPageTheme.baseTheme,
    }}
  >
    {children}
  </ThemeProvider>
);

describe('<Header/>', () => {
  it('should render with title', async () => {
    let rendered: RenderResult | undefined;
    await act(async () => {
      rendered = render(wrapInTestApp(<Header title="Title" />), {
        wrapper: ThemeProviderWrapper,
      });
    });
    rendered?.getByText('Title');
  });

  it('should set document title', async () => {
    let rendered: RenderResult | undefined;
    await act(async () => {
      rendered = render(wrapInTestApp(<Header title="Title1" />), {
        wrapper: ThemeProviderWrapper,
      });
    });
    rendered?.getByText('Title1');
    rendered?.getByText('defaultTitle: Title1 | Backstage');
  });

  it('should override document title', async () => {
    let rendered: RenderResult | undefined;
    await act(async () => {
      rendered = render(
        wrapInTestApp(<Header title="Title1" pageTitleOverride="Title2" />),
        {
          wrapper: ThemeProviderWrapper,
        },
      );
    });
    rendered?.getByText('Title1');
    rendered?.getByText('defaultTitle: Title2 | Backstage');
  });

  it('should have subtitle', async () => {
    let rendered: RenderResult | undefined;
    await act(async () => {
      rendered = render(
        wrapInTestApp(<Header title="Title" subtitle="Subtitle" />),
        {
          wrapper: ThemeProviderWrapper,
        },
      );
    });
    rendered?.getByText('Subtitle');
  });

  it('should have type rendered', async () => {
    let rendered: RenderResult | undefined;
    await act(async () => {
      rendered = render(wrapInTestApp(<Header title="Title" type="tool" />), {
        wrapper: ThemeProviderWrapper,
      });
    });
    rendered?.getByText('tool');
  });
});
