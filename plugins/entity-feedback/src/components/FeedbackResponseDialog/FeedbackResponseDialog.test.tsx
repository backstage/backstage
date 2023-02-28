/*
 * Copyright 2023 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { ErrorApi, errorApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { getByRole, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { EntityFeedbackApi, entityFeedbackApiRef } from '../../api';
import { FeedbackResponseDialog } from './FeedbackResponseDialog';

describe('FeedbackResponseDialog', () => {
  const testEntity: Partial<Entity> = {
    kind: 'component',
    metadata: { name: 'test', namespace: 'default' },
  };
  const errorApi: Partial<ErrorApi> = { post: jest.fn() };
  const feedbackApi: Partial<EntityFeedbackApi> = {
    recordResponse: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  const render = async (props: any = {}) =>
    renderInTestApp(
      <TestApiProvider
        apis={[
          [entityFeedbackApiRef, feedbackApi],
          [errorApiRef, errorApi],
        ]}
      >
        <FeedbackResponseDialog
          {...props}
          entity={testEntity}
          open
          onClose={jest.fn()}
        />
      </TestApiProvider>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows customization of the dialog title', async () => {
    const rendered = await render();
    expect(
      rendered.getByText('Please provide feedback on what can be improved'),
    ).toBeInTheDocument();

    const customRendered = await render({ feedbackDialogTitle: 'Test Title' });
    expect(customRendered.getByText('Test Title')).toBeInTheDocument();
  });

  it('allows customization of the reponse options', async () => {
    const rendered = await render();
    expect(rendered.getByText('Incorrect info')).toBeInTheDocument();
    expect(rendered.getByText('Missing info')).toBeInTheDocument();
    expect(
      rendered.getByText('Other (please specify below)'),
    ).toBeInTheDocument();

    const customResponses = [
      { id: 'foo', label: 'Foo option' },
      { id: 'bar', label: 'Bar option' },
    ];
    const customRendered = await render({
      feedbackDialogResponses: customResponses,
    });
    expect(customRendered.getByText('Foo option')).toBeInTheDocument();
    expect(customRendered.getByText('Bar option')).toBeInTheDocument();
  });

  it('handles saving user responses', async () => {
    const rendered = await render();

    await userEvent.click(
      rendered.getByRole('checkbox', { name: 'Incorrect info' }),
    );
    await userEvent.click(
      rendered.getByRole('checkbox', { name: 'Other (please specify below)' }),
    );
    await userEvent.type(
      getByRole(
        rendered.getByTestId('feedback-response-dialog-comments-input'),
        'textbox',
      ),
      'test comments',
    );
    await userEvent.click(
      rendered.getByTestId('feedback-response-dialog-submit-button'),
    );

    await waitFor(() => {
      expect(feedbackApi.recordResponse).toHaveBeenCalledWith(
        'component:default/test',
        {
          comments: 'test comments',
          consent: true,
          response: 'incorrect,other',
        },
      );
    });
  });
});
