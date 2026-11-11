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
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
  createExternalRouteRef,
  createFrontendPlugin,
  createRouteRef,
  ExtensionBoundary,
  ExtensionDataRef,
  ExtensionDefinition,
  ExternalRouteRef,
  FrontendPlugin,
  PageBlueprint,
  Progress,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import {
  FilterPredicate,
  filterPredicateToFilterFunction,
} from '@backstage/filter-predicates';
import { ForwardedError } from '@backstage/errors';
import { useEffect, useState } from 'react';
import { FrontendFeatureManifest } from '../manifest/types';

/**
 * A plugin that is only loaded once one of its pages or elements is
 * rendered.
 *
 * @internal
 */
export type DeferredFrontendFeature = {
  /** The package name of the plugin. */
  name: string;
  /** The build-time description of the plugin. */
  manifest: FrontendFeatureManifest;
  /** Loads the plugin, which must be the default export. */
  load: () => Promise<{ default: unknown }>;
};

/** @internal */
export type DeferredPluginState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded' }
  | { status: 'failed'; error: Error };

const IDLE_STATE: DeferredPluginState = { status: 'idle' };

/**
 * Adds a loaded plugin to the app, and returns the elements that replace the
 * elements of the stub pages and extensions, keyed by extension ID.
 *
 * @internal
 */
export type DeferredPluginGrafter = (
  entry: DeferredFrontendFeature,
  loadedFeature: unknown,
) => Map<string, JSX.Element>;

/**
 * Loads deferred plugins on request, one at a time and at most once each, and
 * tells subscribers when the state of a plugin changes.
 *
 * @internal
 */
export class DeferredFeatureController {
  readonly #entries = new Map<string, DeferredFrontendFeature>();
  readonly #states = new Map<string, DeferredPluginState>();
  readonly #loads = new Map<string, Promise<void>>();
  readonly #elements = new Map<string, JSX.Element>();
  readonly #listeners = new Set<() => void>();
  readonly #graft: DeferredPluginGrafter;
  #queue: Promise<void> = Promise.resolve();

  constructor(options: {
    entries: DeferredFrontendFeature[];
    graft: DeferredPluginGrafter;
  }) {
    for (const entry of options.entries) {
      this.#entries.set(entry.manifest.pluginId, entry);
    }
    this.#graft = options.graft;
  }

  getState(pluginId: string): DeferredPluginState {
    return this.#states.get(pluginId) ?? IDLE_STATE;
  }

  getElement(extensionId: string): JSX.Element | undefined {
    return this.#elements.get(extensionId);
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  /**
   * Loads the plugin and adds it to the app. The returned promise always
   * resolves; a failure is stored in the plugin state instead.
   *
   * A failed load is not retried, since a plugin that was partly added to the
   * app can't be removed again. The error asks the user to reload the page.
   */
  load(pluginId: string): Promise<void> {
    const existing = this.#loads.get(pluginId);
    if (existing) {
      return existing;
    }

    const entry = this.#entries.get(pluginId);
    if (!entry) {
      this.#setState(pluginId, {
        status: 'failed',
        error: new Error(`No deferred plugin with ID '${pluginId}' exists`),
      });
      return Promise.resolve();
    }

    this.#setState(pluginId, { status: 'loading' });
    const load = this.#queue
      .then(async () => {
        const loaded = await entry.load();
        const elements = this.#graft(entry, loaded?.default);
        for (const [extensionId, element] of elements) {
          this.#elements.set(extensionId, element);
        }
        this.#setState(pluginId, { status: 'loaded' });
      })
      .catch(error => {
        this.#setState(pluginId, {
          status: 'failed',
          error: new ForwardedError(
            `Failed to load the deferred '${pluginId}' plugin, reload the page to try again`,
            error,
          ),
        });
      });

    this.#queue = load;
    this.#loads.set(pluginId, load);
    return load;
  }

  #setState(pluginId: string, state: DeferredPluginState) {
    this.#states.set(pluginId, state);
    for (const listener of this.#listeners) {
      listener();
    }
  }
}

function useDeferredPluginState(
  controller: DeferredFeatureController,
  pluginId: string,
): DeferredPluginState {
  const [state, setState] = useState(() => controller.getState(pluginId));

  useEffect(() => {
    const update = () => setState(controller.getState(pluginId));
    const unsubscribe = controller.subscribe(update);
    // Pick up any change that happened between render and subscribing.
    update();
    return unsubscribe;
  }, [controller, pluginId]);

  return state;
}

function DeferredPluginElement(props: {
  controller: DeferredFeatureController;
  pluginId: string;
  extensionId: string;
}) {
  const { controller, pluginId, extensionId } = props;
  const state = useDeferredPluginState(controller, pluginId);

  useEffect(() => {
    controller.load(pluginId);
  }, [controller, pluginId]);

  if (state.status === 'failed') {
    // Shown by the error boundary of the stub extension.
    throw state.error;
  }
  if (state.status !== 'loaded') {
    return <Progress />;
  }

  const element = controller.getElement(extensionId);
  if (!element) {
    throw new Error(
      `The '${pluginId}' plugin was loaded, but it doesn't provide the '${extensionId}' extension from its manifest`,
    );
  }
  return element;
}

function DeferredPluginIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </svg>
  );
}

/**
 * Splits an ID of the form `<kind>:<pluginId>` or `<kind>:<pluginId>/<name>`,
 * which is the form the stub extensions are created with.
 */
function parseExtensionId(
  extensionId: string,
  pluginId: string,
): { kind: string; name?: string } | undefined {
  const index = extensionId.indexOf(':');
  if (index <= 0) {
    return undefined;
  }
  const kind = extensionId.slice(0, index);
  const rest = extensionId.slice(index + 1);
  if (rest === pluginId) {
    return { kind };
  }
  if (rest.startsWith(`${pluginId}/`) && rest.length > pluginId.length + 1) {
    return { kind, name: rest.slice(pluginId.length + 1) };
  }
  return undefined;
}

/**
 * Creates a stub for an extension that renders an element outside of
 * app/routes. It outputs the data recorded in the manifest, and an element
 * that loads the real plugin.
 */
function createStubElementExtension(options: {
  extension: FrontendFeatureManifest['extensions'][number];
  kind: string;
  name?: string;
  routes: Record<string, RouteRef>;
  createElement(): JSX.Element;
}) {
  const { extension, routes } = options;
  const element = extension.element!;
  const attachTo = extension.attachTo as { id: string; input: string };

  const dataRefs = Object.keys(element.data).map(id =>
    createExtensionDataRef<unknown>().with({ id }),
  );
  // Functions that were created from filter predicates are recreated from the
  // predicates, which are part of the data.
  const predicateFunctions = Object.entries(
    element.predicateFunctions ?? {},
  ).map(([functionDataRefId, predicateDataRefId]) => {
    const predicate = element.data[predicateDataRefId];
    if (predicate === undefined) {
      throw new Error(
        `The '${extension.id}' extension outputs '${functionDataRefId}' from the '${predicateDataRefId}' data, which is missing from the manifest`,
      );
    }
    return {
      ref: createExtensionDataRef<unknown>().with({ id: functionDataRefId }),
      value: filterPredicateToFilterFunction(predicate as FilterPredicate),
    };
  });
  const routeRef = element.routeRefName
    ? routes[element.routeRefName]
    : undefined;
  if (element.routeRefName && !routeRef) {
    throw new Error(
      `The '${extension.id}' extension outputs the '${element.routeRefName}' route, which is not one of the plugin routes in the manifest`,
    );
  }

  const output: ExtensionDataRef[] = [
    coreExtensionData.reactElement,
    ...dataRefs,
    ...predicateFunctions.map(({ ref }) => ref),
    ...(routeRef ? [coreExtensionData.routeRef] : []),
  ];

  return createExtension({
    kind: options.kind,
    name: options.name,
    attachTo,
    disabled: extension.disabled,
    output,
    *factory({ node }) {
      yield coreExtensionData.reactElement(
        <ExtensionBoundary node={node}>
          {options.createElement()}
        </ExtensionBoundary>,
      );
      for (const ref of dataRefs) {
        yield ref(element.data[ref.id]);
      }
      for (const { ref, value } of predicateFunctions) {
        yield ref(value);
      }
      if (routeRef) {
        yield coreExtensionData.routeRef(routeRef);
      }
    },
  });
}

function getSyncExtensionDefinition(
  syncPart: FrontendPlugin,
  extensionId: string,
): ExtensionDefinition | undefined {
  try {
    return (
      syncPart as { getExtension?(id: string): ExtensionDefinition }
    ).getExtension?.(extensionId);
  } catch {
    return undefined;
  }
}

/**
 * Builds a stand-in for a deferred plugin from its manifest.
 *
 * @remarks
 *
 * The stand-in has the same plugin ID, title and route names as the real
 * plugin, one page for each page in the manifest, and one extension for each
 * element in the manifest that outputs the data recorded at build time.
 * Rendering one of the pages or elements loads the real plugin. APIs are left
 * out, and are added to the app when the real plugin is loaded. Extensions
 * and route refs of the sync part of the plugin, if any, are installed as
 * they are.
 *
 * @internal
 */
export function createDeferredPluginStub(
  entry: DeferredFrontendFeature,
  controller: DeferredFeatureController,
  syncPart?: FrontendPlugin,
): { plugin: FrontendPlugin; skippedExtensionIds: string[] } {
  const { manifest } = entry;
  const pluginId = manifest.pluginId;

  // Route refs of the sync part are the same as in the real plugin, so they
  // are used as they are, while the others are stand-ins.
  const syncRoutes = (syncPart?.routes ?? {}) as Record<string, RouteRef>;
  const syncExternalRoutes = (syncPart?.externalRoutes ?? {}) as Record<
    string,
    ExternalRouteRef
  >;
  const routes: Record<string, RouteRef> = Object.fromEntries(
    manifest.routes.map(name => [name, syncRoutes[name] ?? createRouteRef()]),
  );
  const externalRoutes: Record<string, ExternalRouteRef> = Object.fromEntries(
    manifest.externalRoutes.map(name => [
      name,
      syncExternalRoutes[name] ?? createExternalRouteRef(),
    ]),
  );

  const skippedExtensionIds = new Array<string>();
  const createElement = (extensionId: string) => (
    <DeferredPluginElement
      controller={controller}
      pluginId={pluginId}
      extensionId={extensionId}
    />
  );

  const extensions = manifest.extensions.flatMap(
    (extension): ExtensionDefinition[] => {
      // Extensions of the sync part are installed as they are.
      if (extension.sync) {
        const definition = syncPart
          ? getSyncExtensionDefinition(syncPart, extension.id)
          : undefined;
        if (!definition) {
          throw new Error(
            `The '${extension.id}' extension of the deferred '${entry.name}' package is listed as part of its sync export, but the sync export doesn't provide it`,
          );
        }
        return [definition];
      }
      // APIs are added to the app when the real plugin is loaded.
      if (extension.kind === 'api') {
        return [];
      }
      const parsedId = parseExtensionId(extension.id, pluginId);
      if (!parsedId || Array.isArray(extension.attachTo)) {
        skippedExtensionIds.push(extension.id);
        return [];
      }
      const { kind, name } = parsedId;

      if (extension.element && kind !== 'page') {
        return [
          createStubElementExtension({
            extension,
            kind,
            name,
            routes,
            createElement: () => createElement(extension.id),
          }),
        ];
      }

      const page = extension.page;
      if (!page || kind !== 'page') {
        skippedExtensionIds.push(extension.id);
        return [];
      }

      const routeRef = page.routeRefName
        ? routes[page.routeRefName]
        : undefined;
      return [
        PageBlueprint.makeWithOverrides({
          name,
          attachTo: extension.attachTo,
          disabled: extension.disabled,
          *factory(originalFactory, { node }) {
            // The original factory resolves the path, title and route ref
            // outputs, but the page content is replaced by the loader.
            for (const value of originalFactory({
              path: page.path,
              title: page.title,
              routeRef,
            })) {
              if (value.id !== coreExtensionData.reactElement.id) {
                yield value;
              }
            }
            yield coreExtensionData.reactElement(
              <ExtensionBoundary node={node}>
                {createElement(extension.id)}
              </ExtensionBoundary>,
            );
          },
        }),
      ];
    },
  );

  const plugin = createFrontendPlugin({
    pluginId,
    title: syncPart?.title ?? manifest.title,
    icon: syncPart?.icon ?? <DeferredPluginIcon />,
    routes,
    externalRoutes,
    extensions,
  });

  return { plugin, skippedExtensionIds };
}
