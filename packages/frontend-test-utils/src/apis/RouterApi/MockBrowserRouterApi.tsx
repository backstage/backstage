/*
 * Copyright 2024 The Backstage Authors
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

import { ComponentType, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { BaseReactRouterV6Api } from './BaseReactRouterV6Api';

/**
 * Options for creating a MockBrowserRouterApi.
 * @public
 */
export interface MockBrowserRouterApiOptions {
  /** Base path for the router (defaults to empty string) */
  basePath?: string;
}

/**
 * Mock implementation of RouterApi using BrowserRouter for testing.
 *
 * Use this when tests require real browser history APIs such as
 * `window.location`, `window.history.pushState()`, or `window.history.back()`.
 *
 * @public
 */
export class MockBrowserRouterApi extends BaseReactRouterV6Api {
  override Router: ComponentType<{
    children: ReactNode;
    basePath: string;
  }> = ({ children, basePath }) => (
    <BrowserRouter basename={basePath}>{children}</BrowserRouter>
  );
}
