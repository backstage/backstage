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
import { useTechDocsReaderPage } from './context';

/**
 * Hook for use within TechDocs addons that provides access to the underlying
 * shadow root of the current page, allowing the DOM within to be mutated.
 * @public
 */
export const useShadowRoot = () => {
  const { shadowRoot } = useTechDocsReaderPage();
  return shadowRoot;
};

/**
 * Convenience hook for use within TechDocs addons that provides access to
 * elements that match a given selector within the shadow root.
 *
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
