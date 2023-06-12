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

import React, { ComponentType } from 'react';
import mapValues from 'lodash/mapValues';

/**
 * App structure
 * - Root
 *   - GroceryLayout (fruit}
 *     - Apple [grocery, fruit, component]
 *     - Orange [grocery, fruit, component]
 *     - Metallica [band]
 */

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
  isFruit: createExtensionDataRef<boolean>('isFruit'),

  isBand: createExtensionDataRef<boolean>('isBand'),
  title: createExtensionDataRef<string>('core.title'),
};

type AnyExtensionDataMap = Record<string, ExtensionDataRef<any>>;

type ExtensionDataBind<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: (value: TData[K]['T']) => void;
};

type ExtensionDataValue<TData extends AnyExtensionDataMap> = {
  [K in keyof TData]: TData[K]['T'];
};

interface CreateExtensionOptions<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
> {
  extensionData: TData;
  points?: TPoint;
  factory(options: {
    bind: ExtensionDataBind<TData>;
    config?: unknown;
    points: {
      [pointName in keyof TPoint]: ExtensionDataValue<
        TPoint[pointName]['extensionData']
      >[];
    };
  }): void;
}

function createExtension<
  TData extends AnyExtensionDataMap,
  TPoint extends Record<string, { extensionData: AnyExtensionDataMap }>,
>(options: CreateExtensionOptions<TData, TPoint>) {
  return options;
}

const GroceryLayout = createExtension({
  points: {
    groceries: {
      // requiredData: [
      //   coreExtensionData.reactComponent,
      //   coreExtensionData.isGrocery,
      // ],
      extensionData: {
        Component: coreExtensionData.reactComponent,
        isGrocery: coreExtensionData.isGrocery,
      },
    },
  },
  extensionData: {
    component: coreExtensionData.reactComponent,
  },
  factory({ bind, points }) {
    const elements = points.groceries.map(point => <point.Component />);
    /**
     * Probably easier to evolve over time
     * const elements = points.groceries.map((point) => getExtensionData(point, coreExtensionData.reactComponent))
     **/
    const Component = () => <div>yo yo yo, here's my elements: {elements}</div>;
    bind.component(Component);
  },
});

const Apple = createExtension({
  extensionData: {
    component: coreExtensionData.reactComponent,
    isGrocery: coreExtensionData.isGrocery,
    isFruit: coreExtensionData.isFruit,
  },
  factory({ bind }) {
    const Component = () => <div>apple</div>;
    bind.component(Component);
    bind.isGrocery(true);
    bind.isFruit(true);
  },
});

const Metallica = createExtension({
  extensionData: {
    component: coreExtensionData.reactComponent,
  },
  factory({ bind }) {
    const Component = () => <div>HEAVY METAL YEAH</div>;
    bind.component(Component);
  },
});

const Orange = createExtension({
  extensionData: {
    component: coreExtensionData.reactComponent,
    isGrocery: coreExtensionData.isGrocery,
    isFruit: coreExtensionData.isFruit,
  },
  factory({ bind }) {
    const Component = () => <div>orange</div>;
    bind.component(Component);
    bind.isGrocery(true);
    bind.isFruit(true);
  },
});

function createExtensionInstance(
  options: CreateExtensionOptions<
    AnyExtensionDataMap,
    Record<string, { extensionData: AnyExtensionDataMap }>
  >,
  children: { data: Map<ExtensionDataRef<unknown>, unknown> }[],
) {
  const extensionData = new Map<ExtensionDataRef<unknown>, unknown>();
  options.factory({
    bind: mapValues(options.extensionData, ref => {
      return (value: unknown) => extensionData.set(ref, value);
    }),
    points: mapValues(options.points, ({ extensionData: pointData }) => {
      const requiredRef = Object.values(pointData);
      const matchingChildren = children.filter(child =>
        requiredRef.every(ref => child.data.has(ref)),
      );
      return matchingChildren.map(child =>
        mapValues(pointData, ref => child.data.get(ref)),
      );
    }),
  });
  return { data: extensionData };
}

export function Experiment2() {
  const apple = createExtensionInstance(Apple, []);
  const orange = createExtensionInstance(Orange, []);
  const metallica = createExtensionInstance(Metallica, []);
  const layout = createExtensionInstance(GroceryLayout, [
    apple,
    orange,
    metallica,
  ]);
  const Component = layout.data.get(
    coreExtensionData.reactComponent,
  ) as ComponentType;
  return <Component />;
}
