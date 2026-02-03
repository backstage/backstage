/*
 * Copyright 2025 The Backstage Authors
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

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type PluginRouteContextValue = {
  pluginId: string;
  setPluginId: (pluginId: string | undefined) => void;
};

const PluginRouteContext = createContext<PluginRouteContextValue | undefined>(
  undefined,
);

export function PluginRouteProvider({
  initialPluginId,
  children,
}: PropsWithChildren<{ initialPluginId: string }>) {
  const fallbackPluginId = useRef(initialPluginId);
  const [pluginId, setPluginIdState] = useState(initialPluginId);

  const setPluginId = useCallback((nextPluginId: string | undefined) => {
    setPluginIdState(nextPluginId ?? fallbackPluginId.current);
  }, []);

  const value = useMemo(
    () => ({ pluginId, setPluginId }),
    [pluginId, setPluginId],
  );

  return (
    <PluginRouteContext.Provider value={value}>
      {children}
    </PluginRouteContext.Provider>
  );
}

export function usePluginRoute() {
  const context = useContext(PluginRouteContext);
  if (!context) {
    throw new Error('usePluginRoute must be used within a PluginRouteProvider');
  }
  return context;
}
