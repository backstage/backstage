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

import React, { createContext, useContext, PropsWithChildren } from 'react';

/**
 * The value of the TechDocs shadow context
 * @public
 */
export type TechDocsShadowDomValue = { dom: HTMLElement };

/**
 * Stores the DOM attached to the host element
 * @public
 */
const TechDocsShadowDomContext = createContext<TechDocsShadowDomValue>({
  dom: document.createElement('html'),
});

/**
 * Returns the DOM attached to the host element
 * @public
 */
export const useTechDocsShadowDom = () => {
  const { dom } = useContext(TechDocsShadowDomContext);
  return dom;
};

/**
 * Provides access TechDocs shadow DOM context.
 * @param dom - A DOM element
 * @public
 */
export const TechDocsShadowDomProvider = ({
  dom,
  children,
}: PropsWithChildren<TechDocsShadowDomValue>) => (
  <TechDocsShadowDomContext.Provider value={{ dom }}>
    {children}
  </TechDocsShadowDomContext.Provider>
);
