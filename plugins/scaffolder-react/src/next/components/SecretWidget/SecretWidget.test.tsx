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
import { render, screen, fireEvent } from '@testing-library/react';
import { useTemplateSecrets } from '@backstage/plugin-scaffolder-react';
import { SecretWidget } from './SecretWidget';

jest.mock('@backstage/plugin-scaffolder-react', () => ({
  useTemplateSecrets: jest.fn(),
}));

describe('SecretWidget', () => {
  const mockUseTemplateSecrets = useTemplateSecrets as jest.MockedFunction<
    typeof useTemplateSecrets
  >;

  beforeEach(() => {
    mockUseTemplateSecrets.mockReturnValue({
      setSecrets: jest.fn(),
      secrets: {},
    });
  });

  it('should render the label correctly', () => {
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: {
        $id: 'root_password',
      },
      idSeperator: '',
    };

    render(<SecretWidget {...props} />);

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should render the input field correctly', () => {
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: {
        $id: 'root_password',
      },
      idSeperator: '',
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets: jest.fn(),
      secrets: {
        password: 'mySecretPassword',
      },
    });

    render(<SecretWidget {...props} />);

    const input = screen.getByLabelText('Password') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
    expect(input).toHaveValue('mySecretPassword');
  });

  it('should render the input field correctly for nested fields', () => {
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: {
        $id: 'root_api_password',
      },
      idSeperator: undefined,
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets: jest.fn(),
      secrets: {
        api: {
          password: 'mySecretPassword',
        },
      },
    });

    render(<SecretWidget {...props} />);

    const input = screen.getByLabelText('Password') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
    expect(input).toHaveValue('mySecretPassword');
  });

  it('should render the input field correctly for array fields', () => {
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: {
        $id: 'root_apis_1_password',
      },
      idSeperator: undefined,
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets: jest.fn(),
      secrets: {
        apis: [
          undefined,
          {
            password: 'mySecretPassword',
          },
        ],
      } as any,
    });

    render(<SecretWidget {...props} />);

    const input = screen.getByLabelText('Password') as HTMLInputElement;

    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
    expect(input).toHaveValue('mySecretPassword');
  });

  it('should update the value and secrets when input value changes', () => {
    const setSecrets = jest.fn();
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: { $id: 'root_password' },
      idSeperator: '',
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets,
      secrets: {},
    });

    render(<SecretWidget {...props} />);

    const input = screen.getByLabelText('Password') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'mySecretPassword' } });

    expect(props.onChange).toHaveBeenCalledWith('****************');
    expect(setSecrets).toHaveBeenCalledWith({
      password: 'mySecretPassword',
    });
  });

  it('should update the value correctly for nested fields', () => {
    const setSecrets = jest.fn();
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: { $id: 'root_api_password' },
      idSeperator: undefined,
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets,
      secrets: {},
    });

    render(<SecretWidget {...props} />);

    const input = screen.getByLabelText('Password');
    fireEvent.change(input, { target: { value: 'mySecretPassword' } });

    expect(props.onChange).toHaveBeenCalledWith('****************');
    expect(setSecrets).toHaveBeenCalledWith({
      api: {
        password: 'mySecretPassword',
      },
    });
  });

  it('should update the value correctly for array fields', () => {
    const setSecrets = jest.fn();
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: { $id: 'root_apis_0_password' },
      idSeperator: undefined,
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets,
      secrets: {},
    });

    render(<SecretWidget {...props} />);
    const input = screen.getByLabelText('Password');
    fireEvent.change(input, { target: { value: 'mySecretPassword' } });

    expect(props.onChange).toHaveBeenCalledWith('****************');
    expect(setSecrets).toHaveBeenCalledWith({
      apis: [
        {
          password: 'mySecretPassword',
        },
      ],
    });
  });

  it('should update the value correctly for array fields at not zero index', () => {
    const setSecrets = jest.fn();
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: { $id: 'root_apis_2_password' },
      idSeperator: undefined,
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets,
      secrets: {
        apis: [
          {
            password: 'mySecretPassword',
          },
        ],
      } as any,
    });

    render(<SecretWidget {...props} />);
    const input = screen.getByLabelText('Password');
    fireEvent.change(input, { target: { value: 'mySecretPassword' } });

    expect(props.onChange).toHaveBeenCalledWith('****************');
    expect(setSecrets).toHaveBeenCalledWith({
      apis: [
        undefined,
        undefined,
        {
          password: 'mySecretPassword',
        },
      ],
    });
  });

  it('should display the current secret value', () => {
    const props = {
      name: 'password',
      onChange: jest.fn(),
      schema: { title: 'Password' },
      idSchema: {
        $id: 'root_password',
      },
      idSeperator: '',
    };
    mockUseTemplateSecrets.mockReturnValueOnce({
      setSecrets: jest.fn(),
      secrets: { password: 'mySecretPassword' },
    });

    render(<SecretWidget {...props} />);

    const input = screen.getByLabelText('Password');
    expect(input).toHaveValue('mySecretPassword');
  });
});
