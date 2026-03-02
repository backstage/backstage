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

import { ComponentType, PropsWithChildren } from 'react';

import { Tag } from 'lucide-react';

import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchAutocomplete } from './SearchAutocomplete';
import { SearchAutocompleteDefaultOption } from './SearchAutocompleteDefaultOption';

export default {
  title: 'Plugins/Search/SearchAutocomplete',
  component: SearchAutocomplete,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
          <SearchContextProvider>
            <div className="grid gap-4">
              <div className="col-span-full">
                <Story />
              </div>
            </div>
          </SearchContextProvider>
        </TestApiProvider>,
      ),
  ],
  tags: ['!manifest'],
};

export const Default = () => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
};

export const Outlined = () => {
  return <SearchAutocomplete options={['hello-word', 'petstore', 'spotify']} />;
};

export const Initialized = () => {
  const options = ['hello-word', 'petstore', 'spotify'];
  return <SearchAutocomplete options={options} value={options[0]} />;
};

export const LoadingOptions = () => {
  return <SearchAutocomplete options={[]} loading />;
};

export const RenderingCustomOptions = () => {
  const options = [
    {
      title: 'hello-world',
      text: 'Hello World example for gRPC',
    },
    {
      title: 'petstore',
      text: 'The petstore API',
    },
    {
      title: 'spotify',
      text: 'The Spotify web API',
    },
  ];

  return (
    <SearchAutocomplete
      options={options}
      renderOption={option => (
        <SearchAutocompleteDefaultOption
          icon={<Tag aria-label="Option icon" />}
          primaryText={option.title}
          secondaryText={option.text}
        />
      )}
    />
  );
};
