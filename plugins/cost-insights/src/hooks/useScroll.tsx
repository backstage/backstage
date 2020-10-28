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
  SetStateAction,
  useState,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';
import { CSSProperties } from '@material-ui/styles';
import { Maybe } from '../types';

export type ScrollTo = Maybe<string>;

export type ScrollContextProps = {
  scrollTo: ScrollTo;
  setScrollTo: Dispatch<SetStateAction<ScrollTo>>;
};

export type ScrollUtils = {
  ScrollAnchor: (props: Omit<ScrollAnchorProps, 'id'>) => JSX.Element;
  scrollIntoView: () => void;
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
  top,
  left,
  behavior,
  block,
  inline,
}: ScrollAnchorProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const context = useContext(ScrollContext);

  if (!context) {
    assertNever();
  }

  const { scrollTo, setScrollTo } = context;

  const styles: CSSProperties = {
    position: 'absolute',
    height: 0,
    width: 0,
    top: top || 0,
    left: left || 0,
  };

  useEffect(() => {
    function scrollIntoView() {
      const options = {
        behavior: behavior || 'auto',
        block: block || 'start',
        inline: inline || 'nearest',
      };

      if (divRef.current && scrollTo === id) {
        divRef.current.scrollIntoView(options);
        setScrollTo(null);
      }
    }

    scrollIntoView();
  }, [scrollTo, setScrollTo, id, behavior, block, inline]);

  return <div ref={divRef} style={styles} data-testid={`scroll-test-${id}`} />;
};

export const ScrollProvider = ({ children }: PropsWithChildren<{}>) => {
  const [scrollTo, setScrollTo] = useState<ScrollTo>(null);

  return (
    <ScrollContext.Provider value={{ scrollTo, setScrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
};

export function useScroll(id: ScrollTo): ScrollUtils {
  const context = useContext(ScrollContext);

  if (!context) {
    assertNever();
  }

  return {
    ScrollAnchor: props => <ScrollAnchor id={id} {...props} />,
    scrollIntoView: () => context.setScrollTo(id),
  };
}

function assertNever(): never {
  throw new Error(
    `Cannot use useScroll or ScrollAnchor outside ScrollProvider`,
  );
}
