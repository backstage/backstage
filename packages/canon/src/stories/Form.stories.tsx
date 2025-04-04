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

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '../components/TextField';
import { useForm, SubmitHandler } from 'react-hook-form';

const meta = {
  title: 'Global/Form',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Inputs = {
  example: string;
  exampleRequired: string;
};

export const Default: Story = {
  render: () => {
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    console.log(watch('example')); // watch input value by passing the name of it

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input defaultValue="test" {...register('example')} />

        {/* include validation with required or other standard HTML validation rules */}
        {/* <input {...register('exampleRequired', { required: true })} /> */}

        <TextField
          label="Example Required"
          description="This is an example required field"
          {...register('exampleRequired', { required: true })}
          error={errors.exampleRequired?.message}
        />

        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}

        <input type="submit" />
      </form>
    );
  },
};
