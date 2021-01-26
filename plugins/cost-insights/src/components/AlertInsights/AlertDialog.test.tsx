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
import { Alert, AlertFormProps } from '../../types';

type MockFormDataProps = AlertFormProps<Alert>;

function createForm(title: string) {
  return React.forwardRef<HTMLFormElement, MockFormDataProps>((props, ref) => (
    <form ref={ref} onSubmit={props.onSubmit}>
      You. {title}. Me.
    </form>
  ));
}

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

const acceptAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onAccepted: jest.fn(),
};

const customSnoozeAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onSnoozed: jest.fn(),
  SnoozeForm: createForm('Snooze'),
};

const customDismissAlert: Alert = {
  title: 'title',
  subtitle: 'subtitle',
  onDismissed: jest.fn(),
  DismissForm: createForm('Dismiss'),
};

const customAcceptAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onAccepted: jest.fn(),
  AcceptForm: createForm('Accept'),
};

const nullAcceptAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onAccepted: jest.fn(),
  AcceptForm: null,
};

const nullDismissAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onDismissed: jest.fn(),
  DismissForm: null,
};

const nullSnoozeAlert: Alert = {
  title: 'title',
  subtitle: 'test-subtitle',
  onSnoozed: jest.fn(),
  SnoozeForm: null,
};
describe('<AlertDialog />', () => {
  describe.each`
    accepted       | dismissed          | snoozed           | action                      | text
    ${acceptAlert} | ${null}            | ${null}           | ${['Accept', 'accepted']}   | ${'My team can commit to making this change soon, or has already.'}
    ${null}        | ${dimissableAlert} | ${null}           | ${['Dismiss', 'dismissed']} | ${'Reason for dismissing?'}
    ${null}        | ${null}            | ${snoozableAlert} | ${['Snooze', 'snoozed']}    | ${'For how long?'}
  `(
    'Default forms',
    ({ accepted, dismissed, snoozed, action: [action, actioned], text }) => {
      it(`Displays a default ${action} form`, () => {
        const { getByText } = render(
          <AlertDialog
            open
            group="Ramones"
            snoozed={snoozed}
            accepted={accepted}
            dismissed={dismissed}
            onClose={jest.fn()}
            onSubmit={jest.fn()}
          />,
        );
        expect(getByText(text)).toBeInTheDocument();
        expect(getByText(`${action} this action item?`)).toBeInTheDocument();
        expect(
          getByText(`This action item will be ${actioned} for all of Ramones.`),
        ).toBeInTheDocument();
      });
    },
  );

  describe.each`
    accepted             | dismissed             | snoozed              | action
    ${customAcceptAlert} | ${null}               | ${null}              | ${['Accept', 'accepted']}
    ${null}              | ${customDismissAlert} | ${null}              | ${['Dismiss', 'dismissed']}
    ${null}              | ${null}               | ${customSnoozeAlert} | ${['Snooze', 'snoozed']}
  `(
    'Custom forms',
    ({ accepted, dismissed, snoozed, action: [Action, actioned] }) => {
      it(`Displays a custom ${Action} form`, () => {
        const { getByText } = render(
          <AlertDialog
            open
            group="Ramones"
            snoozed={snoozed}
            accepted={accepted}
            dismissed={dismissed}
            onClose={jest.fn()}
            onSubmit={jest.fn()}
          />,
        );
        expect(getByText(`You. ${Action}. Me.`)).toBeInTheDocument();
        expect(getByText(`${Action} this action item?`)).toBeInTheDocument();
        expect(
          getByText(`This action item will be ${actioned} for all of Ramones.`),
        ).toBeInTheDocument();
      });
    },
  );

  describe.each`
    accepted           | dismissed           | snoozed            | action                                 | text
    ${nullAcceptAlert} | ${null}             | ${null}            | ${['Accept', 'accept', 'accepted']}    | ${'My team can commit to making this change soon, or has already.'}
    ${null}            | ${nullDismissAlert} | ${null}            | ${['Dismiss', 'dismiss', 'dismissed']} | ${'Reason for dismissing?'}
    ${null}            | ${null}             | ${nullSnoozeAlert} | ${['Snooze', 'snooze', 'snoozed']}     | ${'For how long?'}
  `(
    'Null forms',
    ({
      accepted,
      dismissed,
      snoozed,
      action: [Action, action, actioned],
      text,
    }) => {
      it(`Does NOT display a ${Action} form`, () => {
        const { getByText, getByRole, queryByText } = render(
          <AlertDialog
            open
            group="Ramones"
            snoozed={snoozed}
            accepted={accepted}
            dismissed={dismissed}
            onClose={jest.fn()}
            onSubmit={jest.fn()}
          />,
        );
        expect(queryByText(text)).not.toBeInTheDocument();
        expect(getByRole('button', { name: action })).toBeInTheDocument();
        expect(getByText(`${Action} this action item?`)).toBeInTheDocument();
        expect(
          getByText(`This action item will be ${actioned} for all of Ramones.`),
        ).toBeInTheDocument();
      });
    },
  );
});
