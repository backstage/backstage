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

import React, { useMemo, DependencyList, useEffect } from 'react';
import { useAsync } from 'react-use';

import { errorApiRef, useApi } from '../apis';
import { Extension } from '../plugin';

import {
  ComponentAdaptation,
  AdaptableComponentRef,
  AdaptableComponentAdaptation,
  ComponentAdaptationSpec,
} from './types';

function handleAsyncAdaptation<Props extends {}, Context extends {}>(
  adaptation: ComponentAdaptation<Props, Context>,
  spec: ComponentAdaptationSpec<Props, Context>,
): ComponentAdaptation<Props, Context> {
  if (spec.Adaptation && spec.asyncAdaptation) {
    throw new Error(
      `Invalid adaptation ("${spec.id}"): ` +
        'must not provide both Adaptation and asyncAdaptation',
    );
  }

  const { Adaptation, asyncAdaptation, ...rest } = spec;

  const LazyAdaptation: AdaptableComponentAdaptation<
    Props,
    Context
  > = props => {
    const errorApi = useApi(errorApiRef);

    const { Component } = props;

    const { error, value: AsyncAdaptation } = useAsync(
      () => asyncAdaptation!(),
      [],
    );

    useEffect(() => {
      if (error) {
        const byPluginMsg = adaptation.plugin
          ? ` (provided by ${adaptation.plugin.getId()})`
          : '';

        errorApi.post({
          message: `Adaptation ${spec.id}${byPluginMsg} failed: ${error.message}`,
          name: error.name,
          stack: error.stack,
        });
      }
    }, [errorApi, error]);

    if (AsyncAdaptation) {
      return <AsyncAdaptation {...props} />;
    }

    // Loading or error, or simply no AsyncAdaptation component
    return <Component />;
  };

  const HandledAdaptation = asyncAdaptation ? LazyAdaptation : Adaptation;

  return {
    ...adaptation,
    spec: {
      ...rest,
      Adaptation: HandledAdaptation,
    },
  };
}

export function adaptComponent<Props extends {}, Context extends {}>(
  componentRef: AdaptableComponentRef<Props, Context>,
  adaptation: ComponentAdaptationSpec<Props, Context>,
): ComponentAdaptation<Props, Context> {
  if (adaptation.id.match(/^[a-z](-?[a-z0-9]+)*$/)) {
    throw new Error(
      `Invalid adaptation id "${adaptation.id}": ` +
        'must only contain lowercase alpha numeric values and dashes (-)',
    );
  }

  const ret: ComponentAdaptation<Props, Context> = {
    ref: componentRef,
    spec: adaptation,
    key: `${componentRef.id} ${adaptation.id}`,
  };

  return handleAsyncAdaptation(ret, adaptation);
}

export function createComponentAdaptationExtension<
  Props extends {},
  Context extends {},
>(
  componentRef: AdaptableComponentRef<Props, Context>,
  adaptation: ComponentAdaptationSpec<Props, Context>,
): Extension<ComponentAdaptation<Props, Context>> {
  return {
    expose(plugin) {
      const extension = adaptComponent(componentRef, adaptation);
      extension.plugin = plugin;
      return extension;
    },
  };
}

export function useAdaptComponent<Props extends {}, Context extends {}>(
  componentRef: AdaptableComponentRef<Props, Context>,
  adaptation: ComponentAdaptationSpec<Props, Context>,
  deps: DependencyList,
): ComponentAdaptation<Props, Context> {
  return useMemo(
    () => adaptComponent(componentRef, adaptation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
}
