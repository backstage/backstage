/*
 * Copyright 2022 The Backstage Authors
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

import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@material-ui/styles';

import { Progress } from '@backstage/core-components';

/**
 * Name for the event dispatched when ShadowRoot styles are loaded.
 * @public
 */
export const SHADOW_DOM_STYLE_LOAD_EVENT = 'TECH_DOCS_SHADOW_DOM_STYLE_LOAD';

/**
 * Dispatch style load event after all styles are loaded.
 * @param element - the ShadowRoot tree.
 */
const useShadowDomStylesEvents = (element: Element | null) => {
  useEffect(() => {
    if (!element) {
      return () => {};
    }

    const styles = element.querySelectorAll<HTMLElement>(
      'head > link[rel="stylesheet"]',
    );

    let count = styles?.length ?? 0;
    const event = new CustomEvent(SHADOW_DOM_STYLE_LOAD_EVENT);

    if (!count) {
      element.dispatchEvent(event);
      return () => {};
    }

    const handleLoad = () => {
      if (--count === 0) {
        element.dispatchEvent(event);
      }
    };

    styles?.forEach(style => {
      style.addEventListener('load', handleLoad);
    });

    return () => {
      styles?.forEach(style => {
        style.removeEventListener('load', handleLoad);
      });
    };
  }, [element]);
};

/**
 * Returns the style's loading state.
 *
 * @example
 * Here's an example that updates the sidebar position only after styles are calculated:
 * ```jsx
 * import {
 *   TechDocsShadowDom,
 *   useShadowDomStylesLoading,
 * } from '@backstage/plugin-techdocs-react';
 *
 * export const TechDocsReaderPageContent = () => {
 *   // ...
 *   const dom = useTechDocsReaderDom(entity);
 *   const isStyleLoading = useShadowDomStylesLoading(dom);
 *
 *   const updateSidebarPosition = useCallback(() => {
 *     //...
 *   }, [dom]);
 *
 *   useEffect(() => {
 *     if (!isStyleLoading) {
 *       updateSidebarPosition();
 *     }
 *   }, [isStyleLoading, updateSidebarPosition]);
 *
 *   const handleDomAppend = useCallback(
 *     (newShadowRoot: ShadowRoot) => {
 *       setShadowRoot(newShadowRoot);
 *     },
 *     [setShadowRoot],
 *   );
 *
 *   return <TechDocsShadowDom element={dom} onAppend={handleDomAppend} />;
 * };
 * ```
 *
 * @param element - which is the ShadowRoot tree.
 * @returns a boolean value, true if styles are being loaded.
 * @public
 */
export const useShadowDomStylesLoading = (element: Element | null) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!element) return () => {};

    setLoading(true);

    const style = (element as HTMLElement).style;

    style.setProperty('opacity', '0');

    const handleLoad = () => {
      setLoading(false);
      style.setProperty('opacity', '1');
    };

    element.addEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, handleLoad);

    return () => {
      element.removeEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, handleLoad);
    };
  }, [element]);

  return loading;
};

/**
 * Props for {@link TechDocsShadowDom}.
 *
 * @remarks
 * If you want to use portals to render Material UI components in the Shadow DOM,
 * you must render these portals as children because this component wraps its children in a Material UI StylesProvider
 * to ensure that Material UI styles are applied.
 *
 * @public
 */
export type TechDocsShadowDomProps = PropsWithChildren<{
  /**
   * Element tree that is appended to ShadowRoot.
   */
  element: Element;
  /**
   * Callback called when the element tree is appended in ShadowRoot.
   */
  onAppend?: (shadowRoot: ShadowRoot) => void;
}>;

/**
 * Renders a tree of elements in a Shadow DOM.
 *
 * @remarks
 * Centers the styles loaded event to avoid having multiple locations setting the opacity style in Shadow DOM causing the screen to flash multiple times,
 * so if you want to know when Shadow DOM styles are computed, you can listen for the "TECH_DOCS_SHADOW_DOM_STYLE_LOAD" event dispatched by the element tree.
 *
 * @example
 * Here is an example using this component and also listening for styles loaded event:
 *```jsx
 * import {
 *   TechDocsShadowDom,
 *   SHADOW_DOM_STYLE_LOAD_EVENT,
 * } from '@backstage/plugin-techdocs-react';
 *
 * export const TechDocsReaderPageContent = ({ entity }: TechDocsReaderPageContentProps) => {
 *   // ...
 *   const dom = useTechDocsReaderDom(entity);
 *
 *   useEffect(() => {
 *     const updateSidebarPosition = () => {
 *       // ...
 *     };
 *     dom?.addEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, updateSidebarPosition);
 *     return () => {
 *       dom?.removeEventListener(SHADOW_DOM_STYLE_LOAD_EVENT, updateSidebarPosition);
 *     };
 *   }, [dom]);
 *
 *   const handleDomAppend = useCallback(
 *     (newShadowRoot: ShadowRoot) => {
 *       setShadowRoot(newShadowRoot);
 *     },
 *     [setShadowRoot],
 *   );
 *
 *   return <TechDocsShadowDom element={dom} onAppend={handleDomAppend} />;
 * };
 * ```
 *
 * @param props - see {@link TechDocsShadowDomProps}.
 * @public
 */
export const TechDocsShadowDom = ({
  element,
  onAppend,
  children,
}: TechDocsShadowDomProps) => {
  const [jss, setJss] = useState(
    create({
      ...jssPreset(),
      insertionPoint: undefined,
    }),
  );

  useShadowDomStylesEvents(element);
  const loading = useShadowDomStylesLoading(element);

  const ref = useCallback(
    (shadowHost: HTMLDivElement | null) => {
      if (!element || !shadowHost) return;

      setJss(
        create({
          ...jssPreset(),
          insertionPoint: element.querySelector('head') || undefined,
        }),
      );

      let shadowRoot = shadowHost?.shadowRoot;

      if (!shadowRoot) {
        shadowRoot = shadowHost?.attachShadow({ mode: 'open' });
      }

      shadowRoot?.replaceChildren(element);

      if (typeof onAppend === 'function') {
        onAppend(shadowRoot);
      }
    },
    [element, onAppend],
  );

  return (
    <>
      {loading && <Progress />}
      {/* The sheetsManager={new Map()} is needed in order to deduplicate the injection of CSS in the page. */}
      <StylesProvider jss={jss} sheetsManager={new Map()}>
        <div ref={ref} data-testid="techdocs-native-shadowroot" />
        {children}
      </StylesProvider>
    </>
  );
};
