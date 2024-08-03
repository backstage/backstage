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

import {
  ApiHolder,
  ApiRef,
  AppContext,
  useApp,
} from '@backstage/core-plugin-api';
import {
  ComponentRef,
  ComponentsApi,
  CoreErrorBoundaryFallbackProps,
  CoreNotFoundErrorPageProps,
  CoreProgressProps,
  IconComponent,
  IconsApi,
  componentsApiRef,
  coreComponentRefs,
  iconsApiRef,
} from '@backstage/frontend-plugin-api';
import React, { ComponentType, useMemo } from 'react';
import { ReactNode } from 'react';
import { toLegacyPlugin } from './BackwardsCompatProvider';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { ApiProvider } from '../../../core-app-api/src/apis/system/ApiProvider';

class CompatComponentsApi implements ComponentsApi {
  readonly #Progress: ComponentType<CoreProgressProps>;
  readonly #NotFoundErrorPage: ComponentType<CoreNotFoundErrorPageProps>;
  readonly #ErrorBoundaryFallback: ComponentType<CoreErrorBoundaryFallbackProps>;

  constructor(app: AppContext) {
    const components = app.getComponents();
    const ErrorBoundaryFallback = (props: CoreErrorBoundaryFallbackProps) => (
      <components.ErrorBoundaryFallback
        {...props}
        plugin={props.plugin && toLegacyPlugin(props.plugin)}
      />
    );
    this.#Progress = components.Progress;
    this.#NotFoundErrorPage = components.NotFoundErrorPage;
    this.#ErrorBoundaryFallback = ErrorBoundaryFallback;
  }

  getComponent<T extends {}>(ref: ComponentRef<T>): ComponentType<T> {
    switch (ref.id) {
      case coreComponentRefs.progress.id:
        return this.#Progress as ComponentType<any>;
      case coreComponentRefs.notFoundErrorPage.id:
        return this.#NotFoundErrorPage as ComponentType<any>;
      case coreComponentRefs.errorBoundaryFallback.id:
        return this.#ErrorBoundaryFallback as ComponentType<any>;
      default:
        throw new Error(
          `No backwards compatible component is available for ref '${ref.id}'`,
        );
    }
  }
}

class CompatIconsApi implements IconsApi {
  readonly #app: AppContext;

  constructor(app: AppContext) {
    this.#app = app;
  }

  getIcon(key: string): IconComponent | undefined {
    return this.#app.getSystemIcon(key);
  }

  listIconKeys(): string[] {
    return Object.keys(this.#app.getSystemIcons());
  }
}

class AppFallbackApis implements ApiHolder {
  readonly #componentsApi: ComponentsApi;
  readonly #iconsApi: IconsApi;

  constructor(app: AppContext) {
    this.#componentsApi = new CompatComponentsApi(app);
    this.#iconsApi = new CompatIconsApi(app);
  }

  get<T>(ref: ApiRef<any>): T | undefined {
    if (ref.id === componentsApiRef.id) {
      return this.#componentsApi as T;
    } else if (ref.id === iconsApiRef.id) {
      return this.#iconsApi as T;
    }
    return undefined;
  }
}

function NewAppApisProvider(props: { children: ReactNode }) {
  const app = useApp();
  const appFallbackApis = useMemo(() => new AppFallbackApis(app), [app]);

  return <ApiProvider apis={appFallbackApis}>{props.children}</ApiProvider>;
}

export function ForwardsCompatProvider(props: { children: ReactNode }) {
  return <NewAppApisProvider>{props.children}</NewAppApisProvider>;
}
