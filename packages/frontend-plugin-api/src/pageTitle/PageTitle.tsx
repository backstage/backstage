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

import { useEffect, useRef } from 'react';
import { useVersionedContext } from '@backstage/version-bridge';
import type { AppNode } from '../apis/definitions/AppTreeApi';
import { useAppNode } from '../components/AppNodeProvider';
import { coreExtensionData } from '../wiring/coreExtensionData';

interface Registration {
  update(title: string): void;
  unregister(): void;
}

interface PageTitleContextValue {
  register(entry: {
    node: AppNode;
    title: string;
    kind: 'default' | 'custom';
  }): Registration;
}

// This key must match the one used by the page title registry in @backstage/plugin-app.
const CONTEXT_KEY = 'page-title-context';

type ContextMap = { 1: PageTitleContextValue };

/**
 * Finds the closest node, starting at the given one, that has a route path.
 * Only those nodes own a segment of the document title.
 */
function findRoutableNode(node?: AppNode): AppNode | undefined {
  for (let current = node; current; current = current.edges.attachedTo?.node) {
    if (current.instance?.getData(coreExtensionData.routePath) !== undefined) {
      return current;
    }
  }
  return undefined;
}

/**
 * Registers a title for a node for as long as the calling component is
 * mounted.
 *
 * @internal
 */
export function useNodeTitle(
  node: AppNode | undefined,
  title: string | undefined,
  kind: 'default' | 'custom',
) {
  const ctx = useVersionedContext<ContextMap>(CONTEXT_KEY);
  const register = ctx?.atVersion(1)?.register;
  const registrationRef = useRef<Registration | null>(null);
  const hasTitle = Boolean(title);

  useEffect(() => {
    if (!register || !node || !hasTitle) {
      return undefined;
    }
    const registration = register({ node, title: title!, kind });
    registrationRef.current = registration;
    return () => {
      registration.unregister();
      registrationRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, node, kind, hasTitle]);

  useEffect(() => {
    if (title) {
      registrationRef.current?.update(title);
    }
  }, [title]);
}

/**
 * Sets the document title segment of the page or sub-page that the calling
 * component is rendered within, for as long as the component is mounted.
 *
 * @remarks
 *
 * Each page and sub-page contributes one segment to the document title, which
 * by default is its title. This hook replaces that segment, for example with
 * the name of the item that the page is showing. When called from within an
 * extension that does not have a route path of its own, such as a card, it
 * applies to the closest enclosing page, or to the closest extension if there
 * is no enclosing page.
 *
 * Passing an empty or undefined title keeps the default segment, which is
 * useful while the title is still loading. How the segments are turned into
 * the final document title is decided by the app, see
 * {@link DocumentTitleApi}.
 *
 * @example
 * ```tsx
 * function ItemPage() {
 *   const item = useItem();
 *   usePageTitle(item?.name);
 *   // ...
 * }
 * ```
 *
 * @public
 */
export function usePageTitle(title: string | undefined): void {
  const node = useAppNode();
  // Without a routable node above, the title applies to the closest node
  useNodeTitle(findRoutableNode(node) ?? node, title, 'custom');
}
