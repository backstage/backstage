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
import { Control, UseFormSetValue } from 'react-hook-form';
import { FormValues } from '../../types';
import { Typography } from '@material-ui/core';
import { DateSelector } from '../DateSelector/DateSelector';

type Props = {
  control: Control<FormValues, object>;
  setValue: UseFormSetValue<FormValues>;
};

export const DoubleDateSelector = ({ control, setValue }: Props) => {
  return (
    <div
      style={{
        marginTop: '0.25rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          float: 'left',
        }}
      >
        <DateSelector name="startDate" control={control} setValue={setValue} />
      </div>

      <Typography
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5rem',
          margin: '0 1rem',
        }}
      >
        -
      </Typography>
      <div
        style={{
          float: 'right',
        }}
      >
        <DateSelector name="endDate" control={control} setValue={setValue} />
      </div>
    </div>
  );
};
