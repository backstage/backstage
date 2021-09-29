/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import {
  FormProvider,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';

type Props<TFieldValues extends Record<string, any>> = Pick<
  UseFormProps<TFieldValues>,
  'defaultValues'
> & {
  onSubmit: SubmitHandler<TFieldValues>;

  render: (
    props: Pick<
      UseFormReturn<TFieldValues>,
      'formState' | 'register' | 'control' | 'setValue'
    > & {
      values: UnpackNestedValue<TFieldValues>;
    },
  ) => React.ReactNode;
};

/**
 * A form wrapper that creates a form that is used to prepare a pull request. It
 * hosts the form logic.
 *
 * @param defaultValues the default values of the form
 * @param onSubmit a callback that is executed when the form is submitted
 *   (initiated by a button of type="submit")
 * @param render render the form elements
 */
export const PreparePullRequestForm = <
  TFieldValues extends Record<string, any>,
>({
  defaultValues,
  onSubmit,
  render,
}: Props<TFieldValues>) => {
  const methods = useForm<TFieldValues>({ mode: 'onTouched', defaultValues });
  const { handleSubmit, watch, control, register, formState, setValue } =
    methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {render({ values: watch(), formState, register, control, setValue })}
      </form>
    </FormProvider>
  );
};
