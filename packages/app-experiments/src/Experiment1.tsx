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

import React, { CSSProperties, ComponentType, createContext } from 'react';
import { z } from 'zod';
import mapValues from 'lodash/mapValues';
import { Typography } from '@material-ui/core';

/*

App structure:
 - root
  - red
  - green
  - blue

*/
// app.registerExtensionPoint()

// import { redExtensionPointRef } from 'wherever';

type Extension<TInstanceConfig, TSelf> = {
  factory(instanceOptions: { id: string; config: TInstanceConfig }): TSelf;
};

type ExtensionOptions<
  TInstanceConfig,
  TSelf,
  TPoints extends {
    [name in string]: {
      typeRef: ExtensionPointTypeRef<unknown>;
      configSchema: z.ZodObject<any>;
    };
  },
> = {
  mountTypeRef: ExtensionPointTypeRef<TSelf>;
  points: TPoints;
  // points: {
  //   [name in keyof TPoints]: {
  //     typeRef: TPoints[name]['typeRef'];
  //     configSchema: z.ZodObject<any>;
  //   };
  // };
  factory(instanceOptions: {
    id: string;
    config: TInstanceConfig;
    points: {
      [name in keyof TPoints]: ExtensionPointRef<TPoints[name]['typeRef']['T']>;
    };
    // points: {[name in keyof TPoints]: TPoints[name] extends ExtensionPointTypeRef<infer U> ? ExtensionPointRef<U> : never};
  }): TSelf;
};

// points: {
//   top: { ref: componentExtensionPointTypeRef, configSchema: z.object({}) },
//   bottom: { ref: componentExtensionPointTypeRef, configSchema: z.object({}) },
// },

type ExtensionInstanceConfig<TInstanceConfig, TSelf> = {
  id: string;
  config: TInstanceConfig;
  // what should point be for root
  mount?: string;
  extension: Extension<TInstanceConfig, TSelf>;
};

type ExtensionInstance<TSelf> = {
  id: string;
  // what should point be for root
  mount?: string;
  output: TSelf;
};

const BackstageAppContext = createContext<{
  extensionInstances: ExtensionInstance<unknown>[];
}>({ extensionInstances: [] });

const container = {
  createExtension<
    TInstanceConfig,
    TSelf,
    TPoints extends {
      [name in string]: {
        typeRef: ExtensionPointTypeRef<unknown>;
        configSchema: z.ZodObject<any>;
      };
    },
  >(
    extensionOptions: ExtensionOptions<TInstanceConfig, TSelf, TPoints>,
  ): Extension<TInstanceConfig, TSelf> {
    return {
      factory(instanceOptions) {
        return extensionOptions.factory({
          id: instanceOptions.id,
          config: instanceOptions.config,
          points: mapValues(extensionOptions.points, (point, name) =>
            createExtensionPointRef(name, point.typeRef),
          ),
        });
      },
    };
  },
};

function useExtensionInstanceChildren<T>(
  id: string,
  point: ExtensionPointRef<T>,
): T[] {
  const { extensionInstances } = React.useContext(BackstageAppContext);

  return extensionInstances
    .filter(i => i.mount === `${id}/${point.name}`)
    .map(extensionInstance => extensionInstance.output as T);
}

const ExtensionInstanceChildren = (props: {
  id: string;
  point: ExtensionPointRef<ComponentType>;
}) => {
  const outputs = useExtensionInstanceChildren(props.id, props.point);

  return (
    <>
      {outputs.map(Component => (
        <Component />
      ))}
    </>
  );
};

export const coreExtensionPointTypes = {
  component: createExtensionPointTypeRef<ComponentType>(),
  styles: createExtensionPointTypeRef<CSSProperties>(),
};

const Container = container.createExtension({
  points: {
    default: {
      typeRef: coreExtensionPointTypes.component,
      configSchema: z.object({}),
    },
  },
  mountTypeRef: coreExtensionPointTypes.component,
  factory:
    ({ id, points }) =>
    () =>
      <ExtensionInstanceChildren id={id} point={points.default} />,
});

interface ExtensionPointTypeRef<T> {
  T: T;
  $$type: 'extension-point-type';
}

function createExtensionPointTypeRef<T>(): ExtensionPointTypeRef<T> {
  return { T: null as T, $$type: 'extension-point-type' };
}

interface ExtensionPointRef<T> {
  name: string;
  typeRef: ExtensionPointTypeRef<T>;
  $$type: 'extension-point';
}

function createExtensionPointRef<T>(
  name: string,
  typeRef: ExtensionPointTypeRef<T>,
): ExtensionPointRef<T> {
  return { name, typeRef, $$type: 'extension-point' };
}

// const splitLayoutTopExtensionPointRef = createExtensionPointRef({
//   type: componentExtensionPointTypeRef,
//   point: 'top'
// })

// const splitLayoutBottomExtensionPointRef = createExtensionPointRef({
//   type: componentExtensionPointTypeRef,
//   point: 'bottom'
// })

const SplitLayout = container.createExtension({
  points: {
    top: {
      typeRef: coreExtensionPointTypes.component,
      configSchema: z.object({}),
    },
    bottom: {
      typeRef: coreExtensionPointTypes.component,
      configSchema: z.object({}),
    },
  },
  mountTypeRef: coreExtensionPointTypes.component,
  factory:
    ({ id, points }) =>
    () => {
      return (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            position: 'absolute',
            top: 120,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <div style={{ flex: '1 0 0px', border: '1px solid blue' }}>
            <ExtensionInstanceChildren id={id} point={points.top} />
          </div>
          <div style={{ flex: '1 0 0px', border: '1px solid orange' }}>
            <ExtensionInstanceChildren id={id} point={points.bottom} />
          </div>
        </div>
      );
    },
});

// const SnazzySplitLayout = container.replaceExtension(SplitLayout, {
//   factory: ({ id, points }) => {
//     ...
//   }
// })

const Box = container.createExtension({
  points: {},
  mountTypeRef: coreExtensionPointTypes.component,
  factory: ({ config }: { config: { color: string } }) => {
    return () => (
      /**
       * If I need stuff, I have to get it from context.
       */
      <div style={{ background: config.color, width: 100, height: 100 }}>
        {config.color}
      </div>
    );
  },
});

const StyledBox = container.createExtension({
  points: {
    style: {
      typeRef: coreExtensionPointTypes.styles,
      configSchema: z.object({}),
    },
  },
  mountTypeRef: coreExtensionPointTypes.component,
  factory: ({ id, points }) => {
    return () => {
      const [style] = useExtensionInstanceChildren(id, points.style);

      return <div style={style}>Styled box</div>;
    };
  },
});

const BoxStyle = container.createExtension({
  points: {},
  mountTypeRef: coreExtensionPointTypes.styles,
  factory({ config }: { config: { color: string } }) {
    return {
      borderColor: config.color,
      borderStyle: 'solid',
      borderWidth: '5px',
      width: 120,
      height: 120,
    };
  },
});

function createExtensionInstances(
  instanceConfigs: ExtensionInstanceConfig<unknown, unknown>[],
): ExtensionInstance<unknown>[] {
  return instanceConfigs.map(instanceConfig => ({
    id: instanceConfig.id,
    mount: instanceConfig.mount,
    output: instanceConfig.extension.factory({
      id: instanceConfig.id,
      config: instanceConfig.config,
    }),
  }));
}

const ExtensionInstanceRenderer = (props: { id: string }) => {
  const { id } = props;
  const { extensionInstances } = React.useContext(BackstageAppContext);

  const value = extensionInstances.find(i => i.id === id);

  if (!value) {
    throw new Error(`No extension instance found with id ${id}`);
  }

  // TODO: Validation?
  const ComponentInstance = value.output as React.ComponentType;

  return <ComponentInstance />;
};

export function Experiment1() {
  const extensionInstances = createExtensionInstances([
    { id: 'root', config: {}, extension: Container },
    {
      id: 'layout',
      mount: 'root/default', // Maybe can omit /default here?
      config: {},
      extension: SplitLayout,
    },
    {
      id: 'red',
      mount: 'layout/top',
      config: { color: 'red' },
      extension: Box,
    },
    {
      id: 'green',
      mount: 'layout/top',
      config: { color: 'green' },
      extension: Box,
    },
    {
      id: 'blue',
      mount: 'layout/bottom',
      config: { color: 'blue' },
      extension: Box,
    },
    {
      id: 'styled-box',
      mount: 'layout/bottom',
      config: {},
      extension: StyledBox,
    },
    {
      id: 'styled-box.style',
      mount: 'styled-box/style',
      config: { color: 'purple' },
      extension: BoxStyle,
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
      <Typography>
        This is an experiment to see how the app-experiments package works.
      </Typography>
      <ExtensionInstanceRenderer id="root" />
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
