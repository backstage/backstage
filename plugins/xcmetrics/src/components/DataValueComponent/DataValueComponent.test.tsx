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
import { DataValueComponent, DataValueGridItem } from './DataValueComponent';
import { renderInTestApp } from '@backstage/test-utils';

describe('DataValueComponent', () => {
  it('should render', async () => {
    const field = 'Field';
    const value = 'Value';
    const rendered = await renderInTestApp(
      <DataValueComponent field={field} value={value} />,
    );
    expect(rendered.getByText(field)).toBeInTheDocument();
    expect(rendered.getByText(value)).toBeInTheDocument();
  });

  it('should render placeholder text when no value is present', async () => {
    const field = 'Field';
    const rendered = await renderInTestApp(
      <DataValueComponent field={field} />,
    );
    expect(rendered.getByText(field)).toBeInTheDocument();
    expect(rendered.getByText('Unknown')).toBeInTheDocument();
  });

  it('grid item should render', async () => {
    const field = 'Field';
    const value = 'Value';
    const rendered = await renderInTestApp(
      <DataValueGridItem field={field} value={value} />,
    );
    expect(rendered.getByText(field)).toBeInTheDocument();
    expect(rendered.getByText(value)).toBeInTheDocument();
  });
});
