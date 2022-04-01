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

import React, { createContext } from 'react';

export type Tool = {
  label: string;
  url: string;
  icon: React.ReactNode;
};

type ToolkitContextValue = {
  tools: Tool[];
};

const Context = createContext<ToolkitContextValue | undefined>(undefined);

export const ContextProvider = (props: {
  children: JSX.Element;
  tools: Tool[];
}) => {
  const { children, tools } = props;

  const [toolsValue, _setTools] = React.useState(tools);

  const value: ToolkitContextValue = {
    tools: toolsValue,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useToolkit = () => {
  const value = React.useContext(Context);
  return value;
};

export default Context;
