/*
 * Copyright 2024 The Backstage Authors
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
import { SignInPageBlueprint } from './SignInPageBlueprint';
import { createExtensionTester } from '@backstage/frontend-test-utils';
import { waitFor } from '@testing-library/react';

describe('SignInPageBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    expect(
      SignInPageBlueprint.make({
        params: { loader: async () => () => <div /> },
      }),
    ).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "attachTo": {
          "id": "app/root",
          "input": "signInPage",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "sign-in-page",
        "name": undefined,
        "namespace": undefined,
        "output": [
          [Function],
        ],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should return the component as the componentRef', async () => {
    const MockSignInPage = () => <div data-testid="mock-sign-in" />;

    const extension = SignInPageBlueprint.make({
      params: { loader: async () => () => <MockSignInPage /> },
    });

    const tester = createExtensionTester(extension);
    expect(tester.data(SignInPageBlueprint.dataRefs.component)).toBeDefined();

    const { getByTestId } = tester.render();

    // todo(blam): need a better way to test this, currently fails.
    await waitFor(() => {
      expect(getByTestId('mock-sign-in')).toBeInTheDocument();
    });
  });
});
