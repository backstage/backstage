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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { DefaultResultListItem } from './DefaultResultListItem';

describe('DefaultResultListItem', () => {
  const result = {
    title: 'title',
    text: 'text',
    location: '/location',
    owner: 'owner',
  };

  it('Links to result.location', async () => {
    await renderInTestApp(<DefaultResultListItem result={result} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', result.location);
  });

  it('Includes primary/secondary text (title / text)', async () => {
    await renderInTestApp(<DefaultResultListItem result={result} />);
    expect(screen.getByRole('listitem')).toHaveTextContent(
      result.title + result.text,
    );
  });

  it('should render icon if prop is specified', async () => {
    await renderInTestApp(
      <DefaultResultListItem
        result={result}
        icon={<FindInPageIcon aria-label="icon" />}
      />,
    );
    expect(screen.getByLabelText('icon')).toBeInTheDocument();
  });

  it('should render secondary action if prop is specified', async () => {
    await renderInTestApp(
      <DefaultResultListItem result={result} secondaryAction={result.owner} />,
    );
    expect(screen.getByText('owner')).toBeInTheDocument();
  });
});
