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
  appHistoryApiRef,
  coreExtensionData,
  createApiFactory,
  createExtension,
  createFrontendPlugin,
  featureFlagsApiRef,
  type ApiHolder,
  type ApiRef,
  type AppHistoryApi,
} from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import {
  createSessionStateFromApis,
  prepareSpecializedApp,
  type CreateSpecializedAppInternalOptions,
} from './prepareSpecializedApp';

function makeAppPlugin(extraExtensions: Array<any> = []) {
  return createFrontendPlugin({
    pluginId: 'app',
    extensions: [
      createExtension({
        attachTo: { id: 'root', input: 'app' },
        output: [coreExtensionData.reactElement],
        factory: () => [coreExtensionData.reactElement(<div>Test</div>)],
      }),
      ...extraExtensions,
    ],
  });
}

/**
 * The documented way for an app owner to supply their own history — a hash or
 * memory router, or one owned by a host app that Backstage is embedded in.
 */
/**
 * A holder of the shape a caller hands to a reused session — the `advanced.apis`
 * option of the deprecated `createSpecializedApp`, or the API holder of an app
 * that has already been prepared once.
 */
function makeSessionApis(apis: { appHistory?: AppHistoryApi }): ApiHolder {
  return {
    get<T>(ref: ApiRef<T>): T | undefined {
      if (apis.appHistory && ref.id === appHistoryApiRef.id) {
        return apis.appHistory as T;
      }
      return undefined;
    },
  };
}

function makeAppHistoryApi(appHistory: AppHistoryApi) {
  return ApiBlueprint.make({
    name: 'app-history',
    params: defineParams =>
      defineParams({
        api: appHistoryApiRef,
        deps: {},
        factory: () => appHistory,
      }),
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

    it('should let an ApiBlueprint-supplied app history replace the default', () => {
      const appHistory = createMockAppHistory();
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin([makeAppHistoryApi(appHistory)])],
        __internal: {
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      // The app's own factory is the one that wins, rather than being shadowed
      // by the framework default that is otherwise registered ahead of it.
      expect(app.apis.get(appHistoryApiRef)).toBe(appHistory);
      // And the default is never constructed, so there is no second history
      // listening for `popstate` behind the supplied one.
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(0);

      dispose!();

      expect(popstateListeners(removeEventListenerSpy)).toHaveLength(0);
    });

    it('should still let a static factory override an ApiBlueprint-supplied app history', () => {
      const appHistory = createMockAppHistory();
      const overrideHistory = createMockAppHistory();
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin([makeAppHistoryApi(appHistory)])],
        __internal: {
          apiFactoryOverrides: [
            createApiFactory(appHistoryApiRef, overrideHistory),
          ],
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      // Test harnesses supply the history they are going to assert against, so
      // they keep outranking whatever the app under test provides.
      expect(app.apis.get(appHistoryApiRef)).toBe(overrideHistory);
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(0);
    });

    it('should fail loudly when a predicate-gated extension supplies the app history', () => {
      const appHistory = createMockAppHistory();
      const featureFlagsApi = {
        isActive: (name: string) => name === 'test-flag',
        registerFlag: () => {},
        getRegisteredFlags: () => [],
        save: async () => {},
      } as unknown as typeof featureFlagsApiRef.T;
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [
          makeAppPlugin(),
          createFrontendPlugin({
            pluginId: 'test',
            featureFlags: [{ name: 'test-flag' }],
            extensions: [
              // An `if` anywhere in an API extension's subtree defers the whole
              // root to finalization, which is long after the app history has
              // been decided — so this factory is invisible at the moment the
              // framework asks whether it needs to build a default.
              makeAppHistoryApi(appHistory).override({
                if: { featureFlags: { $contains: 'test-flag' } },
              }),
              ApiBlueprint.make({
                name: 'feature-flags',
                params: defineParams =>
                  defineParams({
                    api: featureFlagsApiRef,
                    deps: {},
                    factory: () => featureFlagsApi,
                  }),
              }),
            ],
          }),
        ],
        __internal: {
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      // The predicate evaluates true, so the extension is genuinely part of the
      // app — and it still loses, because the default was already registered in
      // the primary registry. Supporting this would need the gated API resolved
      // before predicate context exists, so the default declines to be the
      // answer instead of quietly becoming it.
      expect(() => app.apis.get(appHistoryApiRef)).toThrow(
        /'core\.app-history' API is supplied by an extension that is gated behind an 'if' predicate/,
      );

      dispose!();
    });

    it('should let an app history from a reused session replace the default', () => {
      const appHistory = createMockAppHistory();
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
        advanced: {
          // The shape `createSpecializedApp({ advanced: { apis } })` builds for
          // a caller that hands the app a holder of its own.
          sessionState: createSessionStateFromApis(
            makeSessionApis({ appHistory }),
          ),
        },
        __internal: {
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      // A reused session's holder is consulted before the default is built, so
      // the history the caller supplied is the one the app navigates through.
      expect(app.apis.get(appHistoryApiRef)).toBe(appHistory);
      // And no second, window-backed history was constructed behind it — which
      // would otherwise outrank it and leave a `popstate` listener attached for
      // the lifetime of the page.
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(0);

      dispose!();

      expect(popstateListeners(removeEventListenerSpy)).toHaveLength(0);
    });

    it('should create the default app history when a reused session has none', () => {
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
        advanced: {
          sessionState: createSessionStateFromApis(makeSessionApis({})),
        },
        __internal: {
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      // Nothing has asked for a history yet, so the holder has not been asked
      // either — that question is what defers construction of the default.
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(0);

      // A holder without a history still gets one, rather than the app being
      // left unable to navigate.
      expect(app.apis.get(appHistoryApiRef)).toBeDefined();
      const attached = popstateListeners(addEventListenerSpy);
      expect(attached).toHaveLength(1);

      dispose!();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'popstate',
        attached[0],
      );
    });

    it('should not leave a listener attached when the default is built after teardown', () => {
      let dispose: (() => void) | undefined;
      const preparedApp = prepareSpecializedApp({
        features: [makeAppPlugin()],
        advanced: {
          sessionState: createSessionStateFromApis(makeSessionApis({})),
        },
        __internal: {
          onDispose: teardown => {
            dispose = teardown;
          },
        },
      } as CreateSpecializedAppInternalOptions);
      const app = preparedApp.finalize();

      dispose!();

      // Deferring construction means the app can still reach for a history
      // after teardown. It gets one, but a dead one: the listener that backs it
      // is released immediately, because nothing holds a handle to it anymore.
      expect(app.apis.get(appHistoryApiRef)).toBeDefined();
      expect(popstateListeners(addEventListenerSpy)).toHaveLength(1);
      expect(popstateListeners(removeEventListenerSpy)).toHaveLength(1);
    });
  });
});
