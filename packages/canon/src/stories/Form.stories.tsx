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

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Select } from '../components/Select';

const meta = {
  title: 'Examples/Form',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Inputs = {
  firstname: string;
  lastname: string;
  city: string;
};

export const Uncontrolled: Story = {
  render: () => {
    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <TextField
          label="First Name"
          {...register('firstname', {
            required: 'First name is required',
            maxLength: { value: 80, message: 'Max length is 80 characters' },
          })}
          error={errors.firstname?.message}
        />
        <TextField
          label="Last Name"
          {...register('lastname', {
            required: 'Last name is required',
            maxLength: { value: 100, message: 'Max length is 100 characters' },
          })}
          error={errors.lastname?.message}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: 'New city is required' }}
          render={({ field }) => {
            return (
              <Select
                label="New City"
                options={[
                  { value: 'london', label: 'London' },
                  { value: 'paris', label: 'Paris' },
                  { value: 'new-york', label: 'New York' },
                ]}
                name={field.name}
                onValueChange={field.onChange}
                error={errors.city?.message}
              />
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const {
      handleSubmit,
      control,
      formState: { errors },
    } = useForm<Inputs>();

    const [firstname, setFirstname] = useState('John');
    const [lastname, setLastname] = useState('Doe');
    const [city, setCity] = useState('london');

    const onSubmit: SubmitHandler<Inputs> = data => {
      console.log('data', data);
      setFirstname(data.firstname);
      setLastname(data.lastname);
      setCity(data.city);
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
        }}
      >
        <Controller
          name="firstname"
          control={control}
          defaultValue={firstname}
          rules={{ required: 'First name is required' }}
          render={({ field }) => {
            return (
              <TextField
                label="First Name"
                name={field.name}
                value={firstname}
                onChange={e => {
                  field.onChange(e);
                  setFirstname(e.target.value);
                }}
                error={errors.firstname?.message}
              />
            );
          }}
        />
        <Controller
          name="lastname"
          control={control}
          defaultValue={lastname}
          rules={{ required: 'Last name is required' }}
          render={({ field }) => {
            return (
              <TextField
                label="Last Name"
                name={field.name}
                value={lastname}
                onChange={e => {
                  field.onChange(e);
                  setLastname(e.target.value);
                }}
                error={errors.lastname?.message}
              />
            );
          }}
        />
        <Controller
          name="city"
          control={control}
          defaultValue={city}
          rules={{ required: 'New city is required' }}
          render={({ field }) => {
            return (
              <Select
                label="New City"
                options={[
                  { value: 'london', label: 'London' },
                  { value: 'paris', label: 'Paris' },
                  { value: 'new-york', label: 'New York' },
                ]}
                name={field.name}
                value={city}
                onValueChange={field.onChange}
                error={errors.city?.message}
              />
            );
          }}
        />
        <Button type="submit">Submit</Button>
      </form>
    );
  },
};
