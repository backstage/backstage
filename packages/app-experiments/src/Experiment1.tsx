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

import React, { ComponentType, createContext, useMemo } from 'react';

/*

App structure:
 - root
  - red
  - green
  - blue

*/
// app.registerExtensionPoint()

// import { redExtensionPointRef } from 'wherever';

type Extension<TInstanceConfig extends unknown> = {
  factory(instanceOptions: { config: TInstanceConfig }): ComponentType;
};

type ExtensionInstance<TInstanceConfig extends unknown> = {
  id: string;
  config: TInstanceConfig;
  extension: Extension<TInstanceConfig>;
};

const BackstageAppContext = createContext<{
  extensionInstances: ExtensionInstance<unknown>[];
}>({ extensionInstances: [] });

const container = {
  createExtension<TInstanceConfig extends unknown>(extensionOptions: {
    render: (config: TInstanceConfig) => JSX.Element;
  }): Extension<TInstanceConfig> {
    return {
      factory(instanceOptions: { config: TInstanceConfig }) {
        return () => extensionOptions.render(instanceOptions.config);
      },
    };
  },
};

const Box = container.createExtension({
  render: (config: { color: string }) => {
    return (
      <div style={{ background: config.color, width: 100, height: 100 }}>
        {config.color}
      </div>
    );
  },
});

const ExtensionInstanceDerp = (props: { id: string }) => {
  const { id } = props;
  const { extensionInstances } = React.useContext(BackstageAppContext);

  const instance = extensionInstances.find(i => i.id === id);

  if (!instance) {
    throw new Error(`No extension instance found with id ${id}`);
  }

  const Component = useMemo(
    () => instance.extension.factory({ config: instance.config }),
    [instance],
  );
  return <Component />;
};

export function Experiment1() {
  // const element = useExtension("red");

  return (
    <BackstageAppContext.Provider
      value={{
        // This will come from config eventually
        extensionInstances: [
          // { id: 'root' },
          { id: 'red', config: { color: 'red' }, extension: Box },
          { id: 'green', config: { color: 'green' }, extension: Box },
          { id: 'blue', config: { color: 'blue' }, extension: Box },
        ],
      }}
    >
      <h1>Experiment 1</h1>
      <p>This is an experiment to see how the app-experiments package works.</p>
      {/* extension point */}
      <ExtensionInstanceDerp id="red" />
      <ExtensionInstanceDerp id="green" />
      <ExtensionInstanceDerp id="blue" />
    </BackstageAppContext.Provider>
  );
}

/*
// graphiql-plugin



// App.tsx

export default app.createRoot(<DeclaredExtensionInstance id='root'/>);
export default app.createRoot(extensionInstanceElement('root'));

function extensionInstanceElement(id: string): JSX.Element {
}

app:
  extensions:
  - root.sidebar:
    use: 'CustomSidebar'


function CustomSidebar() {
  return (
    <Sidebar>
      {extensionInstanceElement('sidebar.items.derp')}
    </Sidebar>

  )
}

const customSidebar = createComponentExtension({
  component: CustomSidebar
})

createApp({
  extensions: [customSidebar]
})

*/
