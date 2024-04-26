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
import { ProblemStatus } from './ProblemStatus';
import { renderInTestApp } from '@backstage/test-utils';

describe('ProblemStatus', () => {
  it('renders StatusOK for a closed issue', async () => {
    const rendered = await renderInTestApp(<ProblemStatus status="closed" />);
    expect(await rendered.findByText('Closed')).toBeInTheDocument();
  });
  it('renders StatusError for an open issue', async () => {
    const rendered = await renderInTestApp(<ProblemStatus status="open" />);
    expect(await rendered.findByText('Open')).toBeInTheDocument();
  });
});
