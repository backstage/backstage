/*
 * Copyright 2020 Spotify AB
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
import { AlertDialog } from './AlertDialog';
import { render } from '@testing-library/react';
import {
  Alert,
  AlertFormProps,
  AlertSnoozeOptions,
  AlertDismissOptions,
} from '../../types';

type MockFormDataProps = AlertFormProps<Alert>;

const MockForm = React.forwardRef<HTMLFormElement, MockFormDataProps>(
  (props, ref) => (
    <form ref={ref} onSubmit={props.onSubmit}>
      You. Complete. Me.
    </form>
  ),
);

describe('<AlertDialog />', () => {
  const snoozableAlert: Alert = {
    title: 'title',
    subtitle: 'test-subtitle',
    onSnoozed: jest.fn(),
  };

  const dimissableAlert: Alert = {
    title: 'title',
    subtitle: 'subtitle',
    onDismissed: jest.fn(),
  };

  const customSnoozeAlert: Alert = {
    title: 'title',
    subtitle: 'subtitle',
    onSnoozed: jest.fn(),
    SnoozeForm: MockForm,
  };

  const customDismissAlert: Alert = {
    title: 'title',
    subtitle: 'subtitle',
    onDismissed: jest.fn(),
    DismissForm: MockForm,
  };

  const customAcceptAlert: Alert = {
    title: 'title',
    subtitle: 'test-subtitle',
    onAccepted: jest.fn(),
    AcceptForm: MockForm,
  };

  it('Displays a default snooze form', () => {
    const { getByText } = render(
      <AlertDialog
        open
        group="Ramones"
        snoozed={snoozableAlert}
        accepted={null}
        dismissed={null}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(getByText('For how long?')).toBeInTheDocument();
    expect(getByText('Snooze this action item?')).toBeInTheDocument();
    expect(
      getByText('This action item will be snoozed for all of Ramones.'),
    ).toBeInTheDocument();
    AlertSnoozeOptions.forEach(a =>
      expect(getByText(a.label)).toBeInTheDocument(),
    );
  });

  it('Displays a custom snooze form', () => {
    const { getByText } = render(
      <AlertDialog
        open
        group="Ramones"
        snoozed={customSnoozeAlert}
        accepted={null}
        dismissed={null}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(getByText('You. Complete. Me.')).toBeInTheDocument();
    expect(getByText('Snooze this action item?')).toBeInTheDocument();
    expect(
      getByText('This action item will be snoozed for all of Ramones.'),
    ).toBeInTheDocument();
  });

  it('Displays a default dismiss form', () => {
    const { getByText } = render(
      <AlertDialog
        open
        group="Ramones"
        snoozed={null}
        accepted={null}
        dismissed={dimissableAlert}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(getByText('Dismiss this action item?')).toBeInTheDocument();
    expect(
      getByText('This action item will be dismissed for all of Ramones.'),
    ).toBeInTheDocument();
    AlertDismissOptions.forEach(a =>
      expect(getByText(a.label)).toBeInTheDocument(),
    );
  });

  it('Displays a custom dismiss form', () => {
    const { getByText } = render(
      <AlertDialog
        open
        group="Ramones"
        snoozed={null}
        accepted={null}
        dismissed={customDismissAlert}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(getByText('Dismiss this action item?')).toBeInTheDocument();
    expect(getByText('You. Complete. Me.')).toBeInTheDocument();
    expect(
      getByText('This action item will be dismissed for all of Ramones.'),
    ).toBeInTheDocument();
  });

  it('Displays a custom accept form', () => {
    const { getByText } = render(
      <AlertDialog
        open
        group="Ramones"
        snoozed={null}
        accepted={customAcceptAlert}
        dismissed={null}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(getByText('Accept this action item?')).toBeInTheDocument();
    expect(getByText('You. Complete. Me.')).toBeInTheDocument();
    expect(
      getByText('This action item will be accepted for all of Ramones.'),
    ).toBeInTheDocument();
  });
});
