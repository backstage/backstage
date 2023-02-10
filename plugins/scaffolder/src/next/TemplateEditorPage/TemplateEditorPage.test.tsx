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

import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { TemplateEditorPage } from './TemplateEditorPage';

describe('TemplateEditorPage', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(<TemplateEditorPage />);

    expect(screen.getByText('Load Template Directory')).toBeInTheDocument();
    expect(screen.getByText('Edit Template Form')).toBeInTheDocument();
  });

  it('template directory loading should not be supported in Jest', async () => {
    await renderInTestApp(<TemplateEditorPage />);

    expect(
      screen.getByRole('button', { name: /Load Template Directory/ }),
    ).toBeDisabled();
  });

  it('should be able to continue to form preview', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            catalogApiRef,
            { getEntities: jest.fn().mockResolvedValue({ items: [] }) },
          ],
        ]}
      >
        <TemplateEditorPage />
      </TestApiProvider>,
    );

    await userEvent.click(screen.getByText('Edit Template Form'));

    expect(screen.getByLabelText('Load Existing Template')).toBeInTheDocument();
  });
});
