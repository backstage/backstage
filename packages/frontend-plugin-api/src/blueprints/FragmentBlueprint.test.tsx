/*
 * Copyright 2026 The Backstage Authors
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

import { createContext, useContext } from 'react';
import { screen } from '@testing-library/react';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { FragmentBlueprint } from './FragmentBlueprint';
import { useAppNode } from '../components/AppNodeProvider';

it('renders lazily with host context and the contributing extension identity', async () => {
  const HostContext = createContext('default');
  function Summary() {
    const host = useContext(HostContext);
    const node = useAppNode();
    return (
      <div>
        {host}: {node?.spec.id}
      </div>
    );
  }
  const loader = jest.fn(async () => <Summary />);
  const fragment = FragmentBlueprint.make({
    name: 'summary',
    params: { loader },
  });
  const element = createExtensionTester(fragment).reactElement();
  expect(loader).not.toHaveBeenCalled();

  renderInTestApp(
    <HostContext.Provider value="host">{element}</HostContext.Provider>,
  );
  expect(await screen.findByText('host: fragment:summary')).toBeVisible();
  expect(loader).toHaveBeenCalledTimes(1);
});
