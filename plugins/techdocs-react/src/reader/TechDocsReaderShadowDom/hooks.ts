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
import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { useMkDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';

/**
 * Hook for use within TechDocs addons that provides access to the underlying
 * shadow root of the current page, allowing the DOM within to be mutated.
 * @deprecated Use `@backstage/plugin-techdocs-mkdocs-react#useMkDocsReaderPage` instead to get the `shadowRoot`.
 */
export const useShadowRoot = () => {
  const { shadowRoot } = useMkDocsReaderPage();
  return shadowRoot;
};

/**
 * Convenience hook for use within TechDocs addons that provides access to
 * elements that match a given selector within the shadow root.
 * @deprecated use `useTechDocsShadowRootElements` instead.
 * @public
 */
export const useShadowRootElements = <
  TReturnedElement extends HTMLElement = HTMLElement,
>(
  selectors: string[],
): TReturnedElement[] => {
  const shadowRoot = useShadowRoot();
  if (!shadowRoot) return [];
  return selectors
    .map(selector => shadowRoot?.querySelectorAll<TReturnedElement>(selector))
    .filter(nodeList => nodeList.length)
    .map(nodeList => Array.from(nodeList))
    .flat();
};

/**
 * Convenience hook for use within TechDocs addons that provides access to
 * elements that match a given selector within the shadow root.
 * @public
 */
export const useTechDocsShadowRootElements = <
  TReturnedElement extends HTMLElement = HTMLElement,
>(
  selectors: string[],
  shadowRoot?: ShadowRoot,
): TReturnedElement[] => {
  if (!shadowRoot) return [];
  return selectors
    .map(selector => shadowRoot?.querySelectorAll<TReturnedElement>(selector))
    .filter(nodeList => nodeList.length)
    .map(nodeList => Array.from(nodeList))
    .flat();
};

const isValidSelection = (newSelection: Selection) => {
  // Safari sets the selection rect to top zero
  return (
    newSelection.toString() &&
    newSelection.rangeCount &&
    newSelection.getRangeAt(0).getBoundingClientRect().top
  );
};

/**
 * Hook for retrieving a selection within the ShadowRoot.
 * @deprecated Use `useTechDocsShadowRootSelection` instead.
 * @public
 */
export const useShadowRootSelection = (wait: number = 0) => {
  const shadowRoot = useShadowRoot();
  const [selection, setSelection] = useState<Selection | null>(null);
  const handleSelectionChange = useMemo(
    () =>
      debounce(() => {
        const shadowDocument = shadowRoot as ShadowRoot &
          Pick<Document, 'getSelection'>;
        // Firefox and Safari don't implement getSelection for Shadow DOM
        const newSelection = shadowDocument.getSelection
          ? shadowDocument.getSelection()
          : document.getSelection();

        if (newSelection && isValidSelection(newSelection)) {
          setSelection(newSelection);
        } else {
          setSelection(null);
        }
      }, wait),
    [shadowRoot, setSelection, wait],
  );

  useEffect(() => {
    window.document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      window.document.removeEventListener(
        'selectionchange',
        handleSelectionChange,
      );
  }, [handleSelectionChange]);

  return selection;
};

/**
 * Hook for retrieving a selection within the ShadowRoot.
 * @public
 */
export const useTechDocsShadowRootSelection = (
  wait: number = 0,
  shadowRoot?: ShadowRoot,
) => {
  const [selection, setSelection] = useState<Selection | null>(null);
  const handleSelectionChange = useMemo(
    () =>
      debounce(() => {
        const shadowDocument = shadowRoot as ShadowRoot &
          Pick<Document, 'getSelection'>;
        // Firefox and Safari don't implement getSelection for Shadow DOM
        const newSelection = shadowDocument.getSelection
          ? shadowDocument.getSelection()
          : document.getSelection();

        if (newSelection && isValidSelection(newSelection)) {
          setSelection(newSelection);
        } else {
          setSelection(null);
        }
      }, wait),
    [shadowRoot, setSelection, wait],
  );

  useEffect(() => {
    window.document.addEventListener('selectionchange', handleSelectionChange);
    return () =>
      window.document.removeEventListener(
        'selectionchange',
        handleSelectionChange,
      );
  }, [handleSelectionChange]);

  return selection;
};
