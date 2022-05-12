/*
 * Copyright 2020 The Backstage Authors
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
import { DismissableBanner, Props } from './DismissableBanner';
import Typography from '@material-ui/core/Typography';
import { WebStorage } from '@backstage/core-app-api';
import {
  ErrorApi,
  storageApiRef,
  StorageApi,
} from '@backstage/core-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { Link } from '../Link';

export default {
  title: 'Feedback/DismissableBanner',
  component: DismissableBanner,
  argTypes: {
    variant: {
      options: ['info', 'error', 'warning'],
      control: { type: 'select' },
    },
  },
};

let errorApi: ErrorApi;
const containerStyle = { width: '70%' };

const createWebStorage = (): StorageApi => {
  return WebStorage.create({ errorApi });
};

const apis = [[storageApiRef, createWebStorage()] as const];
const defaultArgs = {
  message: 'This is a dismissable banner',
  variant: 'info',
  fixed: false,
};

export const Default = (args: Props) => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner {...args} id="default_dismissable" />
    </TestApiProvider>
  </div>
);

Default.args = defaultArgs;

export const WithLink = (args: Props) => (
  <div style={containerStyle}>
    <TestApiProvider apis={apis}>
      <DismissableBanner
        {...args}
        message={
          <Typography>
            This is a dismissable banner with a link:{' '}
            <Link to="http://example.com" color="textPrimary">
              example.com
            </Link>
          </Typography>
        }
        id="linked_dismissable"
      />
    </TestApiProvider>
  </div>
);

WithLink.args = defaultArgs;
