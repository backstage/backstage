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
  appHistoryApiRef,
  coreExtensionData,
  createApiFactory,
  createExtension,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import {
  prepareSpecializedApp,
  type CreateSpecializedAppInternalOptions,
} from './prepareSpecializedApp';

function makeAppPlugin() {
  return createFrontendPlugin({
    pluginId: 'app',
    extensions: [
      createExtension({
        attachTo: { id: 'root', input: 'app' },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div>Test</div>)],
      }),
    ],
  });
}

describe('prepareSpecializedApp', () => {
  describe('dispose', () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      window.history.replaceState(null, '', '/');
      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    function popstateListeners(spy: jest.SpyInstance) {
      return spy.mock.calls
        .filter(([type]) => type === 'popstate')
        .map(([, listener]) => listener);
    }

    it('should release the popstate listener owned by the app history', () => {
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
        __internal: {
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();
      const appHistory = app.apis.get(appHistoryApiRef)!;

      // Teardown is handed over during preparation, before finalization
      expect(dispose).toBeDefined();

      const attached = popstateListeners(addEventListenerSpy);
      expect(attached).toHaveLength(1);

      const pathnames = new Array<string>();
      const subscription = appHistory.location$.subscribe(location =>
        pathnames.push(location.pathname),
      );

      window.history.pushState(null, '', '/before-dispose');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(pathnames).toEqual(['/', '/before-dispose']);

      dispose!();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'popstate',
        attached[0],
      );

      window.history.pushState(null, '', '/after-dispose');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(pathnames).toEqual(['/', '/before-dispose']);

      // Disposing again is a no-op rather than an error, and never re-attaches
      expect(() => dispose!()).not.toThrow();
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(1);

      subscription.unsubscribe();
    });

    it('should leave an overridden app history API untouched', () => {
      const appHistory = createMockAppHistory();
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
        __internal: {
          apiFactoryOverrides: [createApiFactory(appHistoryApiRef, appHistory)],
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      // No window-backed app history is constructed, so nothing is listening
      expect(app.apis.get(appHistoryApiRef)).toBe(appHistory);
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(0);

      dispose!();

      expect(popstateListeners(removeEventListenerSpy)).toHaveLength(0);
    });
  });
});
