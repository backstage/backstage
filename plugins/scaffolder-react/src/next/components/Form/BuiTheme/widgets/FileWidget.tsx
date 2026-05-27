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
import { ChangeEvent, useCallback } from 'react';
import {
  ariaDescribedByIds,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from '@rjsf/utils';

function processFile(
  file: File,
): Promise<{ dataURL: string; name: string; size: number; type: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        dataURL: reader.result as string,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function processFiles(files: FileList): Promise<any> {
  return Promise.all(Array.from(files).map(processFile));
}

export default function FileWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>({
  id,
  readonly,
  disabled,
  required,
  multiple,
  onChange,
  options,
}: WidgetProps<T, S, F>) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || readonly || disabled) {
        return;
      }
      processFiles(event.target.files).then(filesInfo => {
        onChange(multiple ? filesInfo : filesInfo[0]);
      });
    },
    [multiple, readonly, disabled, onChange],
  );

  return (
    <input
      id={id}
      name={id}
      type="file"
      disabled={readonly || disabled}
      onChange={handleChange}
      defaultValue=""
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={options.autofocus as boolean}
      multiple={multiple}
      required={required}
      accept={options.accept as string | undefined}
      aria-describedby={ariaDescribedByIds<T>(id)}
    />
  );
}
