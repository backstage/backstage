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

import { FieldProps, FieldValidation } from '@rjsf/core';
import { ApiHolder } from '@backstage/core-plugin-api';
import { FieldExtensionOptions } from '../../../extensions/types';

type validatorType = (
    value?: string,
    validation?: FieldValidation,
    context?: { apiHolder: ApiHolder },
) => void;

const customComponents: FieldExtensionOptions<any>[] = [];

/**
 * @description Register your custom UI Component!
 * @param name Name of the component
 * @param component The Component itself!
 * @param validation Any validations
 * @returns void
 */
export function register(name: string, component: (props: FieldProps<any>) => JSX.Element | null, validation: validatorType = () => {}) {
    customComponents.push({
        name,
        component,
        validation
    });
}

/**
 * @returns List of all the custom components
 */
export function list() : FieldExtensionOptions<any>[] {
    return customComponents;
}