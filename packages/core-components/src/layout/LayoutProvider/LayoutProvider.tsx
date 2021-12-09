/*
 * Copyright 2020 The Backstage Authors
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
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';

export type LayoutContextType = {
  content: {
    contentRef?: React.MutableRefObject<HTMLDivElement | null>;
  };
};

const LayoutContext = createContext<LayoutContextType>({
  content: {
    contentRef: undefined,
  },
});

export function LayoutProvider(props: PropsWithChildren<{}>) {
  const contentRef = useRef(null);

  const content = {
    contentRef,
  };

  return (
    <LayoutContext.Provider value={{ content }}>
      {props.children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContent() {
  const { content } = useContext(LayoutContext);

  const focusContent = useCallback(() => {
    content.contentRef?.current?.focus();
  }, [content]);

  return { focusContent, contentRef: content.contentRef };
}
