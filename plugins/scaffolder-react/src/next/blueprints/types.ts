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
import { z } from 'zod';
import {
  CustomFieldValidator,
  FieldExtensionComponentProps,
  FieldSchema,
} from '@backstage/plugin-scaffolder-react';

/** @alpha */
export type FormFieldExtensionData<
  TReturnValue extends z.ZodType = z.ZodType,
  TUiOptions extends z.ZodType = z.ZodType,
> = {
  name: string;
  component: (
    props: FieldExtensionComponentProps<
      z.output<TReturnValue>,
      z.output<TUiOptions>
    >,
  ) => JSX.Element | null;
  validation?: CustomFieldValidator<
    z.output<TReturnValue>,
    z.output<TUiOptions>
  >;
  schema?: FieldSchema<z.output<TReturnValue>, z.output<TUiOptions>>;
};
