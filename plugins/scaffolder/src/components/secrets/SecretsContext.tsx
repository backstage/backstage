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
  useState,
  useCallback,
  useContext,
  createContext,
  PropsWithChildren,
} from 'react';

type SecretsContextContents = {
  secrets: Record<string, string>;
  setSecrets: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

/**
 * The actual context object.
 */
export const SecretsContext = createContext<SecretsContextContents | undefined>(
  undefined,
);

/**
 * The Context Provider that holds the state for the secrets.
 *
 * @public
 */
export const SecretsContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [secrets, setSecrets] = useState<Record<string, string>>({});

  return (
    <SecretsContext.Provider value={{ secrets, setSecrets }}>
      {children}
    </SecretsContext.Provider>
  );
};

/**
 * The return type from the useTemplateSecrets hook.
 * @public
 */
export interface ScaffolderUseTemplateSecrets {
  setSecrets: (input: Record<string, string>) => void;
}

/**
 * Hook to access the secrets context.
 * @public
 */
export const useTemplateSecrets = (): ScaffolderUseTemplateSecrets => {
  const value = useContext(SecretsContext);
  if (!value) {
    throw new Error(
      'useTemplateSecrets must be used within a SecretsContextProvider',
    );
  }

  const { setSecrets: updateSecrets } = value;

  const setSecrets = useCallback(
    (input: Record<string, string>) => {
      updateSecrets(currentSecrets => ({ ...currentSecrets, ...input }));
    },
    [updateSecrets],
  );

  return { setSecrets };
};
