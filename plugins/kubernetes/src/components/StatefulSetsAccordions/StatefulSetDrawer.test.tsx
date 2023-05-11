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
import * as statefulsets from '../../__fixtures__/2-statefulsets.json';
import { renderInTestApp, textContentMatcher } from '@backstage/test-utils';
import { StatefulSetDrawer } from './StatefulSetDrawer';

describe('StatefulSetDrawer', () => {
  it('should render statefulset drawer', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
      <StatefulSetDrawer
        statefulset={(statefulsets as any).statefulsets[0]}
        expanded
      />,
    );

    expect(getAllByText('dice-roller')).toHaveLength(4);
    expect(getByText('StatefulSet')).toBeInTheDocument();
    expect(getByText('YAML')).toBeInTheDocument();
    expect(
      getByText(textContentMatcher('Type: RollingUpdate')),
    ).toBeInTheDocument();
    expect(getByText('Rolling Update:')).toBeInTheDocument();
    expect(getByText(textContentMatcher('Max Surge: 25%'))).toBeInTheDocument();
    expect(
      getByText(textContentMatcher('Max Unavailable: 25%')),
    ).toBeInTheDocument();
    expect(getByText('Pod Management Policy')).toBeInTheDocument();
    expect(getByText('Parallel')).toBeInTheDocument();
    expect(getByText('Service Name')).toBeInTheDocument();
    expect(getByText('Selector')).toBeInTheDocument();
    expect(getByText('Match Labels:')).toBeInTheDocument();
    expect(
      getByText(textContentMatcher('App: dice-roller')),
    ).toBeInTheDocument();
    expect(getByText('Revision History Limit')).toBeInTheDocument();
    expect(getByText('10')).toBeInTheDocument();
    expect(getByText('namespace: default')).toBeInTheDocument();
  });

  it('should render statefulset drawer without namespace', async () => {
    const statefulset = (statefulsets as any).statefulsets[0];
    const { queryByText } = await renderInTestApp(
      <StatefulSetDrawer
        statefulset={{
          ...statefulset,
          metadata: { ...statefulset.metadata, namespace: undefined },
        }}
        expanded
      />,
    );

    expect(queryByText('namespace: default')).not.toBeInTheDocument();
  });
});
