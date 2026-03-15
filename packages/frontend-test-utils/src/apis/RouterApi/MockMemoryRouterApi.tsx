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
import { MemoryRouter } from 'react-router-dom';
import { BaseReactRouterV6Api } from './BaseReactRouterV6Api';

/**
 * Options for creating a MockMemoryRouterApi.
 * @public
 */
export interface MockMemoryRouterApiOptions {
  /** Initial entries for the memory router */
  initialEntries?: string[];
  /** Initial index in the history stack */
  initialIndex?: number;
}

/**
 * Mock implementation of RouterApi using MemoryRouter for testing.
 * @public
 */
export class MockMemoryRouterApi extends BaseReactRouterV6Api {
  private initialEntries: string[];
  private initialIndex?: number;

  constructor(options?: MockMemoryRouterApiOptions) {
    super();
    this.initialEntries = options?.initialEntries ?? ['/'];
    this.initialIndex = options?.initialIndex;
  }

  override Router: ComponentType<{
    children: ReactNode;
    basePath: string;
  }> = ({ children, basePath }) => (
    <MemoryRouter
      basename={basePath}
      initialEntries={this.initialEntries}
      initialIndex={this.initialIndex}
    >
      {children}
    </MemoryRouter>
  );
}
