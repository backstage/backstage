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
  FrontendFeature,
  FrontendPlugin,
  PageBlueprint,
  Progress,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import { ForwardedError } from '@backstage/errors';
import { useEffect, useState } from 'react';
import {
  DeferredFrontendFeature,
  FrontendFeatureManifest,
  OpaqueFrontendPlugin,
} from '@internal/frontend';
import { findDeferredConfigConflict } from '../manifest/deferredConfig';
import {
  getExtensionDefinition,
  getPluginExtensionIds,
  getPluginId,
} from '../manifest/syncPart';
import { ExtensionParameters } from '../tree/readAppExtensionsConfig';
import { ErrorCollector } from './createErrorCollector';

export type { DeferredFrontendFeature };

/** @internal */
export type DeferredPluginState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded' }
  | { status: 'failed'; error: Error };

const IDLE_STATE: DeferredPluginState = { status: 'idle' };

const DEFAULT_RETRY_DELAYS_MS = [250, 1000];

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
  readonly #retryDelaysMs: number[];
  #queue: Promise<void> = Promise.resolve();

  constructor(options: {
    entries: DeferredFrontendFeature[];
    graft: DeferredPluginGrafter;
    /**
     * The delays before each retry of loading the code of a plugin. Defaults
     * to two retries, after 250 and 1000 milliseconds.
     */
    retryDelaysMs?: number[];
  }) {
    for (const entry of options.entries) {
      this.#entries.set(entry.manifest.pluginId, entry);
    }
    this.#graft = options.graft;
    this.#retryDelaysMs = options.retryDelaysMs ?? DEFAULT_RETRY_DELAYS_MS;
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
   * Loading the code of the plugin is retried a few times, since it can fail
   * because of a network error. Once the code has loaded, a failure to add
   * the plugin to the app is final, since a plugin that was partly added to
   * the app can't be removed again. The error asks the user to reload the
   * page.
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
        const loaded = await this.#loadWithRetries(entry);
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

  async #loadWithRetries(
    entry: DeferredFrontendFeature,
  ): Promise<{ default: unknown }> {
    for (const delayMs of this.#retryDelaysMs) {
      try {
        return await entry.load();
      } catch {
        // Only the error of the last attempt is reported
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    return entry.load();
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

// The nav only lists pages of plugins that have an icon, and the icon of the
// real plugin isn't known until it is loaded.
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
  attachTo: { id: string; input: string };
  routes: Record<string, RouteRef>;
  createElement(): JSX.Element;
}) {
  const { extension, attachTo, routes } = options;
  const element = extension.element!;

  const dataRefs = Object.keys(element.data).map(id =>
    createExtensionDataRef<unknown>().with({ id }),
  );
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
      if (routeRef) {
        yield coreExtensionData.routeRef(routeRef);
      }
    },
  });
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
          ? getExtensionDefinition(syncPart, extension.id)
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
            attachTo: extension.attachTo,
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

/**
 * Builds stubs for the deferred plugins that aren't also installed as regular
 * features, along with the controller that loads them.
 *
 * @internal
 */
export function createDeferredPlugins(options: {
  entries: DeferredFrontendFeature[];
  eagerFeatures: FrontendFeature[];
  extensionParameters: ExtensionParameters[];
  attachPluginInfo(feature: FrontendFeature): FrontendFeature;
  collector: ErrorCollector;
  graft: DeferredPluginGrafter;
}) {
  const eagerPlugins = new Map<string, FrontendPlugin>();
  for (const feature of options.eagerFeatures) {
    if (OpaqueFrontendPlugin.isType(feature)) {
      eagerPlugins.set(getPluginId(feature), feature);
    }
  }
  // The sync parts of deferred plugins, which are merged into their stubs
  const syncParts = new Map<string, FrontendPlugin>();

  const preloadPluginIds = new Array<string>();

  const entries = options.entries.filter(entry => {
    const { manifest } = entry;
    if (manifest.type !== 'plugin' || !manifest.deferrable) {
      throw new Error(
        `The '${entry.name}' package can't be deferred, ${
          manifest.notDeferrableReason ?? 'its manifest is not deferrable'
        }`,
      );
    }
    const eagerPlugin = eagerPlugins.get(manifest.pluginId);
    const syncExtensionIds = manifest.extensions
      .filter(extension => extension.sync)
      .map(extension => extension.id);
    if (syncExtensionIds.length > 0) {
      // The sync part is installed as a regular feature by discovery, and is
      // told apart from the full plugin by having exactly the sync extensions.
      if (!eagerPlugin) {
        throw new Error(
          `The deferred '${entry.name}' package has a sync export, but the '${manifest.pluginId}' plugin from it isn't installed in the app`,
        );
      }
      const eagerIds = getPluginExtensionIds(eagerPlugin);
      const isSyncPart =
        eagerIds.length === syncExtensionIds.length &&
        eagerIds.every(id => syncExtensionIds.includes(id));
      if (!isSyncPart) {
        return false;
      }
      syncParts.set(manifest.pluginId, eagerPlugin);
    } else if (eagerPlugin) {
      return false;
    }
    const configuredExtensionId = findDeferredConfigConflict(
      manifest,
      options.extensionParameters,
    );
    if (configuredExtensionId) {
      // The stub of an element can't apply config, so the plugin is loaded
      // right after the app has started, which applies the config as soon as
      // possible.
      preloadPluginIds.push(manifest.pluginId);
    }
    return true;
  });

  const controller = new DeferredFeatureController({
    entries,
    graft: options.graft,
  });

  const stubs = new Map<string, FrontendPlugin>();
  for (const entry of entries) {
    const { plugin, skippedExtensionIds } = createDeferredPluginStub(
      entry,
      controller,
      syncParts.get(entry.manifest.pluginId),
    );
    const stub = options.attachPluginInfo(plugin) as FrontendPlugin;
    stubs.set(entry.manifest.pluginId, stub);

    for (const extensionId of skippedExtensionIds) {
      options.collector.report({
        code: 'EXTENSION_IGNORED',
        message: `The '${extensionId}' extension of the deferred '${entry.manifest.pluginId}' plugin was ignored, because only pages, APIs and elements that are attached to a single parent and have an ID of the form '<kind>:${entry.manifest.pluginId}' or '<kind>:${entry.manifest.pluginId}/<name>' can be deferred`,
        context: { plugin, extensionId },
      });
    }
  }

  return { controller, stubs, syncParts, preloadPluginIds };
}
