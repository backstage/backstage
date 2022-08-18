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
import type { FormProps } from '@rjsf/core';

/**
 * The field template from \@rjsf/core which is a react component that gets passed \@rjsf/core field related props.
 *
 * @public
 */
export type LayoutTemplate<T = any> = FormProps<T>['ObjectFieldTemplate'];

/**
 * The type of layouts that is passed to the TemplateForms
 *
 * @public
 */
export interface LayoutOptions<P = any> {
  name: string;
  component: LayoutTemplate<P>;
}
