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

import { createApiRef } from '@backstage/frontend-plugin-api';
import {
  TestApiProvider,
  withLogCollector,
} from '@backstage/frontend-test-utils';
import { render, screen } from '@testing-library/react';
import { withApis } from './withApis';

describe('withApis', () => {
  type MyApi = () => string;
  const myApiRef = createApiRef<MyApi>({ id: 'my-api' });

  const MyComponent = withApis({ getMessage: myApiRef })(({ getMessage }) => {
    return <p>message: {getMessage()}</p>;
  });

  it('should inject APIs as props and set display name', () => {
    render(
      <TestApiProvider apis={[[myApiRef, () => 'hello']]}>
        <MyComponent />
      </TestApiProvider>,
    );

    expect(screen.getByText('message: hello')).toBeInTheDocument();
    expect(MyComponent.displayName).toBe('withApis(Component)');
  });

  it('should ignore properties from the prototype', () => {
    const otherRef = createApiRef<number>({ id: 'other' });
    const proto = { other: otherRef };
    const props = { getMessage: { enumerable: true, value: myApiRef } };
    const obj = Object.create(proto, props) as {
      getMessage: typeof myApiRef;
      other: typeof otherRef;
    };

    const WeirdComponent = withApis(obj)(({ getMessage }) => {
      return <p>message: {getMessage()}</p>;
    });

    render(
      <TestApiProvider apis={[[myApiRef, () => 'hello']]}>
        <WeirdComponent />
      </TestApiProvider>,
    );

    expect(screen.getByText('message: hello')).toBeInTheDocument();
  });

  it('should throw NotImplementedError if the API is not available', () => {
    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <TestApiProvider apis={[]}>
              <MyComponent />
            </TestApiProvider>,
          );
        }).toThrow('No implementation available for apiRef{my-api}');
      }).error,
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'No implementation available for apiRef{my-api}',
        ),
      ]),
    );
  });
});
