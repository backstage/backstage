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

import React, { ComponentType, PropsWithChildren } from 'react';

import { Grid, ListItem } from '@material-ui/core';
import LabelIcon from '@material-ui/icons/Label';

import { TestApiProvider } from '@backstage/test-utils';

import { searchApiRef, MockSearchApi } from '../../api';
import { SearchContextProvider } from '../../context';

import { SearchAutocompleteDefaultOption } from './SearchAutocompleteDefaultOption';

export default {
  title: 'Plugins/Search/SearchAutocompleteDefaultOption',
  component: SearchAutocompleteDefaultOption,
  decorators: [
    (Story: ComponentType<{}>) => (
      <TestApiProvider apis={[[searchApiRef, new MockSearchApi()]]}>
        <SearchContextProvider>
          <Grid container direction="row">
            <Grid item xs={12}>
              <ListItem>
                <Story />
              </ListItem>
            </Grid>
          </Grid>
        </SearchContextProvider>
      </TestApiProvider>
    ),
  ],
};

export const Default = () => (
  <SearchAutocompleteDefaultOption primaryText="hello-world" />
);

export const Icon = () => (
  <SearchAutocompleteDefaultOption
    icon={<LabelIcon />}
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
    icon={<LabelIcon />}
    primaryText="hello-world"
    secondaryText="Hello World example for gRPC"
  />
);

export const CustomTextTypographies = () => (
  <SearchAutocompleteDefaultOption
    icon={<LabelIcon />}
    primaryText="hello-world"
    primaryTextTypographyProps={{ color: 'primary' }}
    secondaryText="Hello World example for gRPC"
    secondaryTextTypographyProps={{ color: 'secondary' }}
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
      icon={<LabelIcon />}
      primaryText={<CustomPrimaryText>hello-world</CustomPrimaryText>}
      secondaryText={
        <CustomSecondaryText>Hello World example for gRPC</CustomSecondaryText>
      }
      disableTextTypography
    />
  </dl>
);
