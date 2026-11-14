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

import {
  ApiBlueprint,
  ApiRef,
  createApiFactory,
  createApiRef,
  TypesToApiRefs,
  useApi,
  useApiHolder,
} from '@backstage/frontend-plugin-api';
import {
  ApiRef as CoreApiRef,
  createApiRef as createCoreApiRef,
} from '@backstage/core-plugin-api';
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

  it('should accept refs from previous declarations and core-plugin-api', () => {
    // Keep the previous declaration independent of the current compatibility alias.
    type PreviousApiRef<T, TId extends string = string> = {
      readonly $$type?: '@backstage/ApiRef';
      readonly id: TId;
      readonly T: T;
    };

    const coreRef = createCoreApiRef<MyApi>({ id: 'compat-api' });
    const previousRef: PreviousApiRef<MyApi> = coreRef;
    const currentRef = createApiRef<MyApi>().with({ id: 'compat-api' });
    const syncFromPrevious: ApiRef<MyApi, string, 'sync'> = previousRef;
    const coreFromCurrent: CoreApiRef<MyApi> = currentRef;
    const previousFromCurrent: PreviousApiRef<MyApi> = currentRef;
    const defaultFromPrevious: ApiRef<MyApi> = previousRef;
    expect(syncFromPrevious).toBe(coreRef);
    expect(coreFromCurrent).toBe(currentRef);
    expect(previousFromCurrent).toBe(currentRef);
    expect(defaultFromPrevious).toBe(coreRef);
    // @ts-expect-error Compatibility must retain the API implementation type.
    const wrongApi: ApiRef<number, string, 'sync'> = previousRef;
    expect(wrongApi).toBe(coreRef);

    const refs: TypesToApiRefs<{ getMessage: MyApi }, 'sync'> = {
      getMessage: previousRef,
    };
    const factory = createApiFactory({
      api: previousRef,
      deps: { message: coreRef },
      factory: ({ message }) => message,
    });
    expect(
      ApiBlueprint.make({
        params: defineParams => defineParams(factory),
      }),
    ).toBeDefined();

    function Consumer({ getMessage }: { getMessage: MyApi }) {
      const holder = useApiHolder();
      const previousApi: MyApi | undefined = holder.get(previousRef);
      const coreApi: MyApi | undefined = holder.get(coreRef);
      const currentApi: MyApi | undefined = holder.get(currentRef);
      const hookApi: MyApi = useApi(previousRef);
      return (
        <p>
          {[
            getMessage(),
            previousApi?.(),
            coreApi?.(),
            currentApi?.(),
            hookApi(),
          ].join(', ')}
        </p>
      );
    }
    const CompatibleComponent = withApis(refs)(Consumer);
    render(
      <TestApiProvider
        apis={[[factory.api, factory.factory({ message: () => 'compatible' })]]}
      >
        <CompatibleComponent />
      </TestApiProvider>,
    );
    expect(
      screen.getByText(
        'compatible, compatible, compatible, compatible, compatible',
      ),
    ).toBeInTheDocument();
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
