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
  useState,
  useCallback,
  useContext,
  createContext,
  PropsWithChildren,
} from 'react';
import { JsonObject } from '@backstage/types';

type SecretsContextContents = {
  secrets: JsonObject;
  setSecrets: React.Dispatch<React.SetStateAction<JsonObject>>;
};

export const SecretsContext = createContext<SecretsContextContents | undefined>(
  undefined,
);

export const SecretsContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [secrets, setSecrets] = useState<JsonObject>({});

  return (
    <SecretsContext.Provider value={{ secrets, setSecrets }}>
      {children}
    </SecretsContext.Provider>
  );
};

export const useSecretsContext = () => {
  const value = useContext(SecretsContext);
  if (!value) {
    throw new Error('SecretsContext has not been initialized');
  }
  const { secrets, setSecrets } = value;

  const setSecret = useCallback(
    (input: JsonObject) => {
      setSecrets({ ...secrets, ...input });
    },
    [secrets, setSecrets],
  );

  return { setSecret };
};
