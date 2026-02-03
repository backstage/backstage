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

import { screen, waitFor } from '@testing-library/react';
import { MockErrorApi, withLogCollector } from '@backstage/test-utils';
import { errorApiRef } from '../apis';
import {
  createExtensionTester,
  renderInTestApp,
} from '@backstage/frontend-test-utils';
import { AppRootElementBlueprint } from './AppRootElementBlueprint';
import { ForwardedError } from '@backstage/errors';

describe('AppRootElementBlueprint', () => {
  it('should create an extension with sensible defaults', () => {
    const extension = AppRootElementBlueprint.make({
      params: {
        element: <div />,
      },
    });
    expect(extension).toMatchInlineSnapshot(`
      {
        "$$type": "@backstage/ExtensionDefinition",
        "T": undefined,
        "attachTo": {
          "id": "app/root",
          "input": "elements",
        },
        "configSchema": undefined,
        "disabled": false,
        "factory": [Function],
        "inputs": {},
        "kind": "app-root-element",
        "name": undefined,
        "output": [
          [Function],
        ],
        "override": [Function],
        "toString": [Function],
        "version": "v2",
      }
    `);
  });

  it('should post error to errorApi and not render children when error occurs', async () => {
    const errorApi = new MockErrorApi({ collect: true });
    const errorMessage = 'Test error message';
    const ErrorComponent = () => {
      throw new Error(errorMessage);
    };

    await withLogCollector(['error'], async () => {
      const extension = AppRootElementBlueprint.make({
        params: {
          element: <ErrorComponent />,
        },
      });

      const tester = createExtensionTester(extension);
      renderInTestApp(tester.reactElement(), {
        apis: [[errorApiRef, errorApi]],
      });

      await waitFor(() => {
        const errors = errorApi.getErrors();
        expect(errors.length).toBeGreaterThan(0);
        const postedError = errors[0].error;
        expect(postedError).toBeInstanceOf(ForwardedError);
        expect(postedError.message).toBe(
          "Error in extension 'app-root-element:test'; caused by Error: Test error message",
        );
      });

      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });

  it('should render children when there is no error', async () => {
    const successMessage = 'Success!';
    const SuccessComponent = () => <div>{successMessage}</div>;

    const extension = AppRootElementBlueprint.make({
      params: {
        element: <SuccessComponent />,
      },
    });

    const tester = createExtensionTester(extension);
    renderInTestApp(tester.reactElement());

    await waitFor(() => {
      expect(screen.getByText(successMessage)).toBeInTheDocument();
    });
  });
});
