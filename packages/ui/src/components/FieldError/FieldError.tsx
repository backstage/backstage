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
import { FieldError as AriaFieldError } from 'react-aria-components';
import type { FieldErrorProps } from './types';
import { useDefinition } from '../../hooks/useDefinition';
import { FieldErrorDefinition } from './definition';

/** @public */
export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(
  (props: FieldErrorProps, ref) => {
    const { ownProps, restProps } = useDefinition(FieldErrorDefinition, props);
    const { classes } = ownProps;

    return <AriaFieldError className={classes.root} ref={ref} {...restProps} />;
  },
);

FieldError.displayName = 'FieldError';
