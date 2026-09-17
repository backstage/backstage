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
import {
  FormContextType,
  RegistryWidgetsType,
  RJSFSchema,
  StrictRJSFSchema,
} from '@rjsf/utils';

import BaseInputTemplate from './BaseInputTemplate';
import CheckboxWidget from './CheckboxWidget';
import CheckboxesWidget from './CheckboxesWidget';
import ColorWidget from './ColorWidget';
import DateWidget from './DateWidget';
import DateTimeWidget from './DateTimeWidget';
import EmailWidget from './EmailWidget';
import FileWidget from './FileWidget';
import HiddenWidget from './HiddenWidget';
import PasswordWidget from './PasswordWidget';
import RadioWidget from './RadioWidget';
import RangeWidget from './RangeWidget';
import SelectWidget from './SelectWidget';
import TextareaWidget from './TextareaWidget';
import TextWidget from './TextWidget';
import TimeWidget from './TimeWidget';
import URLWidget from './URLWidget';

export function generateBuiWidgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): RegistryWidgetsType<T, S, F> {
  return {
    BaseInput: BaseInputTemplate,
    CheckboxWidget,
    CheckboxesWidget,
    ColorWidget,
    DateWidget,
    DateTimeWidget,
    EmailWidget,
    FileWidget,
    HiddenWidget,
    PasswordWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    TextareaWidget,
    TextWidget,
    TimeWidget,
    URLWidget,
  };
}
