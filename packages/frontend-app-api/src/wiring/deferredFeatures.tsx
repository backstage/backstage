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
  createExternalRouteRef,
  createFrontendPlugin,
  createRouteRef,
  ExtensionBoundary,
  ExternalRouteRef,
  FrontendPlugin,
  PageBlueprint,
  Progress,
  RouteRef,
} from '@backstage/frontend-plugin-api';
import { useEffect, useState } from 'react';
import { FrontendFeatureManifest } from '../manifest/types';

/**
 * A plugin that is only loaded once one of its pages is rendered.
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
 * Adds a loaded plugin to the app, and returns the page elements that
 * replace the stub pages, keyed by extension ID.
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
  readonly #pageElements = new Map<string, JSX.Element>();
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

  getPageElement(extensionId: string): JSX.Element | undefined {
    return this.#pageElements.get(extensionId);
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
          this.#pageElements.set(extensionId, element);
        }
        this.#setState(pluginId, { status: 'loaded' });
      })
      .catch(error => {
        this.#setState(pluginId, {
          status: 'failed',
          error: toError(error, `Failed to load the '${pluginId}' plugin`),
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

function toError(error: unknown, message: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(`${message}; caused by ${String(error)}`);
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

function DeferredPluginPage(props: {
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
    // Shown by the error boundary of the stub page.
    throw state.error;
  }
  if (state.status !== 'loaded') {
    return <Progress />;
  }

  const element = controller.getPageElement(extensionId);
  if (!element) {
    throw new Error(
      `The '${pluginId}' plugin was loaded, but it doesn't provide the '${extensionId}' page from its manifest`,
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

function getPageExtensionName(
  extensionId: string,
  pluginId: string,
): { valid: boolean; name?: string } {
  const prefix = `page:${pluginId}`;
  if (extensionId === prefix) {
    return { valid: true };
  }
  if (extensionId.startsWith(`${prefix}/`)) {
    return { valid: true, name: extensionId.slice(prefix.length + 1) };
  }
  return { valid: false };
}

/**
 * Builds a stand-in for a deferred plugin from its manifest.
 *
 * @remarks
 *
 * The stand-in has the same plugin ID, title and route names as the real
 * plugin, and one page for each page in the manifest. Rendering one of the
 * pages loads the real plugin.
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
  const extensions = manifest.extensions.flatMap(extension => {
    const page = extension.page;
    const { valid, name } = getPageExtensionName(extension.id, pluginId);
    if (!page || !valid || Array.isArray(extension.attachTo)) {
      skippedExtensionIds.push(extension.id);
      return [];
    }

    const routeRef = page.routeRefName ? routes[page.routeRefName] : undefined;
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
              <DeferredPluginPage
                controller={controller}
                pluginId={pluginId}
                extensionId={extension.id}
              />
            </ExtensionBoundary>,
          );
        },
      }),
    ];
  });

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
