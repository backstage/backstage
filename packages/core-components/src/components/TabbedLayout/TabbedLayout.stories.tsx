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
import { PropsWithChildren } from 'react';
import { Route, Routes } from '@backstage/frontend-plugin-api';
import { TestMemoryRouterProvider } from '@backstage/frontend-test-utils';
import { TabbedLayout } from './TabbedLayout';

export default {
  title: 'Navigation/TabbedLayout',
  component: TabbedLayout,
  tags: ['!manifest'],
};

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <TestMemoryRouterProvider>
    <Routes>
      <Route path="/*" element={<>{children}</>} />
    </Routes>
  </TestMemoryRouterProvider>
);

export const Default = () => (
  <Wrapper>
    <TabbedLayout>
      <TabbedLayout.Route path="/" title="tabbed-test-title">
        <div>tabbed-test-content</div>
      </TabbedLayout.Route>
      <TabbedLayout.Route path="/some-other-path" title="tabbed-test-title-2">
        <div>tabbed-test-content-2</div>
      </TabbedLayout.Route>
    </TabbedLayout>
  </Wrapper>
);
