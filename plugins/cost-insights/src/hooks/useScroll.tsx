/*
 * Copyright 2020 Spotify AB
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
  ElementType,
  SetStateAction,
  useState,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';
import { Maybe } from '../types';

export type ScrollTo = Maybe<string>;

export type ScrollContextProps = {
  scroll: ScrollTo;
  setScroll: Dispatch<SetStateAction<ScrollTo>>;
  ScrollAnchor: ElementType<ScrollAnchorProps>;
};

export interface ScrollAnchorProps extends ScrollIntoViewOptions {
  id: ScrollTo;
  top?: number;
  left?: number;
}

export const ScrollContext = React.createContext<
  ScrollContextProps | undefined
>(undefined);

export const ScrollAnchor = ({
  id,
  block,
  inline,
  left = 0,
  top = -20,
  behavior = 'smooth',
}: ScrollAnchorProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useScroll();

  useEffect(() => {
    function scrollIntoView() {
      const options = {
        behavior: behavior || 'auto',
        block: block || 'start',
        inline: inline || 'nearest',
      };

      if (divRef.current && scroll === id) {
        divRef.current.scrollIntoView(options);
        setScroll(null);
      }
    }

    scrollIntoView();
  }, [scroll, setScroll, id, behavior, block, inline]);

  return (
    <div
      ref={divRef}
      style={{ position: 'absolute', height: 0, width: 0, top, left }}
      data-testid={`scroll-test-${id}`}
    />
  );
};

export const ScrollProvider = ({ children }: PropsWithChildren<{}>) => {
  const [scroll, setScroll] = useState<ScrollTo>(null);

  return (
    <ScrollContext.Provider value={{ scroll, setScroll, ScrollAnchor }}>
      {children}
    </ScrollContext.Provider>
  );
};

export enum ScrollType {
  AlertSummary = 'alert-status-summary',
}

export function useScroll() {
  const context = useContext(ScrollContext);

  if (!context) {
    assertNever();
  }

  return [context.scroll, context.setScroll, context.ScrollAnchor] as const;
}

function assertNever(): never {
  throw new Error(
    `Cannot use useScroll or ScrollAnchor outside ScrollProvider`,
  );
}
