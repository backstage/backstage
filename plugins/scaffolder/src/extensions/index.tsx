/*
 * Copyright 2021 Spotify AB
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
import { JsonValue } from '@backstage/config';
import {
  Extension,
  ComponentLoader,
  createReactExtension,
  getComponentData,
  attachComponentData,
} from '@backstage/core';
import { FieldValidation, Field } from '@rjsf/core';
import React from 'react';
import { useMount } from 'react-use';

import {
  childDiscoverer,
  routeElementDiscoverer,
  traverseElementTree,
  createCollector,
} from '@backstage/core-api/src/extensions/traversal';

export type FieldExtensionOptions = {
  name: string;
  component: Field;
  validation: (data: JsonValue, field: FieldValidation) => void;
};

export function createScaffolderFieldExtension(
  options: FieldExtensionOptions,
): Extension<Field> {
  const extensionData = {
    'scaffolder.extensions.field.v1': options,
  };

  const Result = (props: any) => <options.component {...props} />;

  for (const [key, value] of Object.entries(extensionData)) {
    attachComponentData(Result, key, value);
  }
  return {
    expose() {
      return Result;
    },
  };
}

export type ExtensionState = {
  fields: FieldExtensionOptions[];
};
export type RegisterFieldExtensionAction = {
  type: 'fields';
  data: FieldExtensionOptions[];
};

export type ExtensionAction = RegisterFieldExtensionAction;
export type ExtensionDispatch = (action: ExtensionAction) => void;

export const ExtensionContext = React.createContext<
  { state: ExtensionState; dispatch: ExtensionDispatch } | undefined
>(undefined);

export const extensionsReducer = (
  state: ExtensionState,
  action: ExtensionAction,
): ExtensionState => {
  if (action.type === 'fields') {
    return {
      ...state,
      fields: [...state.fields, ...action.data],
    };
  }
  return state;
};

export const ExtensionCollector = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const context = React.useContext(ExtensionContext);

  if (!context) {
    throw new Error('ExtensionsCollector must be used in a ExtensionsContext');
  }

  useMount(() => {
    const { fields } = traverseElementTree({
      root: children,
      discoverers: [childDiscoverer, routeElementDiscoverer],
      collectors: {
        fields: createCollector(
          () => [] as FieldExtensionOptions[],
          (acc, node) => {
            const data = getComponentData<FieldExtensionOptions>(
              node,
              'scaffolder.extensions.field.v1',
            );

            if (data) {
              acc.push(data);
            }
          },
        ),
      },
    });
    context.dispatch({ data: fields, type: 'fields' });
  });

  return null;
};
