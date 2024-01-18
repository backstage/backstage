/*
 * Copyright 2023 The Backstage Authors
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
import React, { useCallback, useContext, useState } from 'react';

export interface ErrorContext {
  error?: string;
  setError: (message: string) => void;
}

export const KubernetesClusterErrorContext = React.createContext<ErrorContext>({
  setError: (_: string) => {},
});

export interface KubernetesClusterErrorProviderProps {
  children: React.ReactNode;
}

export const KubernetesClusterErrorProvider = ({
  children,
}: KubernetesClusterErrorProviderProps) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const contextValue: ErrorContext = {
    error,
    setError: useCallback((message: string) => setError(message), []),
  };

  return (
    <KubernetesClusterErrorContext.Provider value={contextValue}>
      {children}
    </KubernetesClusterErrorContext.Provider>
  );
};

export const useKubernetesClusterError = () => {
  return useContext(KubernetesClusterErrorContext);
};
