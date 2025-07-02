/*
 * Copyright 2025 The Backstage Authors
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

import { forwardRef } from 'react';
import {
  FieldError as AriaFieldError,
  type FieldErrorProps,
} from 'react-aria-components';
import clsx from 'clsx';

/** @public */
export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(
  (props: FieldErrorProps, ref) => {
    const { className, ...rest } = props;

    return (
      <AriaFieldError
        className={clsx('canon-FieldError', className)}
        ref={ref}
        {...rest}
      />
    );
  },
);

FieldError.displayName = 'FieldError';
