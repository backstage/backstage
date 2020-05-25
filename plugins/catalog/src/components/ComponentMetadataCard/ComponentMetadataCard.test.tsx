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
import ComponentMetadataCard from './ComponentMetadataCard';
import { Component } from '../../data/component';
import { render } from '@testing-library/react';

describe('ComponentMetadataCard component', () => {
  it('should display component name if provided', async () => {
    const testComponent: Component = {
      name: 'test',
    };
    const rendered = await render(
      <ComponentMetadataCard loading={false} component={testComponent} />,
    );
    expect(await rendered.findByText('test')).toBeInTheDocument();
  });
  it('should display loader when loading is set to true', async () => {
    const rendered = await render(
      <ComponentMetadataCard loading component={undefined} />,
    );
    expect(await rendered.findByRole('progressbar')).toBeInTheDocument();
  });
});
