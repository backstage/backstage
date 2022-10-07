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
import { ensureValidId } from './id';

import {
  ComponentAdaptation,
  AdaptableComponentRef,
  AdaptableComponentAdaptation,
  ComponentAdaptationSpec,
} from './types';

function handleAsyncAdaptation<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  adaptation: ComponentAdaptation<TProps, TAdaptableKeys>,
  spec: ComponentAdaptationSpec<TProps, TAdaptableKeys>,
): ComponentAdaptation<TProps, TAdaptableKeys> {
  if (spec.Adaptation && spec.asyncAdaptation) {
    throw new Error(
      `Invalid adaptation ("${spec.id}"): ` +
        'must not provide both Adaptation and asyncAdaptation',
    );
  }

  const { Adaptation, asyncAdaptation, ...rest } = spec;

  const LazyAdaptation: AdaptableComponentAdaptation<
    TProps,
    TAdaptableKeys
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

export function adaptComponent<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  componentRef: AdaptableComponentRef<TProps, TAdaptableKeys>,
  adaptation: ComponentAdaptationSpec<TProps, TAdaptableKeys>,
): ComponentAdaptation<TProps, TAdaptableKeys> {
  ensureValidId(adaptation.id, `Invalid adaptation id "${adaptation.id}"`);

  const ret: ComponentAdaptation<TProps, TAdaptableKeys> = {
    ref: componentRef,
    spec: adaptation,
    key: `${componentRef.id} ${adaptation.id}`,
  };

  return handleAsyncAdaptation(ret, adaptation);
}

export function createComponentAdaptationExtension<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  componentRef: AdaptableComponentRef<TProps, TAdaptableKeys>,
  adaptation: ComponentAdaptationSpec<TProps, TAdaptableKeys>,
): Extension<ComponentAdaptation<TProps, TAdaptableKeys>> {
  return {
    expose(plugin) {
      const extension = adaptComponent(componentRef, adaptation);
      extension.plugin = plugin;
      return extension;
    },
  };
}

export function useAdaptComponent<
  TProps extends {},
  TAdaptableKeys extends keyof TProps,
>(
  componentRef: AdaptableComponentRef<TProps, TAdaptableKeys>,
  adaptation: ComponentAdaptationSpec<TProps, TAdaptableKeys>,
  deps: DependencyList,
): ComponentAdaptation<TProps, TAdaptableKeys> {
  return useMemo(
    () => adaptComponent(componentRef, adaptation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );
}
