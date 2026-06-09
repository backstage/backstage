/*
 * Copyright 2026 The Backstage Authors
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
  createContext,
  useContext,
  type ComponentType,
  type ReactNode,
} from 'react';

/**
 * Props for a sub-page wrapper component provided via {@link SubPageWrapperContext}.
 *
 * @public
 */
export interface SubPageWrapperProps {
  label: string;
  href: string;
  children: ReactNode;
}

/**
 * Context that allows PageLayout implementations to provide a wrapper component
 * for sub-page route elements. This enables features like breadcrumb registration
 * without coupling `frontend-plugin-api` to a specific UI library.
 *
 * @public
 */
export const SubPageWrapperContext = createContext<
  ComponentType<SubPageWrapperProps> | undefined
>(undefined);

/** @internal */
export function useSubPageWrapper():
  | ComponentType<SubPageWrapperProps>
  | undefined {
  return useContext(SubPageWrapperContext);
}
