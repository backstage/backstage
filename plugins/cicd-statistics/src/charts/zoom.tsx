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

import { throttle } from 'lodash';
import React, {
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  Fragment,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { ReferenceArea } from 'recharts';

import type { Epoch } from './types';

interface ZoomState {
  left?: number;
  right?: number;
}

interface ZoomContext {
  registerSelection(setter: Dispatch<ZoomState>): void;
  setSelectState: Dispatch<SetStateAction<ZoomState>>;

  zoomState: ZoomState;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;

  resetZoom: () => void;
}

const context = React.createContext<ZoomContext>(undefined as any);

export function ZoomProvider({ children }: PropsWithChildren<{}>) {
  const [registeredSelectors, setRegisteredSelectors] = useState<
    Array<Dispatch<ZoomState>>
  >([]);
  const [selectState, setSelectState] = useState<ZoomState>({});
  const [zoomState, setZoomState] = useState<ZoomState>({});

  const registerSelection = useCallback(
    (selector: Dispatch<ZoomState>) => {
      setRegisteredSelectors(old => [...old, selector]);

      return () => {
        setRegisteredSelectors(old => old.filter(sel => sel === selector));
      };
    },
    [setRegisteredSelectors],
  );

  const callSelectors = useCallback(
    (state: ZoomState) => {
      registeredSelectors.forEach(selector => {
        selector(state);
      });
    },
    [registeredSelectors],
  );

  const throttledCallSelectors = useMemo(
    () => throttle(callSelectors, 200),
    [callSelectors],
  );

  useEffect(() => {
    throttledCallSelectors({
      left: selectState.left,
      right: selectState.right,
    });
  }, [selectState.left, selectState.right, throttledCallSelectors]);

  const resetZoom = useCallback(() => {
    setSelectState({});
    setZoomState({});
  }, [setSelectState, setZoomState]);

  const value = useMemo(
    (): ZoomContext => ({
      registerSelection,
      setSelectState,

      zoomState,
      setZoomState,

      resetZoom,
    }),
    [registerSelection, setSelectState, zoomState, setZoomState, resetZoom],
  );

  return <context.Provider value={value} children={children} />;
}

export function useZoom() {
  const { zoomState, resetZoom } = useContext(context);

  const zoomFilterValues = useCallback(
    <T extends Epoch>(values: Array<T>): Array<T> => {
      const { left, right } = zoomState;
      return left === undefined || right === undefined
        ? values
        : values.filter(({ __epoch }) => __epoch > left && __epoch < right);
    },
    [zoomState],
  );

  return useMemo(
    () => ({
      resetZoom,
      zoomState,
      zoomFilterValues,
    }),
    [resetZoom, zoomState, zoomFilterValues],
  );
}

export interface ZoomAreaProps {
  yAxisId?: number | string | undefined;
}

export function useZoomArea() {
  const [showSelection, setShowSelection] = useState(false);
  const [state, setState] = useState<ZoomState>({});
  const { setSelectState, setZoomState, registerSelection } =
    useContext(context);

  const onMouseDown = useCallback(
    (e: any) => {
      if (!e?.activeLabel) return;

      setSelectState({ left: e.activeLabel });
      setShowSelection(true);
    },
    [setSelectState, setShowSelection],
  );

  const onMouseMove = useCallback(
    (e: any) => {
      if (!e?.activeLabel) return;

      setSelectState(area => {
        if (!area.left) {
          return area;
        }
        return { ...area, right: e.activeLabel };
      });
    },
    [setSelectState],
  );

  const doZoom = useCallback(() => {
    setSelectState(old => {
      const { left, right } = old;

      if (left === undefined || right === undefined || left === right) {
        // Either is undefined or both are same - zoom out
        setZoomState({});
      } else if (left < right) {
        setZoomState({ left, right });
      } else if (left > right) {
        setZoomState({ left: right, right: left });
      }

      return {};
    });
    setShowSelection(false);
  }, [setSelectState, setZoomState, setShowSelection]);

  const zoomProps = useMemo(
    () => ({
      onMouseDown,
      onMouseMove,
      onMouseUp: doZoom,
    }),
    [onMouseDown, onMouseMove, doZoom],
  );

  useEffect(() => {
    if (!showSelection) {
      return undefined;
    }
    return registerSelection(setState);
  }, [registerSelection, setState, showSelection]);

  const getZoomArea = useCallback(
    (props?: ZoomAreaProps) => (
      <Fragment key="zoom-area">
        {showSelection && state.left && state.right ? (
          <ReferenceArea
            x1={state.left}
            x2={state.right}
            strokeOpacity={0.5}
            {...props}
          />
        ) : null}
      </Fragment>
    ),
    [showSelection, state.left, state.right],
  );

  return {
    zoomProps,
    getZoomArea,
  };
}
