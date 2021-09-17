/*
 * Copyright 2021 The Backstage Authors
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
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { InfoCard } from '@backstage/core-components';
import { Grid } from '@material-ui/core';

function MyCard() {
  return <div style={{ background: 'blue' }}>Hello I am a card</div>;
}

type LayoutSize = {
  width: number;
  height: number;
};

function useResizeObserver(onResize: (size: LayoutSize) => void) {
  const [observer] = useState(
    () =>
      new ResizeObserver(entries => {
        const [entry] = entries;

        if (entry) {
          const { width, height } = entry.contentRect;
          onResize({ width, height });
        }
      }),
  );

  const elementRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }

      if (element) {
        observer.observe(element);
      }

      elementRef.current = element;
    },
    [observer],
  );

  return [setRef];
}

function LayoutContract({ children }: { children: ReactNode }) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [setResizeRef] = useResizeObserver(setSize);

  return (
    <div
      style={{
        background: 'red',
        width: '100%',
        height: '100%',
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'stretch',
      }}
      ref={setResizeRef}
    >
      <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
        I am {size.width} x {size.height}
      </div>
      {children}
    </div>
  );
}

type Component = (props: { children: ReactNode }) => JSX.Element | null;

const CardLayoutContext = createContext<Component | undefined>(undefined);

function InfoCardLayout({ children }: { children: ReactNode }) {
  return (
    <CardLayoutContext.Provider
      value={props => <InfoCard variant="gridItem" children={props.children} />}
    >
      {children}
    </CardLayoutContext.Provider>
  );
}

function createCardExtension<T extends {}>(
  Component: (props: T) => JSX.Element | null,
): (props: T) => JSX.Element {
  return props => {
    const CardComponent = useContext(CardLayoutContext);
    if (!CardComponent) {
      throw new Error('No CardComponent');
    }
    return (
      <CardComponent>
        <LayoutContract>
          <Component {...props} />
        </LayoutContract>
      </CardComponent>
    );
  };
}

const MyCardExtension = createCardExtension(MyCard);

export function Experiment6() {
  return (
    <div>
      <h1>Experiment 6</h1>
      <InfoCardLayout>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MyCardExtension />
          </Grid>
          <Grid item xs={6}>
            <div style={{ background: 'green', height: 200 }} />
          </Grid>
        </Grid>
      </InfoCardLayout>
    </div>
  );
}
