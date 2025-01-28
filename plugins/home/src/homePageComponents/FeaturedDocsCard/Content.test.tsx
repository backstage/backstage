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

import { Content } from './Content';
import { ReactNode } from 'react';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const docsEntities = [
  {
    apiVersion: '1',
    kind: 'Location',
    metadata: {
      name: 'getting-started-with-idp',
      title: 'Getting Started Docs',
    },
    spec: {
      type: 'documentation',
    },
  },
];

describe('<FeaturedDocsCard />', () => {
  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <TestApiProvider
      apis={[[catalogApiRef, catalogApiMock({ entities: docsEntities })]]}
    >
      {children}
    </TestApiProvider>
  );

  it('should show expected featured doc and title', async () => {
    const { getByTestId, getByText } = await renderInTestApp(
      <Wrapper>
        <Content
          filter={{
            'spec.type': 'documentation',
            'metadata.name': 'getting-started-with-idp',
          }}
          emptyState={undefined}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/home': entityRouteRef,
        },
      },
    );
    const docsCardContent = getByTestId('docs-card-content');
    const docsEntity = getByText('getting-started-with-idp');
    expect(docsCardContent).toContainElement(docsEntity);
  });
});
