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
import {
  useMetadata,
  createMetadataRef,
  MetadataRef,
  MetadataHolder,
} from '@backstage/core-plugin-api';
import { MetadataProvider } from './MetadataProvider';
import { MetadataRegistry } from './MetadataRegistry';
import { render } from '@testing-library/react';
import { withLogCollector } from '@backstage/test-utils';
import { useVersionedContext } from '@backstage/version-bridge';

describe('MetadataProvider', () => {
  type Metadata = () => string;
  const metadataRef = createMetadataRef<Metadata>({ id: 'x' });

  const MyHookConsumer = () => {
    const payload = useMetadata(metadataRef);
    return <p>hook message: {payload}</p>;
  };

  it('should provide apis', () => {
    const renderedHook = render(
      <MetadataProvider
        metadata={MetadataRegistry.from([[metadataRef, 'hello']])}
      >
        <MyHookConsumer />
      </MetadataProvider>,
    );
    renderedHook.getByText('hook message: hello');
  });

  it('should provide nested access to apis', () => {
    const aRef = createMetadataRef<string>({ id: 'a' });
    const bRef = createMetadataRef<string>({ id: 'b' });

    const MyComponent = () => {
      const a = useMetadata(aRef);
      const b = useMetadata(bRef);
      return (
        <div>
          a={a} b={b}
        </div>
      );
    };

    const renderedHook = render(
      <MetadataProvider
        metadata={MetadataRegistry.from([
          [aRef, 'x'],
          [bRef, 'y'],
        ])}
      >
        <MetadataProvider metadata={MetadataRegistry.from([[aRef, 'z']])}>
          <MyComponent />
        </MetadataProvider>
      </MetadataProvider>,
    );
    renderedHook.getByText('a=z b=y');
  });

  it('should error if metadata is not available', () => {
    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <MetadataProvider metadata={MetadataRegistry.from([])}>
              <MyHookConsumer />
            </MetadataProvider>,
          );
        }).toThrow('No implementation available for metadataRef{x}');
      }).error,
    ).toEqual([
      expect.stringMatching(
        /^Error: Uncaught \[Error: No implementation available for metadataRef{x}\]/,
      ),
      expect.stringMatching(
        /^The above error occurred in the <MyHookConsumer> component/,
      ),
    ]);
  });
});

describe('v1 consumer', () => {
  function useMockApiV1<T>(apiRef: MetadataRef<T>): T {
    const impl = useVersionedContext<{ 1: MetadataHolder }>('metadata-context')
      ?.atVersion(1)
      ?.get(apiRef);
    if (!impl) {
      throw new Error('no impl');
    }
    return impl;
  }

  type Api = () => string;
  const apiRef = createMetadataRef<Api>({ id: 'x' });
  const registry = MetadataRegistry.from([[apiRef, () => 'hello']]);

  const MyHookConsumerV1 = () => {
    const api = useMockApiV1(apiRef);
    return <p>hook message: {api()}</p>;
  };

  it('should provide apis', () => {
    const renderedHook = render(
      <MetadataProvider metadata={registry}>
        <MyHookConsumerV1 />
      </MetadataProvider>,
    );
    renderedHook.getByText('hook message: hello');
  });
});
