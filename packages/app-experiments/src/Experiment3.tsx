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

type Extension<TInstanceConfig, TSelf> = {
  factory(instanceOptions: { id: string; config: TInstanceConfig }): TSelf;
};

type ExtensionInstance<TSelf> = {
  id: string;
  // what should point be for root
  mount?: string;
  output: TSelf;
};

const ExtensionInstanceRenderer = (props: { id: string }) => {
  const { id } = props;
  const { extensionInstances } = React.useContext(BackstageAppContext);
  const value = extensionInstances.find(i => i.id === id);
  if (!value) {
    throw new Error(`No extension instance found with id ${id}`);
  }
  const ComponentInstance = value.output as React.ComponentType;
  return <ComponentInstance />;
};

export function Experiment1() {
  const extensionInstances = createExtensionInstances([
    {
      id: 'layout',
      parent: 'root', // Maybe can omit /default here?
      config: {},
      use: SplitGridLayout,
    },
    {
      id: 'red',
      mount: 'layout/top',
      config: { color: 'red', title: 'RED' },
      use: Box,
    },
    {
      // green is a Box on layout/top with color=green title=GREEN
      // alias, name, id, ...
      // green is a Box extension attached to the `layout` extension instance on the `top`
      // extension point with config { ... }.
      id: 'green',
      // at: { id: 'layout', point: 'top' },
      at: 'layout/top',
      extension: '@backstage/plugin-catalog-react#Box',
      config: { color: 'green', title: 'GREEN' },
    },
    {
      id: 'blue',
      at: 'layout/bottom',
      extension: '@backstage/plugin-catalog-react#Box',
      config: { color: 'blue', title: 'BLUE' },
    },

    {
      id: 'styled-box',
      parent: 'layout/bottom',
      config: { title: 'STYLED' },
      extension: StyledBox,
    },
    {
      id: 'styled-box.style',
      parent: 'styled-box/style',
      config: { color: 'purple' },
      extension: BoxStyle,
    },

    {
      id: 'scaffolder.page',
      bind: 'core.router/routes',
      attach: 'core.router/routes',
      target: 'core.router/routes',
      connect: 'core.router/routes',
      on: 'core.router/routes',
      at: 'core.router/routes',
      edge: 'core.router/routes',
      config: { path: '/create' },
      extension: ScaffolderPage,
    },
    {
      id: 'scaffolder.fieldExtensions.derp',
      attach: 'scaffolder.page/fieldExtension',
      config: { color: 'purple' },
      extension: DerpScaffolderFieldExtension,
    },
  ]);
}

interface ExtensionDataRef<T> {
  id: string;
  T: T;
  $$type: 'extension-data';
}

function createExtensionDataRef<T>(id: string) {
  return { id } as ExtensionDataRef<T>;
}

const coreExtensionData = {
  reactComponent: createExtensionDataRef<ComponentType>('core.reactComponent'),
  isGrocery: createExtensionDataRef<boolean>('isGrocery'),
  title: createExtensionDataRef<string>('core.title'),
};

const groceryExtensionDataCollection = () => ({
  Component: coreExtensionData.reactComponent,
  isGrocery: coreExtensionData.isGrocery,
});

const groceriesExtensionPoint = createExtensionPoint({
  extensionData: groceryExtensionDataCollection(),
});

const GroceryLayout = createExtension({
  points: {
    groceries: groceriesExtensionPoint,
    // groceries: {
    //   extensionData: groceryExtensionDataCollection(),
    // },
  },
  extensionData: {
    component: coreExtensionData.reactComponent,
  },
  factory({ bind, points }) {
    const elements = points.groceries.map(point => <point.Component />);
    const Component = () => <div>yo yo yo, here's my elements: {elements}</div>;
    bind.component(Component);
  },
});

// // plugin-*-react
// const GroceryLayoutExtensionDefinition = defineExtension({
//   input: {
//     groceries: {
//       component: coreExtensionData.reactComponent,
//       isGrocery: coreExtensionData.isGrocery,
//     }
//   },
//   output: {
//     component: coreExtensionData.reactComponent,
//   },
// });

// // plugin-*
// const GroceryLayoutExtension = createExtension(GroceryLayoutExtension, ({ bind, points }) => {
//   ...
// });

const GroceryLayout = createExtension({
  inputs: {
    groceries: {
      Component: coreExtensionData.reactComponent,
      isGrocery: coreExtensionData.isGrocery,
    },
  },
  output: {
    component: coreExtensionData.reactComponent,
  },
  factory({ output, input }) {
    const elements = input.groceries.map(point => <point.Component />);
    const Component = () => <div>yo yo yo, here's my elements: {elements}</div>;
    output.component.set({ component: Component });
  },
});

const createGroceryExtension = createExtensionFactory(({ component }) => ({
  extensionData: groceryExtensionDataCollection(),
  factory({ bind }) {
    bind.component(component);
    bind.isGrocery(true);
    bind.isFruit(true);
  },
}));

const Apple = createGroceryExtension({
  component: () => <div>apple</div>,
});
