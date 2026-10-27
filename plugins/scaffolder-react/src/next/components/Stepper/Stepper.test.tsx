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
import { Stepper, type StepperProps } from './Stepper';
import * as stepperUtils from './utils';

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  filterReviewState: jest.fn(jest.requireActual('./utils').filterReviewState),
}));

describe('Stepper', () => {
  it('defers hidden field filtering until review is displayed', async () => {
    const filter = jest.mocked(stepperUtils.filterReviewState);
    filter.mockClear();
    try {
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Deferred review',
              steps: [
                {
                  title: 'Choose',
                  schema: { properties: { action: { type: 'string' } } },
                },
                {
                  title: 'Hidden',
                  schema: {
                    'ui:backstage': {
                      visibleWhen: {
                        required: ['enabled'],
                        properties: { enabled: { const: true } },
                      },
                    },
                    properties: { password: { type: 'string' } },
                  },
                },
              ],
            }}
            extensions={[]}
            onCreate={jest.fn()}
          />
        </SecretsContextProvider>,
      );
      expect(filter).not.toHaveBeenCalled();
      fireEvent.change(screen.getByRole('textbox', { name: 'action' }), {
        target: { value: 'manage' },
      });
      expect(filter).not.toHaveBeenCalled();
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      await screen.findByRole('button', { name: 'Create' });
      expect(filter).toHaveBeenCalled();
    } finally {
      filter.mockClear();
    }
  });

  it.each(['default', 'custom state', 'custom step'])(
    'omits hidden values from %s review while retaining submitted values',
    async review => {
      const onCreate = jest.fn();
      const manifest: TemplateParameterSchema = {
        title: 'Sensitive steps',
        steps: [
          {
            title: 'Choose',
            schema: {
              dependencies: {
                enabled: {
                  oneOf: [
                    {
                      properties: {
                        enabled: { const: true },
                        password: {
                          type: 'string',
                          title: 'Retained credential',
                          'ui:widget': 'password',
                        },
                      },
                    },
                    { properties: { enabled: { const: false } } },
                  ],
                },
              },

              properties: {
                enabled: { type: 'boolean', title: 'Show credentials' },
                shared: { type: 'string' },
                connection: {
                  type: 'object',
                  properties: {
                    credentials: {
                      type: 'object',
                      properties: { username: { type: 'string' } },
                    },
                    servers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: { host: { type: 'string' } },
                      },
                    },
                  },
                },
                masked: {
                  type: 'string',
                  'ui:backstage': { review: { mask: 'Custom mask' } },
                },
                omitted: {
                  type: 'string',
                  'ui:backstage': { review: { show: false } },
                },
                visiblePassword: { type: 'string', 'ui:widget': 'password' },
              },
            },
          },
          {
            title: 'Credentials',
            schema: {
              'ui:backstage': {
                visibleWhen: { properties: { enabled: { const: true } } },
              },
              properties: {
                password: {
                  type: 'string',
                  title: 'Password',
                  'ui:widget': 'password',
                },
                shared: { type: 'string' },
                connection: {
                  type: 'object',
                  properties: {
                    credentials: {
                      type: 'object',
                      properties: {
                        password: { type: 'string', 'ui:widget': 'password' },
                        'private/key': { type: 'string' },
                      },
                    },
                    servers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          password: { type: 'string', 'ui:widget': 'password' },
                        },
                      },
                    },
                  },
                },
                hiddenMask: {
                  type: 'string',
                  'ui:backstage': { review: { mask: 'Hidden mask' } },
                },
                hiddenOmitted: {
                  type: 'string',
                  'ui:backstage': { review: { show: false } },
                },
              },
            },
          },
        ],
      };
      const initialState = {
        enabled: true,
        shared: 'shared-value',
        connection: {
          credentials: {
            username: 'retained-user',
            password: 'nested-password',
            'private/key': 'nested-private-key',
          },
          servers: [{ host: 'retained-host', password: 'array-password' }],
        },
        extra: 'extra-value',
        masked: 'masked-value',
        omitted: 'omitted-value',
        visiblePassword: 'visible-password',
        hiddenMask: 'hidden-mask-value',
        hiddenOmitted: 'hidden-omitted-value',
      };
      const components: Record<string, StepperProps['components']> = {
        default: {},
        'custom state': {
          ReviewStateComponent: ({ formState }) => (
            <pre>{JSON.stringify(formState)}</pre>
          ),
        },
        'custom step': {
          ReviewStepComponent: ({ formData, handleCreate }) => (
            <>
              <pre>{JSON.stringify(formData)}</pre>
              <button onClick={handleCreate}>Create</button>
            </>
          ),
        },
      };
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={manifest}
            initialState={initialState}
            extensions={[]}
            onCreate={onCreate}
            components={components[review]}
          />
        </SecretsContextProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.change(await screen.findByLabelText('Password'), {
        target: { value: 'hidden-password' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Back' }));
      fireEvent.click(
        await screen.findByRole('checkbox', { name: 'Show credentials' }),
      );
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      await screen.findByRole('button', { name: 'Create' });
      for (const value of [
        'nested-password',
        'nested-private-key',
        'array-password',
        'hidden-password',
        'hidden-mask-value',
        'hidden-omitted-value',
        'Hidden mask',
      ]) {
        expect(
          screen.queryByText(value, { exact: false }),
        ).not.toBeInTheDocument();
      }
      expect(
        screen.getByText('shared-value', { exact: false }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('extra-value', { exact: false }),
      ).toBeInTheDocument();
      for (const value of ['retained-user', 'retained-host']) {
        expect(screen.getByText(value, { exact: false })).toBeInTheDocument();
      }
      const displayedValues =
        review === 'default'
          ? ['Custom mask', '******']
          : ['masked-value', 'omitted-value', 'visible-password'];
      const absentValues =
        review === 'default'
          ? ['masked-value', 'omitted-value', 'visible-password']
          : ['Custom mask', '******'];
      for (const value of displayedValues) {
        expect(screen.getByText(value, { exact: false })).toBeInTheDocument();
      }
      for (const value of absentValues) {
        expect(
          screen.queryByText(value, { exact: false }),
        ).not.toBeInTheDocument();
      }
      fireEvent.click(screen.getByRole('button', { name: 'Create' }));
      await waitFor(() =>
        expect(onCreate).toHaveBeenCalledWith({
          ...initialState,
          enabled: false,
          password: 'hidden-password',
          connection: {
            credentials: {
              username: 'retained-user',
              password: 'nested-password',
              'private/key': 'nested-private-key',
            },
            servers: [{ host: 'retained-host', password: 'array-password' }],
          },
        }),
      );
    },
  );

  it.each([false, true])(
    'keeps the displayed cursor when an earlier step is revealed (self hiding: %s)',
    async selfHiding => {
      const condition = {
        required: ['enabled'],
        properties: { enabled: { const: true } },
      };
      const manifest: TemplateParameterSchema = {
        title: 'Cursor',
        steps: [
          {
            title: 'Earlier',
            schema: {
              'ui:backstage': { visibleWhen: condition },
              properties: selfHiding
                ? { enabled: { type: 'boolean' } }
                : { earlier: { type: 'string' } },
            },
          },
          {
            title: 'Current',
            schema: { properties: { enabled: { type: 'boolean' } } },
          },
        ],
      };
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={manifest}
            extensions={[]}
            initialState={{ enabled: selfHiding }}
            onCreate={jest.fn()}
          />
        </SecretsContextProvider>,
      );
      if (selfHiding) {
        fireEvent.click(screen.getByRole('checkbox', { name: 'enabled' }));
      }
      expect(
        screen.getByRole('button', { name: 'Review' }),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole('checkbox', { name: 'enabled' }));
      expect(
        screen.getByRole('button', { name: 'Review' }),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Back' }));
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    },
  );

  it('stays on review after the last step hides itself', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Review cursor',
      steps: [
        {
          title: 'Optional',
          schema: {
            'ui:backstage': {
              visibleWhen: { properties: { enabled: { const: true } } },
            },
            properties: { enabled: { type: 'boolean' } },
          },
        },
      ],
    };
    const { rerender } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          initialState={{ enabled: true }}
          extensions={[]}
          onCreate={jest.fn()}
        />
      </SecretsContextProvider>,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'enabled' }));
    expect(
      await screen.findByRole('button', { name: 'Create' }),
    ).toBeInTheDocument();
    const revealedManifest = {
      ...manifest,
      steps: [
        {
          title: 'Optional',
          schema: { properties: { enabled: { type: 'boolean' } } },
        },
      ],
    };
    rerender(
      <SecretsContextProvider>
        <Stepper
          manifest={revealedManifest}
          extensions={[]}
          onCreate={jest.fn()}
        />
      </SecretsContextProvider>,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('updates step visibility when earlier form data changes', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Changing steps',
      steps: [
        {
          title: 'Choose',
          schema: { properties: { action: { type: 'string' } } },
        },
        {
          title: 'Create configuration',
          schema: {
            'ui:backstage': {
              visibleWhen: {
                required: ['action'],
                properties: { action: { const: 'create' } },
              },
            },
            properties: { details: { type: 'string' } },
          },
        },
        { title: 'Finish', schema: { properties: {} } },
      ],
    };
    const { getByRole, queryByText, findByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );
    expect(queryByText('Create configuration')).not.toBeInTheDocument();
    fireEvent.change(getByRole('textbox', { name: 'action' }), {
      target: { value: 'create' },
    });
    fireEvent.click(getByRole('button', { name: 'Next' }));
    fireEvent.change(await findByRole('textbox', { name: 'details' }), {
      target: { value: 'Retained' },
    });
    fireEvent.click(getByRole('button', { name: 'Back' }));
    fireEvent.change(await findByRole('textbox', { name: 'action' }), {
      target: { value: 'manage' },
    });
    await waitFor(() =>
      expect(queryByText('Create configuration')).not.toBeInTheDocument(),
    );
    fireEvent.click(getByRole('button', { name: 'Next' }));
    expect(await findByRole('button', { name: 'Review' })).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: 'Back' }));
    fireEvent.change(await findByRole('textbox', { name: 'action' }), {
      target: { value: 'create' },
    });
    fireEvent.click(getByRole('button', { name: 'Next' }));
    expect(await findByRole('textbox', { name: 'details' })).toHaveValue(
      'Retained',
    );
  });

  it('skips conditional steps during navigation and validation', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Conditional steps',
      steps: [
        { title: 'Choose', schema: { type: 'object', properties: {} } },
        {
          title: 'Optional configuration',
          schema: {
            type: 'object',
            'ui:backstage': {
              visibleWhen: {
                required: ['enabled'],
                properties: { enabled: { const: true } },
              },
            },
            required: ['details'],
            properties: { details: { type: 'string' } },
          },
        },
        { title: 'Finish', schema: { type: 'object', properties: {} } },
      ],
    };
    const { getByRole, queryByText } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );
    expect(queryByText('Optional configuration')).not.toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: 'Next' }));
    await waitFor(() =>
      expect(getByRole('button', { name: 'Review' })).toBeInTheDocument(),
    );
    fireEvent.click(getByRole('button', { name: 'Back' }));
    await waitFor(() =>
      expect(getByRole('button', { name: 'Next' })).toBeInTheDocument(),
    );
  });

  it('shows conditional steps when their schema matches the form data', async () => {
    const manifest: TemplateParameterSchema = {
      title: 'Conditional steps',
      steps: [
        { title: 'Choose', schema: { properties: {} } },
        {
          title: 'Optional configuration',
          schema: {
            'ui:backstage': {
              visibleWhen: {
                required: ['enabled'],
                properties: { enabled: { const: true } },
              },
            },
            properties: { details: { type: 'string' } },
          },
        },
      ],
    };
    const { getByRole, getByText, findByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={manifest}
          initialState={{ enabled: true }}
          extensions={[]}
          onCreate={jest.fn()}
        />
      </SecretsContextProvider>,
    );
    expect(getByText('Optional configuration')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: 'Next' }));
    expect(
      await findByRole('textbox', { name: 'details' }),
    ).toBeInTheDocument();
  });

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

    const { getByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getByRole('textbox', { name: 'name' }), {
        target: { value: 'im a test value' },
      });
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Back' }));
    });

    expect(getByRole('textbox', { name: 'name' })).toHaveValue(
      'im a test value',
    );
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

    const { getByRole, getByLabelText } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getByRole('textbox', { name: 'name' }), {
        target: { value: 'im a test value' },
      });
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      fireEvent.click(getByLabelText('Step 1'));
    });

    expect(getByRole('textbox', { name: 'name' })).toHaveValue(
      'im a test value',
    );
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

    const { getByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} onCreate={onCreate} extensions={[]} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getByRole('textbox', { name: 'Foo - 1' }), {
        target: { value: 'value 1' },
      });
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    await act(async () => {
      fireEvent.change(getByRole('textbox', { name: 'Foo - 2' }), {
        target: { value: 'value 2' },
      });
      fireEvent.change(getByRole('textbox', { name: 'Bar - 2' }), {
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

    const { getByText, getByRole } = await renderInTestApp(
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
      fireEvent.change(getByRole('textbox', { name: 'postcode' }), {
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

    const { getByText, getByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    await act(async () => {
      fireEvent.change(getByRole('textbox', { name: 'postcode' }), {
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

    const { getByRole } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
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

    const { getByRole } = await renderInTestApp(
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

    expect(getByRole('textbox', { name: 'name' })).toHaveValue('Some Name');
    expect(getByRole('textbox', { name: 'name' })).toBeDisabled();
    expect(getByRole('textbox', { name: 'name' })).toHaveAttribute(
      'placeholder',
      'Enter your name',
    );

    expect(getByRole('spinbutton', { name: 'age' })).toHaveValue(40);
    expect(getByRole('spinbutton', { name: 'age' })).toBeEnabled();
    expect(getByRole('spinbutton', { name: 'age' })).toHaveAttribute(
      'placeholder',
      'Enter your age',
    );
  });

  it('should scroll the window to top on step change when there is no <main> element', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        { title: 'Step 1', schema: { properties: {} } },
        { title: 'Step 2', schema: { properties: {} } },
      ],
      title: 'Scroll Test (no main)',
    };

    // Apps on the new frontend system render no <main> element. With none
    // present, the Stepper should fall back to scrolling the window.
    // (jsdom does not implement window.scrollTo, so we stub it.)
    const scrollToSpy = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    const { getByRole, unmount } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    scrollToSpy.mockClear();
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    scrollToSpy.mockRestore();
    unmount();
  });

  it('should scroll the nearest scrollable ancestor to top when activeStep changes', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        { title: 'Step 1', schema: { properties: {} } },
        { title: 'Step 2', schema: { properties: {} } },
      ],
      title: 'Scroll Test',
    };

    const windowScrollSpy = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    const { getByRole, container, unmount } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    const scrollableAncestor = container as HTMLElement;
    const scrollToMock = jest.fn();
    scrollableAncestor.scrollTo = scrollToMock;
    scrollableAncestor.style.overflowY = 'auto';
    Object.defineProperty(scrollableAncestor, 'scrollHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(scrollableAncestor, 'clientHeight', {
      configurable: true,
      value: 500,
    });

    windowScrollSpy.mockClear();
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    expect(windowScrollSpy).not.toHaveBeenCalled();

    windowScrollSpy.mockRestore();
    unmount();
  });

  it('should scroll the window when a non-scrollable <main> exists', async () => {
    const manifest: TemplateParameterSchema = {
      steps: [
        { title: 'Step 1', schema: { properties: {} } },
        { title: 'Step 2', schema: { properties: {} } },
      ],
      title: 'Scroll Test (non-scrollable main)',
    };

    const main = document.createElement('main');
    document.body.appendChild(main);
    const mainScrollTo = jest.fn();
    main.scrollTo = mainScrollTo;

    const windowScrollSpy = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => {});

    const { getByRole, unmount } = await renderInTestApp(
      <SecretsContextProvider>
        <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
      </SecretsContextProvider>,
    );

    // Ignore the initial mount effect call; only measure the step change.
    windowScrollSpy.mockClear();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'Next' }));
    });

    expect(mainScrollTo).not.toHaveBeenCalled();
    expect(windowScrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });

    windowScrollSpy.mockRestore();
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

      const { getByText, getByRole } = await renderInTestApp(
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
      expect(getByRole('textbox', { name: 'field1' })).toBeInTheDocument();
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
});
