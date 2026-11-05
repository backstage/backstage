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
import { JsonObject, JsonValue } from '@backstage/types';
import type { FieldValidation, RJSFValidationError } from '@rjsf/utils';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';

import { FieldExtensionComponentProps } from '../../../extensions';
import { LayoutTemplate } from '../../../layouts';
import { SecretsContextProvider } from '../../../secrets';
import { TemplateParameterSchema } from '../../../types';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  async function renderSynchronizedField(staleFailure = false) {
    const user = userEvent.setup();
    const onCreate = jest.fn();
    let finishFirst!: () => void;
    let finishSecond!: () => void;
    const first = new Promise<void>(resolve => {
      finishFirst = resolve;
    });
    const second = new Promise<void>(resolve => {
      finishSecond = resolve;
    });
    const validate = jest
      .fn()
      .mockImplementationOnce(async (_value, errors) => {
        await first;
        if (staleFailure) errors.addError('Stale failure');
      })
      .mockImplementationOnce(async () => {
        await second;
      });
    const Sync = ({
      formData,
      onChange,
    }: FieldExtensionComponentProps<string>) => (
      <>
        <input
          aria-label="Synchronized value"
          value={formData ?? ''}
          onChange={event => onChange(event.target.value)}
        />
        <button type="button" onClick={() => onChange(formData)}>
          Synchronize
        </button>
        <button
          type="button"
          onClick={() => {
            onChange('temporary');
            onChange(formData);
          }}
        >
          Edit and restore
        </button>
      </>
    );
    await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={{
            title: 'Synchronization',
            steps: [
              {
                title: 'Value',
                schema: {
                  properties: { value: { type: 'string', 'ui:field': 'Sync' } },
                },
              },
            ],
          }}
          initialState={{ value: 'original' }}
          extensions={[{ name: 'Sync', component: Sync, validation: validate }]}
          onCreate={onCreate}
        />
      </SecretsContextProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Review' }));
    await screen.findByRole('progressbar');
    return {
      user,
      onCreate,
      validate,
      first,
      second,
      finishFirst,
      finishSecond,
    };
  }

  it('continues validation after a synchronization with no effective change', async () => {
    const { user, onCreate, validate, first, finishFirst } =
      await renderSynchronizedField();
    await user.click(screen.getByRole('button', { name: 'Synchronize' }));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(validate).toHaveBeenCalledTimes(1);
    await act(async () => {
      finishFirst();
      await first;
    });
    await user.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({ value: 'original' }),
    );
    expect(validate).toHaveBeenCalledTimes(1);
  });

  it('keeps the last value when a field edits and restores it in the same event', async () => {
    const { user, onCreate, first, second, finishFirst, finishSecond } =
      await renderSynchronizedField();
    await user.click(screen.getByRole('button', { name: 'Edit and restore' }));
    expect(
      screen.getByRole('textbox', { name: 'Synchronized value' }),
    ).toHaveValue('original');
    expect(
      await screen.findByText(/form changed during validation/),
    ).toBeInTheDocument();
    await act(async () => {
      finishFirst();
      await first;
    });
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Review' }));
    await act(async () => {
      finishSecond();
      await second;
    });
    await user.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({ value: 'original' }),
    );
  });

  it('preserves edits and ignores a late result while a newer validation runs', async () => {
    const {
      user,
      onCreate,
      validate,
      first,
      second,
      finishFirst,
      finishSecond,
    } = await renderSynchronizedField(true);
    await user.type(
      screen.getByRole('textbox', { name: 'Synchronized value' }),
      '-edited',
    );
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(
      await screen.findByText(/form changed during validation/),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Review' }));
    await screen.findByRole('progressbar');
    await act(async () => {
      finishFirst();
      await first;
    });
    expect(screen.queryByText('Stale failure')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Synchronized value' }),
    ).toHaveValue('original-edited');
    await act(async () => {
      finishSecond();
      await second;
    });
    await user.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({ value: 'original-edited' }),
    );
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('detects a mutated nested value emitted by a shared field during validation', async () => {
    let finish!: () => void;
    const pending = new Promise<void>(resolve => {
      finish = resolve;
    });
    const validate = jest
      .fn(async () => {})
      .mockImplementationOnce(async () => {
        await pending;
      });
    const onCreate = jest.fn();
    const Shared = ({
      formData,
      onChange,
    }: FieldExtensionComponentProps<{ name: string }>) => (
      <button
        type="button"
        onClick={() => {
          formData!.name = 'edited';
          onChange(formData);
        }}
      >
        Edit shared object
      </button>
    );
    await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={{
            title: 'Shared object',
            steps: [
              {
                title: 'Project',
                schema: {
                  properties: {
                    projectChange: { type: 'object', 'ui:field': 'Shared' },
                  },
                },
              },
            ],
          }}
          initialState={{ projectChange: { name: 'original' } }}
          extensions={[
            { name: 'Shared', component: Shared, validation: validate },
          ]}
          onCreate={onCreate}
        />
      </SecretsContextProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    await screen.findByRole('progressbar');
    fireEvent.click(screen.getByRole('button', { name: 'Edit shared object' }));
    expect(
      await screen.findByText(/form changed during validation/),
    ).toBeInTheDocument();
    await act(async () => {
      finish();
      await pending;
    });
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        projectChange: { name: 'edited' },
      }),
    );
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('interrupts validation when the manifest reveals a page and still requires its visit', async () => {
    let finish!: () => void;
    const pending = new Promise<void>(resolve => {
      finish = resolve;
    });
    const validate = jest
      .fn()
      .mockImplementationOnce(async (_value, errors) => {
        await pending;
        errors.addError('Old manifest failure');
      });
    const onCreate = jest.fn();
    const Current = ({ formData }: FieldExtensionComponentProps<string>) => (
      <input aria-label="Current value" value={formData ?? ''} readOnly />
    );
    const manifest: TemplateParameterSchema = {
      title: 'Revealed page',
      steps: [
        {
          title: 'Earlier',
          when: false,
          schema: {
            required: ['earlier'],
            properties: { earlier: { type: 'string' } },
          },
        },
        {
          title: 'Current',
          schema: {
            properties: { current: { type: 'string', 'ui:field': 'Current' } },
          },
        },
      ],
    };
    const extensions = [
      { name: 'Current', component: Current, validation: validate },
    ];
    const renderStepper = (definition: TemplateParameterSchema) => (
      <SecretsContextProvider>
        <Stepper
          manifest={definition}
          initialState={{ earlier: 'prefilled', current: 'value' }}
          extensions={extensions}
          onCreate={onCreate}
        />
      </SecretsContextProvider>
    );
    const { rerender } = await renderInTestApp(renderStepper(manifest));
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    await screen.findByRole('progressbar');
    rerender(
      renderStepper({
        ...manifest,
        steps: [{ ...manifest.steps[0], when: true }, manifest.steps[1]],
      }),
    );
    expect(
      await screen.findByText(/form changed during validation/),
    ).toBeInTheDocument();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review' })).toBeEnabled();
    await act(async () => {
      finish();
      await pending;
    });
    expect(screen.queryByText('Old manifest failure')).not.toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    expect(await screen.findByRole('textbox', { name: 'earlier' })).toHaveValue(
      'prefilled',
    );
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        earlier: 'prefilled',
        current: 'value',
      }),
    );
    expect(validate).toHaveBeenCalledTimes(2);
  });

  it('checks several cross-page validators without a navigation cycle', async () => {
    const onCreate = jest.fn();
    const validate = jest.fn(
      async (
        _value: unknown,
        errors: FieldValidation,
        context: { formData: JsonObject },
      ) => {
        if (context.formData.context !== 'approved')
          errors.addError('Fix the context');
      },
    );
    const Field = ({ formData }: FieldExtensionComponentProps<string>) => (
      <input aria-label="Validated value" value={formData ?? ''} readOnly />
    );
    await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={{
            title: 'Cross-page checks',
            steps: [
              {
                title: 'First',
                schema: {
                  properties: {
                    first: { type: 'string', 'ui:field': 'Checked' },
                  },
                },
              },
              {
                title: 'Second',
                schema: {
                  properties: {
                    second: { type: 'string', 'ui:field': 'Checked' },
                  },
                },
              },
              {
                title: 'Context',
                schema: {
                  properties: {
                    context: { type: 'string' },
                    note: { type: 'string' },
                  },
                },
              },
            ],
          }}
          initialState={{ first: 'one', second: 'two', context: 'approved' }}
          extensions={[
            { name: 'Checked', component: Field, validation: validate },
          ]}
          onCreate={onCreate}
        />
      </SecretsContextProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByRole('button', { name: 'Back' });
    await waitFor(() => expect(validate).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'note' }), {
      target: { value: 'changed' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    await screen.findByRole('button', { name: 'Create' });
    expect(validate).toHaveBeenCalledTimes(4);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'context' }), {
      target: { value: 'blocked' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    expect(await screen.findAllByText('Fix the context')).not.toHaveLength(0);
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Step 3' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'context' }), {
      target: { value: 'approved' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'note' }), {
      target: { value: 'fixed' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        first: 'one',
        second: 'two',
        context: 'approved',
        note: 'fixed',
      }),
    );
    expect(validate).toHaveBeenCalledTimes(7);
  });

  it.each(['{Enter}', ' '])(
    'recovers from failed context validation using %s to reach a later page',
    async key => {
      const user = userEvent.setup();
      const onCreate = jest.fn();
      const validate = jest.fn(
        async (
          _value: unknown,
          errors: FieldValidation,
          context: { formData: JsonObject },
        ) => {
          if (context.formData.project !== 'approved')
            errors.addError('Project is not approved');
        },
      );
      const Custom = ({ formData }: FieldExtensionComponentProps<string>) => (
        <input aria-label="Name" value={formData ?? ''} readOnly />
      );
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Context validation',
              steps: [
                {
                  title: 'Name',
                  schema: {
                    properties: {
                      name: { type: 'string', 'ui:field': 'Custom' },
                    },
                  },
                },
                {
                  title: 'Project',
                  schema: { properties: { project: { type: 'string' } } },
                },
              ],
            }}
            initialState={{ name: 'existing', project: 'approved' }}
            extensions={[
              { name: 'Custom', component: Custom, validation: validate },
            ]}
            onCreate={onCreate}
          />
        </SecretsContextProvider>,
      );
      // Pages that have not been visited are still reached through validation.
      expect(screen.getByRole('button', { name: 'Step 2' })).toBeDisabled();
      fireEvent.click(screen.getByLabelText('Step 2'));
      expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
      expect(
        screen.queryByRole('textbox', { name: 'project' }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.change(
        await screen.findByRole('textbox', { name: 'project' }),
        {
          target: { value: 'blocked' },
        },
      );
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      await screen.findByRole('textbox', { name: 'Name' });
      expect(
        await screen.findAllByText('Project is not approved'),
      ).not.toHaveLength(0);
      expect(validate).toHaveBeenCalledTimes(2);
      expect(onCreate).not.toHaveBeenCalled();
      await user.tab();
      const projectButton = screen.getByRole('button', { name: 'Step 2' });
      expect(projectButton).toHaveFocus();
      await user.keyboard(key);
      const project = await screen.findByRole('textbox', { name: 'project' });
      expect(project).toHaveValue('blocked');
      expect(
        screen.queryByText('Project is not approved'),
      ).not.toBeInTheDocument();
      // Automatic checking still blocks review until the later input is fixed.
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      await screen.findByRole('textbox', { name: 'Name' });
      expect(
        screen.queryByRole('button', { name: 'Create' }),
      ).not.toBeInTheDocument();
      act(() => screen.getByRole('button', { name: 'Step 2' }).focus());
      await user.keyboard(key);
      fireEvent.change(
        await screen.findByRole('textbox', { name: 'project' }),
        {
          target: { value: 'approved' },
        },
      );
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      // Successful context validation does not require another Name-page visit.
      fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
      await waitFor(() =>
        expect(onCreate).toHaveBeenCalledWith({
          name: 'existing',
          project: 'approved',
        }),
      );
      // Restoring the original, successfully checked context needs no extra call.
      expect(validate).toHaveBeenCalledTimes(3);
    },
  );

  it.each(['if.required', 'allOf', '$ref'] as const)(
    'revalidates constraints changed through %s by a later page',
    async composition => {
      const onCreate = jest.fn();
      const condition = {
        if:
          composition === 'if.required'
            ? { required: ['mode'] }
            : { properties: { mode: { const: 'strict' } }, required: ['mode'] },
        then: {
          properties: { answer: { minLength: 8 } },
          required: ['answer'],
        },
      };
      const compositions = {
        'if.required': condition,
        allOf: { allOf: [condition] },
        $ref: {
          definitions: { conditional: condition },
          $ref: '#/definitions/conditional',
        },
      };
      const composed = compositions[composition];
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Conditional constraints',
              steps: [
                {
                  title: 'Answer',
                  schema: {
                    type: 'object',
                    properties: { answer: { type: 'string' } },
                    ...composed,
                  },
                },
                {
                  title: 'Mode',
                  schema: { properties: { mode: { type: 'string' } } },
                },
              ],
            }}
            initialState={{
              answer: 'short',
              ...(composition === 'if.required' ? {} : { mode: 'relaxed' }),
            }}
            extensions={[]}
            onCreate={onCreate}
          />
        </SecretsContextProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.change(await screen.findByRole('textbox', { name: 'mode' }), {
        target: { value: 'strict' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      const answer = await screen.findByRole('textbox', { name: /answer/ });
      expect(answer).toHaveValue('short');
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(
        await screen.findAllByText(/fewer than 8 characters/),
      ).not.toHaveLength(0);
      expect(onCreate).not.toHaveBeenCalled();
      fireEvent.change(answer, { target: { value: 'long enough' } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      // The intervening page is already valid; recovery goes straight to review.
      fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
      await waitFor(() =>
        expect(onCreate).toHaveBeenCalledWith({
          answer: 'long enough',
          mode: 'strict',
        }),
      );
    },
  );

  it.each(['insert', 'reorder', 'schema'])(
    'revalidates steps after a manifest %s while review is open',
    async change => {
      const onCreate = jest.fn();
      const validateFirst = jest.fn();
      const manifest: TemplateParameterSchema = {
        title: 'Changing definitions',
        steps: [
          {
            title: 'First',
            schema: {
              properties: { shared: { type: 'string', 'ui:field': 'Shared' } },
            },
          },
          {
            title: 'Last',
            schema: { properties: { last: { type: 'string' } } },
          },
        ],
      };
      const Shared = ({
        formData,
        onChange,
      }: FieldExtensionComponentProps<string>) => (
        <input
          aria-label="Shared"
          value={formData ?? ''}
          onChange={event => onChange(event.target.value)}
        />
      );
      const renderStepper = (current: TemplateParameterSchema) => (
        <SecretsContextProvider>
          <Stepper
            manifest={current}
            initialState={{ shared: 'approved' }}
            extensions={[
              { name: 'Shared', component: Shared, validation: validateFirst },
            ]}
            onCreate={onCreate}
          />
        </SecretsContextProvider>
      );
      const { rerender } = await renderInTestApp(renderStepper(manifest));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      await screen.findByRole('textbox', { name: 'last' });
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      await screen.findByRole('button', { name: 'Create' });
      validateFirst.mockClear();
      const required = {
        title: 'Required',
        schema: {
          required: ['newValue'],
          properties: { newValue: { type: 'string' } },
        },
      };
      const replacements: Record<string, TemplateParameterSchema['steps']> = {
        insert: [required, ...manifest.steps],
        reorder: [manifest.steps[1], manifest.steps[0]],
        schema: [
          {
            ...manifest.steps[0],
            schema: { ...manifest.steps[0].schema, ...required.schema },
          },
          manifest.steps[1],
        ],
      };
      rerender(renderStepper({ ...manifest, steps: replacements[change] }));
      if (screen.queryByRole('button', { name: 'Create' })) {
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
      }
      if (
        change === 'insert' &&
        screen.queryByRole('textbox', { name: 'last' })
      ) {
        fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      }
      if (change === 'reorder') {
        fireEvent.click(await screen.findByRole('button', { name: 'Next' }));
        await screen.findByRole('textbox', { name: 'Shared' });
        fireEvent.click(screen.getByRole('button', { name: 'Review' }));
        await screen.findByRole('button', { name: 'Create' });
      } else {
        const input = await screen.findByRole('textbox', { name: 'newValue' });
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        await screen.findByRole('textbox', { name: 'newValue' });
        fireEvent.change(input, { target: { value: 'configured' } });
      }
      expect(validateFirst).toHaveBeenCalledTimes(change === 'reorder' ? 1 : 0);
      expect(onCreate).not.toHaveBeenCalled();
    },
  );

  it('revalidates custom fields after shared inputs or other form context changes', async () => {
    const onCreate = jest.fn();
    const validateShared = jest.fn(
      async (value: unknown, errors: FieldValidation) => {
        if (value !== 'approved')
          errors.addError('Shared value must be approved');
      },
    );
    const Shared = ({
      formData,
      onChange,
    }: FieldExtensionComponentProps<string>) => (
      <input
        aria-label="Shared"
        value={formData ?? ''}
        onChange={event => onChange(event.target.value)}
      />
    );
    await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={{
            title: 'Shared inputs',
            steps: [
              {
                title: 'Validate shared',
                schema: {
                  properties: {
                    shared: { type: 'string', 'ui:field': 'Shared' },
                  },
                },
              },
              {
                title: 'Edit shared',
                schema: {
                  properties: {
                    shared: { type: 'string' },
                    unrelated: { type: 'string' },
                  },
                },
              },
            ],
          }}
          initialState={{ shared: 'approved' }}
          extensions={[
            { name: 'Shared', component: Shared, validation: validateShared },
          ]}
          onCreate={onCreate}
        />
      </SecretsContextProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(
      await screen.findByRole('textbox', { name: 'unrelated' }),
      { target: { value: 'other' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    // A context-only change is checked without sending the user back.
    await screen.findByRole('button', { name: 'Create' });
    expect(validateShared).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    fireEvent.change(await screen.findByRole('textbox', { name: 'shared' }), {
      target: { value: 'invalid' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    await screen.findByRole('textbox', { name: 'Shared' });
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
    expect(
      await screen.findAllByText('Shared value must be approved'),
    ).not.toHaveLength(0);
    expect(onCreate).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('textbox', { name: 'Shared' }), {
      target: { value: 'approved' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        shared: 'approved',
        unrelated: 'other',
      }),
    );
  });

  it.each([false, true])(
    'discards pending validation after visibility changes (stale error: %s)',
    async staleError => {
      let finishValidation: () => void;
      const pendingValidation = new Promise<void>(resolve => {
        finishValidation = resolve;
      });
      const validateCurrent = jest
        .fn(async (_value: unknown, _errors: FieldValidation) => {})
        .mockImplementationOnce(
          async (_value: unknown, errors: FieldValidation) => {
            await pendingValidation;
            if (staleError) errors.addError('Outdated validation error');
          },
        );
      const validateEarlier = jest.fn(
        async (value: unknown, errors: FieldValidation) => {
          if (value !== 'approved') errors.addError('Enter approved value');
        },
      );
      const ToggleField = ({
        formData,
        onChange,
      }: FieldExtensionComponentProps<boolean>) => (
        <input
          aria-label="Show earlier"
          type="checkbox"
          checked={formData ?? false}
          onChange={event => onChange(event.target.checked)}
        />
      );
      const onCreate = jest.fn();
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Pending validation',
              steps: [
                {
                  title: 'Earlier',
                  when: '${{ parameters.enabled }}',
                  schema: {
                    required: ['earlier'],
                    properties: {
                      earlier: { type: 'string', 'ui:field': 'Earlier' },
                    },
                  },
                },
                {
                  title: 'Current',
                  schema: {
                    properties: {
                      enabled: { type: 'boolean', 'ui:field': 'Toggle' },
                      note: { type: 'string' },
                    },
                  },
                },
              ],
            }}
            extensions={[
              {
                name: 'Earlier',
                component: ({
                  formData,
                  onChange,
                }: FieldExtensionComponentProps<string>) => (
                  <input
                    aria-label="Earlier value"
                    value={formData ?? ''}
                    onChange={event => onChange(event.target.value)}
                  />
                ),
                validation: validateEarlier,
              },
              {
                name: 'Toggle',
                component: ToggleField,
                validation: validateCurrent,
              },
            ]}
            initialState={{
              enabled: true,
              earlier: 'approved',
              note: 'original',
            }}
            onCreate={onCreate}
          />
        </SecretsContextProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      const toggle = await screen.findByRole('checkbox', {
        name: 'Show earlier',
      });
      expect(validateEarlier).toHaveBeenCalledTimes(1);
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      await waitFor(() => expect(validateCurrent).toHaveBeenCalledTimes(1));
      fireEvent.click(toggle);
      fireEvent.click(toggle);
      fireEvent.change(screen.getByRole('textbox', { name: 'note' }), {
        target: { value: 'edited while validating' },
      });
      await act(async () => {
        finishValidation!();
        await pendingValidation;
      });
      expect(
        screen.getByRole('checkbox', { name: 'Show earlier' }),
      ).toBeChecked();
      expect(screen.getByRole('textbox', { name: 'note' })).toHaveValue(
        'edited while validating',
      );
      expect(
        screen.queryByText('Outdated validation error'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Create' }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      const earlier = await screen.findByRole('textbox', {
        name: 'Earlier value',
      });
      fireEvent.change(earlier, { target: { value: 'invalid' } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(
        await screen.findAllByText(/Enter approved value/),
      ).not.toHaveLength(0);
      expect(onCreate).not.toHaveBeenCalled();
      fireEvent.change(earlier, { target: { value: 'approved' } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
      await waitFor(() =>
        expect(onCreate).toHaveBeenCalledWith({
          enabled: true,
          earlier: 'approved',
          note: 'edited while validating',
        }),
      );
    },
  );

  it.each([false, true])(
    'validates a newly revealed earlier step before review (previously validated: %s)',
    async previouslyValidated => {
      const onCreate = jest.fn();
      const validateEarlier = jest.fn(
        async (value: unknown, errors: FieldValidation) => {
          if (value !== 'approved') {
            errors.addError('Enter approved value');
          }
        },
      );
      const EarlierField = ({
        formData,
        onChange,
      }: FieldExtensionComponentProps<string>) => (
        <input
          aria-label="Earlier value"
          value={formData ?? ''}
          onChange={event => onChange(event.target.value || undefined)}
        />
      );
      const manifest: TemplateParameterSchema = {
        title: 'Required earlier step',
        steps: [
          {
            title: 'Earlier',
            when: '${{ parameters.enabled }}',
            schema: {
              required: ['earlier'],
              properties: {
                earlier: { type: 'string', 'ui:field': 'Earlier' },
              },
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
            extensions={[
              {
                name: 'Earlier',
                component: EarlierField,
                validation: validateEarlier,
              },
            ]}
            initialState={{
              enabled: previouslyValidated,
              ...(previouslyValidated ? { earlier: 'approved' } : {}),
            }}
            onCreate={onCreate}
          />
        </SecretsContextProvider>,
      );
      if (previouslyValidated) {
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        fireEvent.click(
          await screen.findByRole('checkbox', { name: 'enabled' }),
        );
      }
      validateEarlier.mockClear();
      fireEvent.click(screen.getByRole('checkbox', { name: 'enabled' }));
      expect(
        screen.queryByRole('textbox', { name: 'Earlier value' }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      const earlier = await screen.findByRole('textbox', {
        name: 'Earlier value',
      });
      expect(
        screen.queryByRole('button', { name: 'Create' }),
      ).not.toBeInTheDocument();
      fireEvent.change(earlier, { target: { value: 'temporary' } });
      fireEvent.change(earlier, { target: { value: '' } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(
        await screen.findAllByText(/required property 'earlier'/),
      ).not.toHaveLength(0);
      expect(validateEarlier).not.toHaveBeenCalled();
      expect(onCreate).not.toHaveBeenCalled();
      fireEvent.change(earlier, { target: { value: 'invalid' } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      expect(
        await screen.findAllByText(/Enter approved value/),
      ).not.toHaveLength(0);
      expect(validateEarlier).toHaveBeenCalled();
      expect(
        screen.queryByRole('button', { name: 'Create' }),
      ).not.toBeInTheDocument();
      fireEvent.change(earlier, { target: { value: 'approved' } });
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
      await waitFor(() =>
        expect(onCreate).toHaveBeenCalledWith({
          enabled: true,
          earlier: 'approved',
        }),
      );
    },
  );

  it.each([false, true])(
    'keeps the displayed cursor when an earlier step is revealed (self hiding: %s)',
    async selfHiding => {
      const manifest: TemplateParameterSchema = {
        title: 'Cursor',
        steps: [
          {
            title: 'Earlier',
            when: '${{ parameters.enabled }}',
            schema: {
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

  it('visits a pending earlier step when the current step hides itself', async () => {
    const onCreate = jest.fn();
    await renderInTestApp(
      <SecretsContextProvider>
        <Stepper
          manifest={{
            title: 'Mutually exclusive steps',
            steps: [
              {
                title: 'Earlier',
                when: '${{ parameters.enabled }}',
                schema: {
                  required: ['earlier'],
                  properties: {
                    earlier: { type: 'string' },
                    enabled: { type: 'boolean', 'ui:widget': 'hidden' },
                  },
                },
              },
              {
                title: 'Current',
                when: '${{ not parameters.enabled }}',
                schema: {
                  properties: { enabled: { type: 'boolean' } },
                },
              },
            ],
          }}
          initialState={{ enabled: false }}
          extensions={[]}
          onCreate={onCreate}
        />
      </SecretsContextProvider>,
    );
    fireEvent.click(screen.getByRole('checkbox', { name: 'enabled' }));
    const earlier = await screen.findByRole('textbox', { name: /earlier/ });
    expect(
      screen.queryByRole('button', { name: 'Create' }),
    ).not.toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
    fireEvent.change(earlier, { target: { value: 'configured' } });
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        enabled: true,
        earlier: 'configured',
      }),
    );
  });

  it('stays on review after the last step hides itself', async () => {
    const onCreate = jest.fn();
    const manifest: TemplateParameterSchema = {
      title: 'Review cursor',
      steps: [
        {
          title: 'Optional',
          when: '${{ parameters.enabled }}',
          schema: {
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
          onCreate={onCreate}
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
          onCreate={onCreate}
        />
      </SecretsContextProvider>,
    );
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(
      await screen.findByRole('checkbox', { name: 'enabled' }),
    ).toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Review' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Create' }));
    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({ enabled: false }),
    );
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

    // The changed shared input is checked automatically before review.
    expect(
      await screen.findByRole('button', { name: 'Create' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('textbox', { name: 'Foo - 1' }),
    ).not.toBeInTheDocument();
    expect(onCreate).not.toHaveBeenCalled();
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

  describe('conditional steps with when', () => {
    it.each(['nested', 'reference'])(
      'excludes hidden %s fields while preserving visible values',
      async shape => {
        const visible: JsonObject =
          shape === 'nested'
            ? {
                properties: {
                  config: {
                    type: 'object',
                    properties: { project: { type: 'string' } },
                  },
                },
              }
            : { properties: { name: { type: 'string' } } };
        const hidden: JsonObject =
          shape === 'nested'
            ? {
                properties: {
                  config: {
                    type: 'object',
                    properties: { awsRegion: { type: 'string' } },
                  },
                },
              }
            : {
                definitions: {
                  Hidden: {
                    type: 'object',
                    properties: { awsRegion: { type: 'string' } },
                  },
                },
                allOf: [{ $ref: '#/definitions/Hidden' }],
              };
        const initial: Record<string, JsonValue> =
          shape === 'nested'
            ? { config: { project: 'keep', awsRegion: 'remove' } }
            : { name: 'keep', awsRegion: 'remove' };
        const onCreate = jest.fn();
        await renderInTestApp(
          <SecretsContextProvider>
            <Stepper
              manifest={{
                title: 'Hidden fields',
                steps: [
                  { title: 'Visible', schema: visible },
                  { title: 'Hidden', when: false, schema: hidden },
                ],
              }}
              extensions={[]}
              initialState={initial}
              onCreate={onCreate}
            />
          </SecretsContextProvider>,
        );
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Review' }));
        });
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Create' }));
        });
        expect(onCreate).toHaveBeenCalledWith(
          shape === 'nested'
            ? { config: { project: 'keep' } }
            : { name: 'keep' },
        );
      },
    );

    it('uses Nunjitsu conditions and keeps steps with matching titles separate', async () => {
      const manifest: TemplateParameterSchema = {
        title: 'Conditional Steps',
        steps: [
          {
            title: 'Provider',
            schema: { properties: { provider: { type: 'string' } } },
          },
          {
            title: 'Configuration',
            when: "${{ parameters.provider | lower in ['aws'] and not parameters.disabled }}",
            schema: { properties: { awsRegion: { type: 'string' } } },
          },
          {
            title: 'Configuration',
            when: "${{ parameters.provider === 'GCP' }}",
            schema: { properties: { project: { type: 'string' } } },
          },
          { title: 'Configuration', schema: { properties: {} } },
        ],
      };
      const onCreate = jest.fn();
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      try {
        await renderInTestApp(
          <SecretsContextProvider>
            <Stepper
              manifest={manifest}
              extensions={[]}
              initialState={{ provider: 'AWS', disabled: false }}
              onCreate={onCreate}
            />
          </SecretsContextProvider>,
        );

        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        });
        expect(
          screen.getByRole('textbox', { name: 'awsRegion' }),
        ).toBeInTheDocument();
        await act(async () => {
          fireEvent.change(screen.getByRole('textbox', { name: 'awsRegion' }), {
            target: { value: 'us-east-1' },
          });
          fireEvent.click(screen.getByRole('button', { name: 'Back' }));
        });
        await act(async () => {
          fireEvent.change(screen.getByRole('textbox', { name: 'provider' }), {
            target: { value: 'GCP' },
          });
        });
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        });
        expect(
          screen.queryByRole('textbox', { name: 'awsRegion' }),
        ).not.toBeInTheDocument();
        await act(async () => {
          fireEvent.change(screen.getByRole('textbox', { name: 'project' }), {
            target: { value: 'my-project' },
          });
          fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        });
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Review' }));
        });
        await act(async () => {
          fireEvent.click(screen.getByRole('button', { name: 'Create' }));
        });

        expect(onCreate).toHaveBeenCalledWith({
          provider: 'GCP',
          disabled: false,
          project: 'my-project',
        });
        expect(consoleError.mock.calls.flat().join(' ')).not.toContain(
          'Encountered two children with the same key',
        );
      } finally {
        consoleError.mockRestore();
      }
    });

    it('keeps malformed conditions visible so required fields can be completed', async () => {
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Malformed Condition',
              steps: [
                {
                  title: 'Required Input',
                  when: '${{ invalid...syntax }}',
                  schema: {
                    required: ['name'],
                    properties: { name: { type: 'string' } },
                  },
                },
              ],
            }}
            extensions={[]}
            onCreate={jest.fn()}
          />
        </SecretsContextProvider>,
      );
      expect(screen.getByRole('textbox', { name: /name/ })).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Create' }),
      ).not.toBeInTheDocument();
    });

    it('should hide steps whose when condition evaluates to false', async () => {
      const manifest: TemplateParameterSchema = {
        title: 'Conditional Steps',
        steps: [
          {
            title: 'Choose Provider',
            schema: {
              properties: {
                cloudProvider: {
                  type: 'string',
                  enum: ['AWS', 'GCP'],
                },
              },
            },
          },
          {
            title: 'AWS Config',
            when: "${{ parameters.cloudProvider === 'AWS' }}",
            schema: {
              properties: {
                awsRegion: { type: 'string' },
              },
            },
          },
          {
            title: 'GCP Config',
            when: "${{ parameters.cloudProvider === 'GCP' }}",
            schema: {
              properties: {
                gcpProjectId: { type: 'string' },
              },
            },
          },
        ],
      };

      const { getByText, queryByText } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      expect(getByText('Choose Provider')).toBeInTheDocument();
      expect(queryByText('AWS Config')).not.toBeInTheDocument();
      expect(queryByText('GCP Config')).not.toBeInTheDocument();
    });

    it('should show conditional steps when their condition becomes true', async () => {
      const manifest: TemplateParameterSchema = {
        title: 'Conditional Steps',
        steps: [
          {
            title: 'Choose Provider',
            schema: {
              properties: {
                cloudProvider: {
                  type: 'string',
                },
              },
            },
          },
          {
            title: 'AWS Config',
            when: "${{ parameters.cloudProvider === 'AWS' }}",
            schema: {
              properties: {
                awsRegion: { type: 'string' },
              },
            },
          },
        ],
      };

      const { getByText, queryByText, getByRole } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      expect(queryByText('AWS Config')).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.change(getByRole('textbox'), {
          target: { value: 'AWS' },
        });
      });

      expect(getByText('AWS Config')).toBeInTheDocument();
    });

    it('should exclude hidden step data from submission', async () => {
      const manifest: TemplateParameterSchema = {
        title: 'Conditional Steps',
        steps: [
          {
            title: 'Choose Provider',
            schema: {
              properties: {
                cloudProvider: {
                  type: 'string',
                },
              },
            },
          },
          {
            title: 'AWS Config',
            when: "${{ parameters.cloudProvider === 'AWS' }}",
            schema: {
              properties: {
                awsRegion: { type: 'string' },
              },
            },
          },
        ],
      };

      const onCreate = jest.fn();

      const { getByRole } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={manifest}
            extensions={[]}
            onCreate={onCreate}
            initialState={{ cloudProvider: 'GCP', awsRegion: 'us-east-1' }}
          />
        </SecretsContextProvider>,
      );

      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'Review' }));
      });

      await act(async () => {
        fireEvent.click(getByRole('button', { name: 'Create' }));
      });

      expect(onCreate).toHaveBeenCalledWith(
        expect.not.objectContaining({ awsRegion: expect.anything() }),
      );
      expect(onCreate).toHaveBeenCalledWith(
        expect.objectContaining({ cloudProvider: 'GCP' }),
      );
    });

    it('hides chained steps whose condition depends on a hidden step', async () => {
      const onCreate = jest.fn();
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Chained Steps',
              steps: [
                {
                  title: 'Provider',
                  schema: { properties: { cloudProvider: { type: 'string' } } },
                },
                {
                  title: 'AWS Config',
                  when: "${{ parameters.cloudProvider === 'AWS' }}",
                  schema: { properties: { awsAdvanced: { type: 'boolean' } } },
                },
                {
                  title: 'AWS Advanced',
                  when: '${{ parameters.awsAdvanced }}',
                  schema: { properties: { awsTuning: { type: 'string' } } },
                },
              ],
            }}
            extensions={[]}
            onCreate={onCreate}
            initialState={{
              cloudProvider: 'GCP',
              awsAdvanced: true,
              awsTuning: 'fast',
            }}
          />
        </SecretsContextProvider>,
      );

      expect(screen.queryByText('AWS Config')).not.toBeInTheDocument();
      expect(screen.queryByText('AWS Advanced')).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      });
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Create' }));
      });
      expect(onCreate).toHaveBeenCalledWith({ cloudProvider: 'GCP' });
    });

    it('stays on the active step when an earlier step is shown', async () => {
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Active Step',
              steps: [
                {
                  title: 'Start',
                  schema: {
                    properties: { name: { type: 'string', title: 'Name' } },
                  },
                },
                {
                  title: 'Early',
                  when: '${{ parameters.toggle }}',
                  schema: {
                    properties: { early: { type: 'string', title: 'Early' } },
                  },
                },
                {
                  title: 'Details',
                  schema: {
                    properties: { toggle: { type: 'string', title: 'Toggle' } },
                  },
                },
              ],
            }}
            extensions={[]}
            onCreate={jest.fn()}
          />
        </SecretsContextProvider>,
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      });
      expect(
        screen.getByRole('textbox', { name: 'Toggle' }),
      ).toBeInTheDocument();
      expect(screen.queryByText('Early')).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.change(screen.getByRole('textbox', { name: 'Toggle' }), {
          target: { value: 'yes' },
        });
      });

      expect(screen.getByText('Early')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Toggle' })).toHaveValue(
        'yes',
      );
      expect(
        screen.queryByRole('textbox', { name: 'Early' }),
      ).not.toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Back' }));
      });
      expect(
        screen.getByRole('textbox', { name: 'Early' }),
      ).toBeInTheDocument();
    });

    it('masks secrets on review when hidden steps own related fields', async () => {
      await renderInTestApp(
        <SecretsContextProvider>
          <Stepper
            manifest={{
              title: 'Review masking',
              steps: [
                {
                  title: 'Hidden mode',
                  when: false,
                  schema: { properties: { mode: { type: 'string' } } },
                },
                {
                  title: 'Hidden connection',
                  when: false,
                  schema: {
                    properties: {
                      connection: {
                        type: 'object',
                        additionalProperties: true,
                        'ui:backstage': { review: { show: false } },
                      },
                    },
                  },
                },
                {
                  title: 'Visible',
                  schema: {
                    properties: {
                      connection: {
                        type: 'object',
                        properties: { username: { type: 'string' } },
                      },
                    },
                    dependencies: {
                      mode: {
                        properties: {
                          password: {
                            type: 'string',
                            'ui:widget': 'password',
                          },
                        },
                      },
                    },
                  },
                },
              ],
            }}
            extensions={[]}
            onCreate={jest.fn()}
            initialState={{
              mode: 'create',
              password: 'DEPENDENCY_SECRET',
              connection: { username: 'user', password: 'NESTED_SECRET' },
            }}
          />
        </SecretsContextProvider>,
      );

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Review' }));
      });

      expect(screen.queryByText('DEPENDENCY_SECRET')).not.toBeInTheDocument();
      expect(screen.queryByText('NESTED_SECRET')).not.toBeInTheDocument();
      expect(screen.getByText('user')).toBeInTheDocument();
    });

    it('should show steps with boolean when: true', async () => {
      const manifest: TemplateParameterSchema = {
        title: 'Boolean Condition',
        steps: [
          {
            title: 'Always Shown',
            when: true,
            schema: { properties: { name: { type: 'string' } } },
          },
          {
            title: 'Never Shown',
            when: false,
            schema: { properties: { hidden: { type: 'string' } } },
          },
        ],
      };

      const { getByText, queryByText } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      expect(getByText('Always Shown')).toBeInTheDocument();
      expect(queryByText('Never Shown')).not.toBeInTheDocument();
    });

    it('should show steps without a when condition', async () => {
      const manifest: TemplateParameterSchema = {
        title: 'Mixed Steps',
        steps: [
          {
            title: 'Unconditional Step',
            schema: { properties: { name: { type: 'string' } } },
          },
          {
            title: 'Conditional Step',
            when: false,
            schema: { properties: { other: { type: 'string' } } },
          },
        ],
      };

      const { getByText, queryByText } = await renderInTestApp(
        <SecretsContextProvider>
          <Stepper manifest={manifest} extensions={[]} onCreate={jest.fn()} />
        </SecretsContextProvider>,
      );

      expect(getByText('Unconditional Step')).toBeInTheDocument();
      expect(queryByText('Conditional Step')).not.toBeInTheDocument();
    });
  });
});
