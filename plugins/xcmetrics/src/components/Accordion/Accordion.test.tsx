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
import { renderInTestApp } from '@backstage/test-utils';
import { Accordion } from './Accordion';
import userEvent from '@testing-library/user-event';

describe('Accordion', () => {
  it('should render', async () => {
    const rendered = await renderInTestApp(
      <Accordion
        id="accordionId"
        heading="heading"
        secondaryHeading="secondaryHeading"
      />,
    );

    expect(rendered.getByText('heading')).toBeInTheDocument();
    expect(rendered.getByText('secondaryHeading')).toBeInTheDocument();
  });

  it('should show content when clicked', async () => {
    const rendered = await renderInTestApp(
      <Accordion
        id="accordionId"
        heading="heading"
        secondaryHeading="secondaryHeading"
      >
        Content
      </Accordion>,
    );

    expect(rendered.getByText('Content')).not.toBeVisible();

    userEvent.click(rendered.getByRole('button'));
    expect(await rendered.findByText('Content')).toBeVisible();
  });
});
