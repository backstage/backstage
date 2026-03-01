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

import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchAutocompleteDefaultOption } from './SearchAutocompleteDefaultOption';

export default {
  title: 'Plugins/Search/SearchAutocompleteDefaultOption',
  component: SearchAutocompleteDefaultOption,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) => (
      <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
        <SearchContextProvider>
          <div className="grid gap-4">
            <div className="col-span-full">
              <li className="flex items-center gap-3 px-2 py-2">
                <Story />
              </li>
            </div>
          </div>
        </SearchContextProvider>
      </TestApiProvider>
    ),
  ],
  tags: ['!manifest'],
};

export const Default = () => (
  <SearchAutocompleteDefaultOption primaryText="hello-world" />
);

export const Icon = () => (
  <SearchAutocompleteDefaultOption
    icon={<Tag className="h-5 w-5" />}
    primaryText="hello-world"
  />
);

export const SecondaryText = () => (
  <SearchAutocompleteDefaultOption
    primaryText="hello-world"
    secondaryText="Hello World example for gRPC"
  />
);

export const AllCombined = () => (
  <SearchAutocompleteDefaultOption
    icon={<Tag className="h-5 w-5" />}
    primaryText="hello-world"
    secondaryText="Hello World example for gRPC"
  />
);

export const CustomTextTypographies = () => (
  <SearchAutocompleteDefaultOption
    icon={<Tag className="h-5 w-5" />}
    primaryText="hello-world"
    primaryTextTypographyProps={{ className: 'text-primary' }}
    secondaryText="Hello World example for gRPC"
    secondaryTextTypographyProps={{ className: 'text-muted-foreground' }}
  />
);

const CustomPrimaryText = ({ children }: PropsWithChildren<{}>) => (
  <dt>{children}</dt>
);

const CustomSecondaryText = ({ children }: PropsWithChildren<{}>) => (
  <dd>{children}</dd>
);

export const CustomTextComponents = () => (
  <dl>
    <SearchAutocompleteDefaultOption
      icon={<Tag className="h-5 w-5" />}
      primaryText={<CustomPrimaryText>hello-world</CustomPrimaryText>}
      secondaryText={
        <CustomSecondaryText>Hello World example for gRPC</CustomSecondaryText>
      }
      disableTextTypography
    />
  </dl>
);
