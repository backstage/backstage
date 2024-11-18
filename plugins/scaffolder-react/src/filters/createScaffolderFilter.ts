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
import { attachComponentData, Extension } from '@backstage/core-plugin-api';
import { FILTERS_KEY, FILTERS_WRAPPER_KEY } from './keys';
import React from 'react';

/**
 * A filter template that can be used to create custom filters.
 *
 * @public
 */
export type FilterTemplate<T = any> = React.ComponentType<
  {
    onChange: (value: any) => void;
  } & T
>;

/**
 * Options for creating a filter.
 *
 * @public
 */
export interface FilterOptions<P = any> {
  name: string;
  component: FilterTemplate<P>;
}

/**
 * Method for creating custom filters that can be used in the scaffolder frontend form.
 *
 * @public
 */
export function createScaffolderFilter(
  options: FilterOptions,
): Extension<FilterTemplate> {
  return {
    expose() {
      const FilterDataHolder: any = () => null;
      attachComponentData(FilterDataHolder, FILTERS_KEY, options);
      return FilterDataHolder;
    },
  };
}

/**
 * The wrapping component for defining scaffolder filters as children
 *
 * @public
 */
export const ScaffolderTemplateFilter: React.ComponentType<
  React.PropsWithChildren<{}>
> = (): JSX.Element | null => null;

attachComponentData(ScaffolderTemplateFilter, FILTERS_WRAPPER_KEY, true);
