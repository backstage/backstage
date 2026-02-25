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
import preview from '../../../../../.storybook/preview';
import { TextField, Input, Form } from 'react-aria-components';
import { FieldError } from './FieldError';

const meta = preview.meta({
  title: 'Backstage UI/FieldError',
  component: FieldError,
});

// Show error with server validation using Form component
export const WithServerValidation = meta.story({
  render: () => (
    <Form validationErrors={{ demo: 'This is a server validation error.' }}>
      <TextField
        name="demo"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Input />
        <FieldError />
      </TextField>
    </Form>
  ),
});

// Show error using children
export const WithCustomMessage = meta.story({
  render: () => (
    <TextField
      isInvalid
      validationBehavior="aria"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Input />
      <FieldError>This is a custom error message.</FieldError>
    </TextField>
  ),
});

// Show error with render prop function
export const WithRenderProp = meta.story({
  render: () => (
    <TextField
      isInvalid
      validationBehavior="aria"
      validate={() => 'This field is invalid'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Input />
      <FieldError>
        {({ validationErrors }) =>
          validationErrors.length > 0 ? validationErrors[0] : 'Field is invalid'
        }
      </FieldError>
    </TextField>
  ),
});
