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
import { renderInTestApp } from '@backstage/test-utils';

import {
  StatusOK,
  StatusWarning,
  StatusError,
  StatusPending,
  StatusRunning,
  StatusAborted,
} from './Status';

describe('<StatusOK />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(<StatusOK>OK</StatusOK>);
    expect(getByText('OK')).toBeInTheDocument();
  });
});

describe('<StatusWarning />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <StatusWarning>Warning</StatusWarning>,
    );
    expect(getByText('Warning')).toBeInTheDocument();
  });
});

describe('<StatusError />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <StatusError>Error</StatusError>,
    );
    expect(getByText('Error')).toBeInTheDocument();
  });
});

describe('<StatusPending />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <StatusPending>Pending</StatusPending>,
    );
    expect(getByText('Pending')).toBeInTheDocument();
  });
});

describe('<StatusRunning />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <StatusRunning>Running</StatusRunning>,
    );
    expect(getByText('Running')).toBeInTheDocument();
  });
});

describe('<StatusAborted />', () => {
  it('renders without exploding', async () => {
    const { getByText } = await renderInTestApp(
      <StatusAborted>Aborted</StatusAborted>,
    );
    expect(getByText('Aborted')).toBeInTheDocument();
  });
});
