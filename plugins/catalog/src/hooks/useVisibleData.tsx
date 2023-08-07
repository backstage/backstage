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
  Dispatch,
  SetStateAction,
  useState,
  useContext,
  PropsWithChildren,
} from 'react';

export type VisibleDataContextProps = {
  visibleData: any[];
  setVisibleData: Dispatch<SetStateAction<any[]>>;
};

export const VisibleDataContext = React.createContext<
  VisibleDataContextProps | undefined
>(undefined);

export const VisibleDataProvider = ({ children }: PropsWithChildren<{}>) => {
  const [visibleData, setVisibleData] = useState<any[]>([]);
  return (
    <VisibleDataContext.Provider value={{ visibleData, setVisibleData }}>
      {children}
    </VisibleDataContext.Provider>
  );
};

export function useVisibileData() {
  const context = useContext(VisibleDataContext);

  if (!context) {
    assertNever();
  }

  return [context.visibleData, context.setVisibleData] as const;
}

function assertNever(): never {
  throw new Error(`Cannot use useVisibleData outside VisibleDataProvider`);
}
