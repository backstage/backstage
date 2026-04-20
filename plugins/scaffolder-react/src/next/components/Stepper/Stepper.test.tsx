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
import { renderInTestApp } from '@backstage/test-utils';
import { JsonValue } from '@backstage/types';
import type { RJSFValidationError } from '@rjsf/utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useEffect } from 'react';

import { FieldExtensionComponentProps } from '../../../extensions';
import { LayoutTemplate } from '../../../layouts';
import { SecretsContextProvider } from '../../../secrets';
import { TemplateParameterSchema } from '../../../types';
import { Stepper } from './Stepper';

/**
 * Helper to find RJSF form inputs by their field name.
 * RJSF generates input ids in the format "root_fieldName".
 * Needed because the headless RJSF widgets (withTheme({})) render
 * plain HTML inputs without associated <label> elements, so
 * getByRole('textbox', { name }) cannot resolve the accessible name.
 */
function getFormInput(
  container: HTMLElement,
  fieldName: string,
): HTMLInputElement {
  const el = container.querySelector<HTMLInputElement>(`#root_${fieldName}`);
  if (!el) {
    throw new Error(`Could not find form input with id "root_${fieldName}"`);
  }
  return el;
}

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
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
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
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    expect(getByRole('button', { name: 'Next' })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Next' }));
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

    const { getByRole, container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getFormInput(container, 'name'), {
        target: { value: 'im a test value' },
      });
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Back' }));
    });

    expect(getFormInput(container, 'name')).toHaveValue('im a test value');
  });

  it('should remember the state of the form when cycling through the pages by directly clicking on the step labels', async () => {
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

    const { getByRole, getByLabelText, container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getFormInput(container, 'name'), {
        target: { value: 'im a test value' },
      });
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      fireEvent.click(getByLabelText('Step 1'));
    });

    expect(getFormInput(container, 'name')).toHaveValue('im a test value');
  });

  // This test is currently broken, and needs rethinking how we fix this.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should omit properties that are no longer pertinent to the current step', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Conditional Input Form',
      steps: [
        {
          title: 'Conditional Input step',
          schema: {
            type: 'object',
            properties: {
              moreInfo: {
                type: 'boolean',
                title: 'More info',
              },
            },
            dependencies: {
              moreInfo: {
                oneOf: [
                  {
                    properties: {
                      moreInfo: {
                        const: true,
                      },
                      description: {
                        type: 'string',
                        title: 'Description',
                      },
                    },
                    required: ['description'],
                  },
                  {
                    properties: {
                      moreInfo: {
                        not: {
                          const: true,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    };

    const onCreate = jest.fn();

    const { getByRole, queryByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          onCreate={onCreate}
          extensions={[]}
          formProps={{ omitExtraData: true, liveOmit: true }}
        />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.click(getByRole('checkbox', { name: 'More info' }));
      fireEvent.change(getByRole('textbox', { name: 'Description' }), {
        target: { value: 'My Test Description' },
      });
      fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    expect(
      getByRole('cell', { name: 'My Test Description' }),
    ).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Back' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox', { name: 'More info' }));
      fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    expect(
      queryByRole('cell', { name: 'My Test Description' }),
    ).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Create' }));
    });

    expect(onCreate).toHaveBeenCalledWith({ moreInfo: false });
  });

  it('should merge and overwrite nested formData correctly', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              foo: {
                type: 'string',
                title: 'Foo - 1',
              },
            },
          },
        },
        {
          title: 'Step 2',
          schema: {
            properties: {
              foo: {
                type: 'string',
                title: 'Foo - 2',
              },
              bar: {
                type: 'string',
                title: 'Bar - 2',
              },
            },
          },
        },
      ],
      title: 'React JSON Schema Form Test',
    };

    const onCreate = jest.fn();

    const { getByRole, container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} onCreate={onCreate} extensions={[]} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getFormInput(container, 'foo'), {
        target: { value: 'value 1' },
      });
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      fireEvent.change(getFormInput(container, 'foo'), {
        target: { value: 'value 2' },
      });
      fireEvent.change(getFormInput(container, 'bar'), {
        target: { value: 'value 2' },
      });
      fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Create' }));
    });

    expect(onCreate).toHaveBeenCalledWith({
      foo: 'value 2',
      bar: 'value 2',
    });
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
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          extensions={[{ name: 'Mock', component: MockComponent }]}
          onCreate={jest.fn()}
        />
      </SecretsContextProvider>,
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
      <SecretsContextProvider>
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
        />
      </SecretsContextProvider>,
    );
    fireEvent.click(getByRole('button', { name: 'Review' }));
    await waitFor(() => {
      expect(getByRole('progressbar')).toBeInTheDocument(); // Check if progress bar is rendered
      expect(getByRole('button', { name: 'Review' })).toBeDisabled(); // Check if the button is disabled
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

    const { getByText, getByRole, container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          extensions={[]}
          onCreate={jest.fn()}
          formProps={{ transformErrors }}
        />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getFormInput(container, 'postcode'), {
        target: { value: 'invalid' },
      });
      fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    expect(getByText('invalid postcode')).toBeInTheDocument();
  });

  it('should render ajv-errors message', async () => {
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
            errorMessage: {
              properties: {
                postcode: 'invalid postcode',
              },
            },
          },
        },
      ],
      title: 'transformErrors Form Test',
    };

    const { getByText, getByRole, container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getFormInput(container, 'postcode'), {
        target: { value: 'invalid' },
      });

      fireEvent.click(getByRole('button', { name: 'Review' }));
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

    // Use history.replaceState to set the query string (jsdom 27 doesn't allow redefining window.location)
    window.history.replaceState(
      {},
      '',
      `?formData=${JSON.stringify(mockFormData)}`,
    );

    const { container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    expect(getFormInput(container, 'firstName')).toHaveValue('John');
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
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={onCreate} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Review' }));
    });

    expect(getByRole('button', { name: 'Create' })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Create' }));
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
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          onCreate={jest.fn()}
          extensions={[]}
          components={{
            createButtonText: <b>Make</b>,
            reviewButtonText: <i>Inspect</i>,
          }}
        />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Inspect' }));
    });

    expect(getByRole('button', { name: 'Make' })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Make' }));
    });
  });

  it('should allow overrides to the uiSchema and formContext correctly', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Custom Fields',
      steps: [
        {
          title: 'Test',
          schema: {
            properties: {
              name: {
                type: 'string',
                'ui:placeholder': 'Enter your name',
              },
              age: {
                type: 'number',
                'ui:placeholder': 'Enter your age',
              },
            },
          },
        },
      ],
    };

    const uiSchema = {
      name: {
        'ui:readonly': true,
        'ui:placeholder': 'Should be overwritten',
      },
    };

    const formContext = {
      readOnlyAsDisabled: true,
    };

    const { container } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          onCreate={jest.fn()}
          extensions={[]}
          formProps={{ uiSchema, formContext }}
          initialState={{ name: 'Some Name', age: 40 }}
        />
      </SecretsContextProvider>,
    );

    const nameInput = getFormInput(container, 'name');
    expect(nameInput).toHaveValue('Some Name');
    // With MuiTheme, readOnlyAsDisabled: true in formContext causes ui:readonly
    // fields to render as disabled rather than using the HTML readonly attribute
    expect(nameInput).toBeDisabled();
    expect(nameInput).toHaveAttribute('placeholder', 'Enter your name');

    const ageInput = getFormInput(container, 'age');
    expect(ageInput).toHaveValue(40);
    expect(ageInput).toBeEnabled();
    expect(ageInput).toHaveAttribute('placeholder', 'Enter your age');
  });

  it('should scroll the first main element to top when activeStep changes', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        { title: 'Step 1', schema: { properties: {} } },
        { title: 'Step 2', schema: { properties: {} } },
      ],
      title: 'Scroll Test',
    };

    // Render a main element in the document for the Stepper to find
    const main = document.createElement('main');
    document.body.appendChild(main);
    const scrollToMock = jest.fn();
    main.scrollTo = scrollToMock;

    // Render Stepper as usual (do not pass container)
    const { getByRole, unmount } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    // Click next to change the activeStep
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    // Clean up
    document.body.removeChild(main);
    unmount();
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

      const { getByText, container } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={manifest}
            extensions={[]}
            onCreate={jest.fn()}
            layouts={[{ name: 'Layout', component: ScaffolderLayout }]}
          />
        </SecretsContextProvider>,
      );

      expect(getByText('A Scaffolder Layout')).toBeInTheDocument();
      expect(getFormInput(container, 'field1')).toBeInTheDocument();
    });
  });

  describe('state tracking', () => {
    it('should render perfectly when using field extensions that may do some strange things', async () => {
      const FieldExtension = ({
        formData,
        onChange,
      }: FieldExtensionComponentProps<{ repoOrg?: string }>) => {
        useEffect(() => {
          if (!formData?.repoOrg) onChange({ repoOrg: 'backstage' });
        }, [formData, onChange]);

        return (
          <>
            Some field
            <input
              type="text"
              value={formData?.repoOrg ?? ''}
              onChange={e => onChange({ repoOrg: e.target.value })}
            />
          </>
        );
      };

      const manifest: TemplateParameterSchema = {
        title: 'Custom Fields',
        steps: [
          {
            title: 'Test',
            schema: {
              properties: {
                thing: {
                  type: 'object',
                  'ui:field': 'FieldExtension',
                  properties: {
                    repoOrg: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        ],
      };

      // `onCreate` must be async to mock the submit button disabled behavior
      const onCreate = jest.fn(
        () => new Promise<void>(resolve => setTimeout(resolve, 0)),
      );

      const { getByRole } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={manifest}
            onCreate={onCreate}
            extensions={[
              {
                name: 'FieldExtension',
                component: FieldExtension,
              },
            ]}
          />
        </SecretsContextProvider>,
      );

      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'Review' }));
      });

      fireEvent.click(getByRole('button', { name: 'Create' }));

      await waitFor(() =>
        expect(getByRole('button', { name: 'Create' })).toBeDisabled(),
      );

      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'Create' }));
      });

      expect(onCreate).toHaveBeenCalledTimes(1);

      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          thing: { repoOrg: 'backstage' },
        }),
      );
    });
  });

  describe('Cascading/Dynamic Forms', () => {
    it('should show conditional fields when if/then/else condition is met', async () => {
      const manifest: TemplateParameterSchema = {
        steps: [
          {
            title: 'Conditional Step',
            schema: {
              type: 'object',
              properties: {
                enableAdvanced: {
                  type: 'boolean',
                  title: 'Enable Advanced Options',
                  default: false,
                },
              },
              if: {
                properties: { enableAdvanced: { const: true } },
              },
              then: {
                properties: {
                  advancedSetting: {
                    type: 'string',
                    title: 'Advanced Setting',
                  },
                },
              },
            },
          },
        ],
        title: 'Conditional Test',
      };

      const { getByLabelText, queryByLabelText } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      // Initially, the conditional field should not be visible (enableAdvanced is false by default)
      expect(queryByLabelText('Advanced Setting')).not.toBeInTheDocument();

      // Toggle the boolean field to true
      await act(async () => {
        fireEvent.click(getByLabelText('Enable Advanced Options'));
      });

      // The conditional field should now be visible
      await waitFor(() => {
        expect(queryByLabelText('Advanced Setting')).toBeInTheDocument();
      });
    });

    it('should preserve form values when conditional fields unmount and remount', async () => {
      const manifest: TemplateParameterSchema = {
        steps: [
          {
            title: 'Preservation Step',
            schema: {
              type: 'object',
              properties: {
                enableAdvanced: {
                  type: 'boolean',
                  title: 'Enable Advanced Options',
                  default: false,
                },
              },
              if: {
                properties: { enableAdvanced: { const: true } },
              },
              then: {
                properties: {
                  advancedSetting: {
                    type: 'string',
                    title: 'Advanced Setting',
                  },
                },
              },
            },
          },
        ],
        title: 'Value Preservation Test',
      };

      const { getByLabelText, queryByLabelText } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      // Step 1: Enable advanced, fill in the conditional field
      await act(async () => {
        fireEvent.click(getByLabelText('Enable Advanced Options'));
      });

      await waitFor(() => {
        expect(queryByLabelText('Advanced Setting')).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.change(getByLabelText('Advanced Setting'), {
          target: { value: 'my-advanced-value' },
        });
      });

      // Step 2: Disable advanced (conditional field unmounts)
      await act(async () => {
        fireEvent.click(getByLabelText('Enable Advanced Options'));
      });

      await waitFor(() => {
        expect(queryByLabelText('Advanced Setting')).not.toBeInTheDocument();
      });

      // Step 3: Re-enable advanced (conditional field remounts)
      await act(async () => {
        fireEvent.click(getByLabelText('Enable Advanced Options'));
      });

      // The previously entered value should be restored
      await waitFor(() => {
        const advancedField = queryByLabelText('Advanced Setting');
        expect(advancedField).toBeInTheDocument();
        expect(advancedField).toHaveValue('my-advanced-value');
      });
    });

    it('should show dependent fields based on dependencies schema keyword', async () => {
      const manifest: TemplateParameterSchema = {
        steps: [
          {
            title: 'Dependencies Step',
            schema: {
              type: 'object',
              properties: {
                cloudProvider: {
                  type: 'string',
                  title: 'Cloud Provider',
                  enum: ['AWS', 'GCP'],
                },
              },
              dependencies: {
                cloudProvider: {
                  oneOf: [
                    {
                      properties: {
                        cloudProvider: { enum: ['AWS'] },
                        awsRegion: {
                          type: 'string',
                          title: 'AWS Region',
                          enum: ['us-east-1', 'us-west-2'],
                        },
                      },
                    },
                    {
                      properties: {
                        cloudProvider: { enum: ['GCP'] },
                        gcpRegion: {
                          type: 'string',
                          title: 'GCP Region',
                          enum: ['us-central1', 'europe-west1'],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
        title: 'Dependencies Test',
      };

      const { getByLabelText, queryByLabelText } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      // Select AWS as cloud provider via MUI Select interaction:
      // MuiTheme renders enum fields as MUI Select (div[role="button"]),
      // not native <select>, so use mouseDown to open + click on option.
      await act(async () => {
        fireEvent.mouseDown(getByLabelText('Cloud Provider'));
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('option', { name: 'AWS' }));
      });

      // AWS-specific region field should appear
      await waitFor(() => {
        expect(queryByLabelText('AWS Region')).toBeInTheDocument();
      });
      expect(queryByLabelText('GCP Region')).not.toBeInTheDocument();

      // Switch to GCP
      await act(async () => {
        fireEvent.mouseDown(getByLabelText('Cloud Provider'));
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('option', { name: 'GCP' }));
      });

      // GCP-specific region field should appear, AWS should disappear
      await waitFor(() => {
        expect(queryByLabelText('GCP Region')).toBeInTheDocument();
      });
      expect(queryByLabelText('AWS Region')).not.toBeInTheDocument();
    });
  });
});
