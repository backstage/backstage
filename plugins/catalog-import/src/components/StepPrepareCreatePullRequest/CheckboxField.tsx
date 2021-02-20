/*
 * Copyright 2021 Spotify AB
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

import { Checkbox, FormControlLabel, FormHelperText } from '@material-ui/core';
import React from 'react';

type Props<TFieldValue extends string> = {
  name: TFieldValue;
  label: React.ReactNode;
  inputRef:
    | ((instance: HTMLInputElement | null) => void)
    | React.RefObject<HTMLInputElement>
    | null
    | undefined;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void;
  helperText?: React.ReactNode | string;
};

export const CheckboxField = <TFieldValue extends string>({
  name,
  label,
  inputRef,
  onChange,
  helperText,
}: Props<TFieldValue>) => {
  return (
    <>
      <FormControlLabel
        control={
          <Checkbox name={name} inputRef={inputRef} onChange={onChange} />
        }
        label={label}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </>
  );
};
