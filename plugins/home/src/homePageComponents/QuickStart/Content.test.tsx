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

import { Content } from './Content';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import ContentImage from './static/backstageSystemModel.png';

describe('<QuickStartCard />', () => {
  const renderContent = async () => {
    return await renderInTestApp(
      <Content
        image={
          <img
            src={ContentImage}
            data-testid="quick-start-image"
            alt="quick start"
            width="100%"
            height="100%"
          />
        }
        docsLinkTitle="Testing docs link"
      />,
    );
  };

  it('should have expected card content', async () => {
    const { getByTestId } = await renderContent();
    const docsLink = getByTestId('quick-start-link-to-docs');
    expect(docsLink).toHaveTextContent('Testing docs link');
    expect(docsLink).toHaveAttribute('target', '_blank');
  });

  it('clicking the link opens the modal', async () => {
    const { getByTestId, getByText } = await renderContent();
    // Find the link element
    const link = getByText('Onboarding');
    // Simulate a click event on the link
    await userEvent.click(link);
    // Assert that the modal is visible
    const modal = getByTestId('content-modal-open');
    expect(modal).toBeVisible();
  });

  it('clicking the image opens the modal', async () => {
    const { getByTestId } = await renderContent();
    // Find the link element
    const link = getByTestId('quick-start-image');
    // Simulate a click event on the link
    await userEvent.click(link);
    // Assert that the modal is visible
    const modal = getByTestId('content-modal-open');
    expect(modal).toBeVisible();
  });
});
