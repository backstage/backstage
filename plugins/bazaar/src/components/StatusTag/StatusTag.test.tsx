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
import { screen, cleanup } from '@testing-library/react';
import { StatusTag } from './StatusTag';
import { renderInTestApp } from '@backstage/test-utils';

afterEach(() => {
  cleanup();
});

it('should render tags', async () => {
  const tags = [
    {
      status: 'proposed',
      childComponent: 'warning',
    },
    {
      status: 'ongoing',
      childComponent: 'ok',
    },
  ];

  tags.map(async tag => {
    cleanup();
    const { status, childComponent } = tag;
    await renderInTestApp(<StatusTag status={status} />);
    const tagElement = screen.getByTestId(`tag-${status}`);
    expect(tagElement).toBeInTheDocument();
    expect(tagElement).toHaveTextContent(status);
    const warningElement = screen.getByTestId(childComponent);
    expect(warningElement).toBeInTheDocument();
  });
});
