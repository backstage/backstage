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

import type { FunctionComponent, ReactNode, PropsWithChildren } from 'react';

import type {
  AnyParams,
  RouteRef,
  SubRouteRef,
  RouteDescriptorFunc,
} from '@backstage/core-plugin-api';

/**
 * @public
 */
export type DrawerWrapperComponentProps<Params extends AnyParams> =
  PropsWithChildren<{ params: Params }>;

/**
 * The DrawerWrapperComponent is a component that will be injected outside the
 * drawer components, if the drawer component is mounted with a routeRef which
 * has a wrapper component attached to it (or to any of its parent components).
 *
 * @public
 */
export type DrawerWrapperComponent<Params extends AnyParams> =
  FunctionComponent<DrawerWrapperComponentProps<Params>>;

/**
 * The DrawerWrapper is a type combining a routeRef and a
 * {@link DrawerWrapperComponent}.
 *
 * @public
 */
export interface DrawerWrapper<Params extends AnyParams = {}> {
  routeRef: RouteRef | SubRouteRef;
  component: DrawerWrapperComponent<Params>;
}

/**
 * DrawerContentProps is the props used in the {@link DrawerContentComponent}.
 *
 * @public
 */
export interface DrawerContentProps<Params extends AnyParams> {
  path: string;
  params: Params;
}

/**
 * DrawerContentComponent is the component used inside a popout drawer.
 *
 * @public
 */
export type DrawerContentComponent<Params extends AnyParams = {}> =
  FunctionComponent<DrawerContentProps<Params>>;

export interface DrawerView<Params extends AnyParams = {}> {
  title?:
    | string
    | (() => string | void | undefined | Promise<string | void | undefined>);
  icon?: ReactNode;
  content: DrawerContentComponent<Params>;
}

export interface MatchUrlInfo {
  url: string;
  info: URL;
  getRouteDescriptor: RouteDescriptorFunc;
}

export type DrawerViewFunc = (
  matchUrlInfo: MatchUrlInfo,
) => DrawerView | undefined | void;

export type DrawerViewRouteRefFunc<Params extends AnyParams = any> = (
  matchUrlInfo: MatchUrlInfo & { params: Params },
) => DrawerView<Params> | undefined | void;

export interface DrawerStoreRegisterDynamic {
  match: DrawerViewFunc;
}
