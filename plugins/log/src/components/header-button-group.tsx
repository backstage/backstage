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
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Button, ButtonGroup } from '@material-ui/core';

export interface HeaderButtonGroupItem<K extends string> {
  title: string | JSX.Element;
  key: K;
}

export interface InitialButtonGroupState<K extends string> {
  buttons: HeaderButtonGroupItem<K>[];
  defaultSelected?: K[];
}

interface ContextState {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export function createButtonGroup<K extends string>(
  init: InitialButtonGroupState<K>,
) {
  const context = createContext<ContextState>(undefined as any);

  function Provider({ children }: PropsWithChildren<{}>) {
    const [selected, setSelected] = useState(
      (init.defaultSelected as string[]) ?? [],
    );

    const state: ContextState = useMemo(
      () => ({ selected, setSelected }),
      [selected, setSelected],
    );

    return <context.Provider value={state}>{children}</context.Provider>;
  }

  function Component() {
    const state = useContext(context);

    const onClickOf = useMemo(
      () =>
        Object.fromEntries(
          init.buttons.map(({ key }) => [
            key,
            () => {
              state.setSelected(prev =>
                prev.includes(key)
                  ? prev.filter(e => e !== key)
                  : [...prev, key],
              );
            },
          ]),
        ),
      [state],
    );

    return (
      <ButtonGroup variant="outlined" color="primary" size="small">
        {init.buttons.map(btn =>
          state.selected?.includes(btn.key) ? (
            <Button
              key={btn.key}
              onClick={onClickOf[btn.key]}
              color="primary"
              variant="contained"
              size="small"
            >
              {btn.title}
            </Button>
          ) : (
            <Button
              key={btn.key}
              onClick={onClickOf[btn.key]}
              color="default"
              variant="contained"
              size="small"
            >
              {btn.title}
            </Button>
          ),
        )}
      </ButtonGroup>
    );
  }

  function useSelection() {
    const state = useContext(context);
    return useMemo(() => state.selected ?? [], [state.selected]);
  }

  return { Provider, Component, useSelection };
}
