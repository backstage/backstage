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
  AnyApiFactory,
  ApiBlueprint,
  coreExtensionData,
  createApiRef,
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
import { ExtensionParameters } from '../tree/readAppExtensionsConfig';
import { ErrorCollector } from './createErrorCollector';

export type { DeferredFrontendFeature };

/**
 * Returns the ID of a plugin, including plugins from older versions.
 *
 * @internal
 */
export function getPluginId(plugin: FrontendPlugin): string {
  return plugin.pluginId ?? OpaqueFrontendPlugin.toInternal(plugin).id;
}

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
 * elements of the stub pages and extensions, keyed by extension ID, along
 * with the factories of the APIs of the plugin, keyed by API ref ID.
 *
 * @internal
 */
export type DeferredPluginGrafter = (
  entry: DeferredFrontendFeature,
  loadedFeature: unknown,
) => {
  elements: Map<string, JSX.Element>;
  apiFactories: Map<string, AnyApiFactory>;
};

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
  readonly #apiFactories = new Map<string, AnyApiFactory>();
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

  /**
   * Loads the plugin, and creates one of its APIs with the factory of the
   * loaded plugin and the dependencies that were resolved for the stub.
   */
  async createApi(options: {
    pluginId: string;
    apiRefId: string;
    deps: { [name: string]: string };
    resolvedDeps: { [name: string]: unknown };
  }): Promise<unknown> {
    const { pluginId, apiRefId } = options;
    await this.load(pluginId);
    const state = this.getState(pluginId);
    if (state.status === 'failed') {
      throw state.error;
    }
    const factory = this.#apiFactories.get(apiRefId);
    if (!factory) {
      throw new Error(
        `The '${pluginId}' plugin was loaded, but it doesn't provide the '${apiRefId}' API from its manifest`,
      );
    }
    const deps = Object.entries(factory.deps).map(
      ([name, ref]) => `${name}:${ref.id}`,
    );
    const expectedDeps = Object.entries(options.deps).map(
      ([name, id]) => `${name}:${id}`,
    );
    if (deps.sort().join(',') !== expectedDeps.sort().join(',')) {
      throw new Error(
        `The '${apiRefId}' API of the '${pluginId}' plugin depends on [${deps.join(
          ', ',
        )}], but its manifest lists [${expectedDeps.join(
          ', ',
        )}], so the manifest is likely out of date`,
      );
    }
    return factory.factory(options.resolvedDeps);
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
        const { elements, apiFactories } = this.#graft(entry, loaded?.default);
        for (const [extensionId, element] of elements) {
          this.#elements.set(extensionId, element);
        }
        for (const [apiRefId, factory] of apiFactories) {
          this.#apiFactories.set(apiRefId, factory);
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
 * A config schema for a single key that accepts any value, since the config
 * of a stub is validated by the real extension once the plugin has loaded.
 */
const anyConfigValueSchema = {
  '~standard': {
    version: 1 as const,
    vendor: 'backstage',
    validate: (value: unknown) => ({ value }),
    jsonSchema: {
      input: () => ({}),
      output: () => ({}),
    },
  },
};

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

  // Config can replace the value of an output, or add one that the source
  // code doesn't set.
  const configOutputs = Object.entries(element.configOutputs ?? {});
  for (const [, { dataRefId }] of configOutputs) {
    if (!dataRefs.some(ref => ref.id === dataRefId)) {
      dataRefs.push(createExtensionDataRef<unknown>().with({ id: dataRefId }));
    }
  }

  const output: ExtensionDataRef[] = [
    coreExtensionData.reactElement,
    ...dataRefs.map(ref => ref.optional()),
    ...(routeRef ? [coreExtensionData.routeRef] : []),
  ];

  const configSchema = Object.fromEntries(
    configOutputs.map(([key]) => [key, anyConfigValueSchema]),
  );

  return createExtension({
    kind: options.kind,
    name: options.name,
    attachTo,
    disabled: extension.disabled,
    output,
    configSchema,
    *factory({ node, config }) {
      yield coreExtensionData.reactElement(
        <ExtensionBoundary node={node}>
          {options.createElement()}
        </ExtensionBoundary>,
      );
      const values = new Map(Object.entries(element.data));
      for (const [key, { dataRefId }] of configOutputs) {
        const value = (config as { [key: string]: unknown })[key];
        if (value !== undefined) {
          values.set(dataRefId, value);
        }
      }
      for (const ref of dataRefs) {
        if (values.get(ref.id) !== undefined) {
          yield ref(values.get(ref.id));
        }
      }
      if (routeRef) {
        yield coreExtensionData.routeRef(routeRef);
      }
    },
  });
}

/**
 * Creates a stub for an API, which loads the plugin when the API is first
 * used and then creates the API with the factory of the plugin.
 */
function createStubApiExtension(options: {
  extension: FrontendFeatureManifest['extensions'][number];
  name?: string;
  pluginId: string;
  controller: DeferredFeatureController;
}) {
  const { extension, pluginId, controller } = options;
  const api = extension.api!;
  const deps = Object.fromEntries(
    Object.entries(api.deps).map(([name, id]) => [
      name,
      createApiRef<unknown>().with({ id }),
    ]),
  );
  return ApiBlueprint.make({
    name: options.name,
    disabled: extension.disabled,
    params: defineParams =>
      defineParams({
        api: createApiRef<unknown>().with({
          id: api.apiRefId,
          loading: 'async',
        }),
        deps,
        factory: resolvedDeps =>
          controller.createApi({
            pluginId,
            apiRefId: api.apiRefId,
            deps: api.deps,
            resolvedDeps,
          }),
      }),
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
 * Rendering one of the pages or elements loads the real plugin.
 *
 * @internal
 */
export function createDeferredPluginStub(
  entry: DeferredFrontendFeature,
  controller: DeferredFeatureController,
): { plugin: FrontendPlugin; skippedExtensionIds: string[] } {
  const { manifest } = entry;
  const pluginId = manifest.pluginId;

  const routes: Record<string, RouteRef> = Object.fromEntries(
    manifest.routes.map(name => [name, createRouteRef()]),
  );
  const externalRoutes: Record<string, ExternalRouteRef> = Object.fromEntries(
    manifest.externalRoutes.map(name => [name, createExternalRouteRef()]),
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
      const parsedId = parseExtensionId(extension.id, pluginId);
      if (!parsedId || Array.isArray(extension.attachTo)) {
        skippedExtensionIds.push(extension.id);
        return [];
      }
      const { kind, name } = parsedId;

      if (extension.api) {
        return [
          createStubApiExtension({ extension, name, pluginId, controller }),
        ];
      }

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
    title: manifest.title,
    icon: <DeferredPluginIcon />,
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
    // A plugin that is installed as a regular feature is used as it is.
    if (eagerPlugins.has(manifest.pluginId)) {
      return false;
    }
    const configuredExtensionId = findDeferredConfigConflict(
      manifest,
      options.extensionParameters,
    );
    if (configuredExtensionId) {
      // The stub of an element can't apply this config, so the plugin is
      // loaded right after the app has started, which applies the config as
      // soon as possible.
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
    );
    const stub = options.attachPluginInfo(plugin) as FrontendPlugin;
    stubs.set(entry.manifest.pluginId, stub);

    for (const extensionId of skippedExtensionIds) {
      options.collector.report({
        code: 'EXTENSION_IGNORED',
        message: `The '${extensionId}' extension of the deferred '${entry.manifest.pluginId}' plugin was ignored, because only pages, elements and APIs that are attached to a single parent and have an ID of the form '<kind>:${entry.manifest.pluginId}' or '<kind>:${entry.manifest.pluginId}/<name>' can be deferred`,
        context: { plugin, extensionId },
      });
    }
  }

  return { controller, stubs, preloadPluginIds };
}
