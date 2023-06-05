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

import React, { ComponentType, createContext } from 'react';

/*

App structure:
 - root
  - red
  - green
  - blue

*/
// app.registerExtensionPoint()

// import { redExtensionPointRef } from 'wherever';

type Extension<TInstanceConfig extends unknown, TOutput = ComponentType> = {
  factory(instanceOptions: { id: string; config: TInstanceConfig }): TOutput;
};

type ExtensionInstanceConfig<TInstanceConfig extends unknown> = {
  id: string;
  config: TInstanceConfig;
  // what should point be for root
  point?: string;
  extension: Extension<TInstanceConfig>;
};

type ExtensionInstance = {
  id: string;
  // what should point be for root
  point?: string;
  output: ComponentType;
};

const BackstageAppContext = createContext<{
  extensionInstances: ExtensionInstance[];
}>({ extensionInstances: [] });

const container = {
  createExtension<TInstanceConfig extends unknown>(extensionOptions: {
    render: (options: { id: string; config: TInstanceConfig }) => JSX.Element;
  }): Extension<TInstanceConfig> {
    return {
      factory(instanceOptions) {
        return () =>
          extensionOptions.render({
            id: instanceOptions.id,
            config: instanceOptions.config,
          });
      },
    };
  },
};

const ExtensionInstanceDerp = (props: { id: string }) => {
  const { id } = props;
  const { extensionInstances } = React.useContext(BackstageAppContext);

  const value = extensionInstances.find(i => i.id === id);

  if (!value) {
    throw new Error(`No extension instance found with id ${id}`);
  }

  const { output: ComponentInstance } = value;

  return <ComponentInstance />;
};

const ExtensionPointInstance = (props: { id: string }) => {
  const { extensionInstances } = React.useContext(BackstageAppContext);

  return (
    <>
      {extensionInstances
        .filter(i => i.point === props.id)
        .map(extensionInstance => (
          <ExtensionInstanceDerp
            key={extensionInstance.id}
            id={extensionInstance.id}
          />
        ))}
    </>
  );
};

const Container = container.createExtension({
  render: ({ id }) => <ExtensionPointInstance id={id} />,
});

const Box = container.createExtension({
  render: ({ config }: { config: { color: string } }) => {
    return (
      <div style={{ background: config.color, width: 100, height: 100 }}>
        {config.color}
      </div>
    );
  },
});

function createExtensionInstances(
  instanceConfigs: ExtensionInstanceConfig<unknown>[],
): ExtensionInstance[] {
  return instanceConfigs.map(instanceConfig => ({
    id: instanceConfig.id,
    point: instanceConfig.point,
    output: instanceConfig.extension.factory({
      id: instanceConfig.id,
      config: instanceConfig.config,
    }),
  }));
}

export function Experiment1() {
  // const element = useExtension("red");

  const extensionInstances = createExtensionInstances([
    { id: 'root', config: {}, extension: Container },
    { id: 'nestedRoot', point: 'root', config: {}, extension: Container },
    {
      id: 'red',
      point: 'nestedRoot',
      config: { color: 'red' },
      extension: Box,
    },
    {
      id: 'green',
      point: 'nestedRoot',
      config: { color: 'green' },
      extension: Box,
    },
    {
      id: 'blue',
      point: 'nestedRoot',
      config: { color: 'blue' },
      extension: Box,
    },
  ]);

  return (
    <BackstageAppContext.Provider
      value={{
        // This will come from config eventually
        extensionInstances,
      }}
    >
      <h1>Experiment 1</h1>
      <p>This is an experiment to see how the app-experiments package works.</p>
      <ExtensionInstanceDerp id="root" />
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
