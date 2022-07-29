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
  Dispatch,
  SetStateAction,
  useState,
  createContext,
  useContext,
} from 'react';
import { MkDocsReaderContent } from '../MkDocsReaderContent';

/**
 * Type for MkDocs reader page context.
 * @public
 */
export type MkDocsReaderPageValue = {
  /** Mkdocs reader page Shadow Root */
  shadowRoot?: ShadowRoot;
  setShadowRoot: Dispatch<SetStateAction<ShadowRoot | undefined>>;
};

/**
 * A context for the MkDocs reader page.
 * @internal
 */
const MkDocsReaderPageContext = createContext<MkDocsReaderPageValue>({
  setShadowRoot: () => {},
});

/**
 * Returns the MkDocs reader page context.
 * @returns context - The MkDocs reader page context.
 * @public
 */
export const useMkDocsReaderPage = () => useContext(MkDocsReaderPageContext);

/**
 * Props for {@link MkDocsReaderPage}.
 * @public
 */
export type MkDocsReaderPageProps = {
  children: (content: JSX.Element) => JSX.Element;
};

/**
 * Renders TechDocs content using mkdocs.
 * @param props - See {@link MkDocsReaderPageProps}.
 * @public
 */
export const MkDocsReaderPage = ({ children }: MkDocsReaderPageProps) => {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>();

  const value = { shadowRoot, setShadowRoot };

  return (
    <MkDocsReaderPageContext.Provider value={value}>
      {children(<MkDocsReaderContent />)}
    </MkDocsReaderPageContext.Provider>
  );
};
