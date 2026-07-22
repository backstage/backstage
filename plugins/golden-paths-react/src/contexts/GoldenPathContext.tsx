/*
 * Copyright 2026 The Backstage Authors
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
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';
import { JsonObject } from '@backstage/types';
import { createContext, useContext } from 'react';
import { useState, useMemo, PropsWithChildren } from 'react';

type GoldenPathContextType = {
  defaultParams?: JsonObject;
  setDefaultParams: Function;
  fieldExtensions: FieldExtensionOptions<unknown, unknown>[];
};

const GoldenPathContext = createContext<GoldenPathContextType>({
  defaultParams: undefined,
  setDefaultParams: () => {},
  fieldExtensions: [],
});

export function GoldenPathContextProvider({
  customFieldExtensions = [],
  children,
}: PropsWithChildren<{
  customFieldExtensions?: FieldExtensionOptions<unknown, unknown>[];
}>) {
  const [defaultParams, setDefaultParams] = useState();
  const [fieldExtensions] = useState(customFieldExtensions);

  const contextValue = useMemo(
    () => ({
      defaultParams,
      setDefaultParams,
      fieldExtensions,
    }),
    [defaultParams, fieldExtensions],
  );

  return (
    <GoldenPathContext.Provider value={contextValue}>
      {children}
    </GoldenPathContext.Provider>
  );
}
export const useGoldenPathContext = () => {
  const { setDefaultParams, defaultParams, fieldExtensions } =
    useContext<GoldenPathContextType>(GoldenPathContext);

  return {
    defaultParams,
    setDefaultParams,
    fieldExtensions,
  };
};
