/*
 * Copyright 2022 The Backstage Authors
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
import { TemplateParameterSchema } from '../../../types';
import { Stepper } from './Stepper';
import { renderInTestApp } from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import type { RJSFValidationError } from '@rjsf/utils';
import { JsonValue } from '@backstage/types';
import { NextFieldExtensionComponentProps } from '../../../extensions';
import { LayoutTemplate } from '../../../layouts';

describe('Stepper', () => {
  it('should render the step titles for each step of the manifest', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        { title: 'Step 1', schema: { properties: {} } },
        { title: 'Step 2', schema: { properties: {} } },
      ],
      title: 'React JSON Schema Form Test',
    };

    const { getByText } = await renderInTestApp(
      <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />,
    );

    for (const step of manifest.steps) {
      expect(getByText(step.title)).toBeInTheDocument();
    }
  });

  it('should render next / review button', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        { title: 'Step 1', schema: { properties: {} } },
        { title: 'Step 2', schema: { properties: {} } },
      ],
      title: 'React JSON Schema Form Test',
    };

    const { getByRole } = await renderInTestApp(
      <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />,
    );

    expect(getByRole('button', { name: 'Next' })).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    expect(getByRole('button', { name: 'Review' })).toBeInTheDocument();
  });

  it('should remember the state of the form when cycling through the pages', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
        {
          title: 'Step 2',
          schema: {
            properties: {
              description: {
                type: 'string',
              },
            },
          },
        },
      ],
      title: 'React JSON Schema Form Test',
    };

    const { getByRole } = await renderInTestApp(
      <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />,
    );

    await fireEvent.change(getByRole('textbox', { name: 'name' }), {
      target: { value: 'im a test value' },
    });

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Back' }));
    });

    expect(getByRole('textbox', { name: 'name' })).toHaveValue(
      'im a test value',
    );
  });

  it('should merge nested formData correctly in multiple steps', async () => {
    const Repo = ({
      onChange,
    }: NextFieldExtensionComponentProps<{ repository: string }, any>) => (
      <input
        aria-label="repo"
        type="text"
        onChange={e => onChange({ repository: e.target.value })}
        defaultValue=""
      />
    );

    const Owner = ({
      onChange,
    }: NextFieldExtensionComponentProps<{ owner: string }, any>) => (
      <input
        aria-label="owner"
        type="text"
        onChange={e => onChange({ owner: e.target.value })}
        defaultValue=""
      />
    );

    const manifest: TemplateParameterSchema = {
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              first: {
                type: 'object',
                'ui:field': 'Repo',
              },
            },
          },
        },
        {
          title: 'Step 2',
          schema: {
            properties: {
              second: {
                type: 'object',
                'ui:field': 'Owner',
              },
            },
          },
        },
      ],
      title: 'React JSON Schema Form Test',
    };

    const onCreate = jest.fn(async (values: Record<string, JsonValue>) => {
      expect(values).toEqual({
        first: { repository: 'Repo' },
        second: { owner: 'Owner' },
      });
    });

    const { getByRole } = await renderInTestApp(
      <Stepper
        manifest={manifest}
        onCreate={onCreate}
        extensions={[
          { name: 'Repo', component: Repo },
          { name: 'Owner', component: Owner },
        ]}
      />,
    );

    await fireEvent.change(getByRole('textbox', { name: 'repo' }), {
      target: { value: 'Repo' },
    });

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await fireEvent.change(getByRole('textbox', { name: 'owner' }), {
      target: { value: 'Owner' },
    });

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Create' }));
    });

    expect(onCreate).toHaveBeenCalled();
  });

  it('should render custom field extensions properly', async () => {
    const MockComponent = () => {
      return <h1>im a custom field extension</h1>;
    };

    const manifest: TemplateParameterSchema = {
      title: 'Custom Fields',
      steps: [
        {
          title: 'Test',
          schema: {
            properties: {
              name: {
                type: 'string',
                'ui:field': 'Mock',
              },
            },
          },
        },
      ],
    };

    const { getByText } = await renderInTestApp(
      <Stepper
        manifest={manifest}
        extensions={[{ name: 'Mock', component: MockComponent }]}
        onCreate={jest.fn()}
      />,
    );

    expect(getByText('im a custom field extension')).toBeInTheDocument();
  });

  it('should disable the form with progress when async validators are running', async () => {
    const MockComponent = () => {
      return <h1>im a custom field extension</h1>;
    };

    const manifest: TemplateParameterSchema = {
      title: 'Custom Fields',
      steps: [
        {
          title: 'Test',
          schema: {
            properties: {
              name: {
                type: 'string',
                'ui:field': 'Mock',
              },
            },
          },
        },
      ],
    };

    const { getByRole } = await renderInTestApp(
      <Stepper
        manifest={manifest}
        extensions={[
          {
            name: 'Mock',
            component: MockComponent,
            validation: async () => new Promise(r => setTimeout(r, 1000)),
          },
        ]}
        onCreate={jest.fn()}
      />,
    );

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Review' }));

      expect(getByRole('progressbar')).toBeInTheDocument();
      expect(getByRole('button', { name: 'Review' })).toBeDisabled();
    });
  });

  it('should transform default error message', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              postcode: {
                type: 'string',
                pattern: '[A-Z][0-9][A-Z] [0-9][A-Z][0-9]',
              },
            },
          },
        },
      ],
      title: 'transformErrors Form Test',
    };

    const transformErrors = (errors: RJSFValidationError[]) => {
      return errors.map(err =>
        err.property === '.postcode'
          ? { ...err, message: 'invalid postcode' }
          : err,
      );
    };

    const { getByText, getByRole } = await renderInTestApp(
      <Stepper
        manifest={manifest}
        extensions={[]}
        onCreate={jest.fn()}
        FormProps={{ transformErrors }}
      />,
    );

    await fireEvent.change(getByRole('textbox', { name: 'postcode' }), {
      target: { value: 'invalid' },
    });

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    expect(getByText('invalid postcode')).toBeInTheDocument();
  });

  it('should grab the initial formData from the query', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              firstName: {
                type: 'string',
              },
            },
          },
        },
      ],
      title: 'initialize formData',
    };

    const mockFormData = { firstName: 'John' };

    Object.defineProperty(window, 'location', {
      value: {
        search: `?formData=${JSON.stringify(mockFormData)}`,
      },
    });

    const { getByRole } = await renderInTestApp(
      <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />,
    );

    expect(getByRole('textbox', { name: 'firstName' })).toHaveValue('John');
  });

  it('should initialize formState with undefined form values', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              firstName: {
                type: 'string',
              },
            },
          },
        },
      ],
      title: 'initialize formData',
    };

    const onCreate = jest.fn(async (values: Record<string, JsonValue>) => {
      expect(values).toHaveProperty('firstName');
    });

    const { getByRole } = await renderInTestApp(
      <Stepper manifest={manifest} extensions={[]} onCreate={onCreate} />,
    );

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    expect(getByRole('button', { name: 'Create' })).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Create' }));
    });

    // flush promises
    return new Promise(process.nextTick);
  });

  it('should override the Create and Review button text', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Custom Fields',
      steps: [
        {
          title: 'Test',
          schema: {
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
      ],
    };

    const { getByRole } = await renderInTestApp(
      <Stepper
        manifest={manifest}
        onCreate={jest.fn()}
        extensions={[]}
        components={{
          createButtonText: <b>Make</b>,
          reviewButtonText: <i>Inspect</i>,
        }}
      />,
    );

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Inspect' }));
    });

    expect(getByRole('button', { name: 'Make' })).toBeInTheDocument();

    await act(async () => {
      await fireEvent.click(getByRole('button', { name: 'Make' }));
    });
  });

  describe('Scaffolder Layouts', () => {
    it('should render the step in the scaffolder layout', async () => {
      const ScaffolderLayout: LayoutTemplate = ({ properties }) => (
        <>
          <h1>A Scaffolder Layout</h1>
          {properties.map((prop, i) => (
            <div key={i}>{prop.content}</div>
          ))}
        </>
      );

      const manifest: TemplateParameterSchema = {
        steps: [
          {
            title: 'Step 1',
            schema: {
              type: 'object',
              'ui:ObjectFieldTemplate': 'Layout',
              properties: {
                field1: {
                  type: 'string',
                },
              },
            },
          },
        ],
        title: 'scaffolder layouts',
      };

      const { getByText, getByRole } = await renderInTestApp(
        <Stepper
          manifest={manifest}
          extensions={[]}
          onCreate={jest.fn()}
          layouts={[{ name: 'Layout', component: ScaffolderLayout }]}
        />,
      );

      expect(getByText('A Scaffolder Layout')).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'field1' })).toBeInTheDocument();
    });
  });
});
