/*
 * Copyright 2022 The Backstage Authors
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
import { CardHeader } from './CardHeader';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';

describe('CardHeader', () => {
  it('should select the correct theme from the theme provider from the header', () => {
    // Can't really test what we want here.
    // But we can check that we call the getPage theme with the right type of template at least.
    const mockTheme = {
      ...lightTheme,
      getPageTheme: jest.fn(lightTheme.getPageTheme),
    };

    render(
      <ThemeProvider theme={mockTheme}>
        <CardHeader
          template={{
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            kind: 'Template',
            metadata: { name: 'bob' },
            spec: {
              steps: [],
              type: 'service',
            },
          }}
        />
      </ThemeProvider>,
    );

    expect(mockTheme.getPageTheme).toHaveBeenCalledWith({ themeId: 'service' });
  });

  it('should render the type', () => {
    const { getByText } = render(
      <CardHeader
        template={{
          apiVersion: 'scaffolder.backstage.io/v1beta3',
          kind: 'Template',
          metadata: { name: 'bob' },
          spec: {
            steps: [],
            type: 'service',
          },
        }}
      />,
    );

    expect(getByText('Service')).toBeInTheDocument();
  });
});
