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

import React, { PropsWithChildren, createContext, useContext } from 'react';
import useAsync from 'react-use/lib/useAsync';

import { CompoundEntityRef } from '@backstage/catalog-model';

import { compile } from '@mdx-js/mdx';

import { usePlugins } from './Plugins';
import { TechDocsMetadata } from './types';

type ProviderProps = PropsWithChildren<{
  path: string;
  entityRef: CompoundEntityRef;
  content: string;
  metadata?: TechDocsMetadata;
}>;

const Context = createContext<any | undefined>(undefined);

export const Provider = ({ content, children, ...rest }: ProviderProps) => {
  const plugins = usePlugins();

  const { value: code } = useAsync(async () => {
    return await compile(content, {
      outputFormat: 'function-body',
      ...plugins,
    });
  }, [content]);

  if (!code) {
    return null;
  }

  const value = {
    ...rest,
    code,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useProvider = () => useContext(Context);
