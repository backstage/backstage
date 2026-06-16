'use client';

import { SwitchGroup } from '../../../../../packages/ui/src/components/SwitchGroup/SwitchGroup';
import { Switch } from '../../../../../packages/ui/src/components/Switch/Switch';

export const Default = () => (
  <SwitchGroup label="Notification preferences" defaultValue={['email']}>
    <Switch value="email" label="Email notifications" />
    <Switch value="slack" label="Slack notifications" />
    <Switch value="push" label="Push notifications" />
  </SwitchGroup>
);

export const Horizontal = () => (
  <SwitchGroup
    label="Notification preferences"
    defaultValue={['email']}
    orientation="horizontal"
  >
    <Switch value="email" label="Email notifications" />
    <Switch value="slack" label="Slack notifications" />
    <Switch value="push" label="Push notifications" />
  </SwitchGroup>
);

export const Disabled = () => (
  <SwitchGroup
    label="Notification preferences"
    defaultValue={['email']}
    isDisabled
  >
    <Switch value="email" label="Email notifications" />
    <Switch value="slack" label="Slack notifications" />
    <Switch value="push" label="Push notifications" />
  </SwitchGroup>
);

export const DisabledSingle = () => (
  <SwitchGroup label="Notification preferences" defaultValue={['email']}>
    <Switch value="email" label="Email notifications" />
    <Switch value="slack" label="Slack notifications" isDisabled />
    <Switch value="push" label="Push notifications" />
  </SwitchGroup>
);

export const Validation = () => (
  <SwitchGroup
    label="Notification preferences"
    defaultValue={['email', 'slack']}
    validationBehavior="aria"
    validate={(value: string[]) =>
      value.includes('slack')
        ? 'Slack notifications are not available in your region.'
        : null
    }
  >
    <Switch value="email" label="Email notifications" />
    <Switch value="slack" label="Slack notifications" />
    <Switch value="push" label="Push notifications" />
  </SwitchGroup>
);

export const ReadOnly = () => (
  <SwitchGroup
    label="Notification preferences"
    defaultValue={['email']}
    isReadOnly
  >
    <Switch value="email" label="Email notifications" />
    <Switch value="slack" label="Slack notifications" />
    <Switch value="push" label="Push notifications" />
  </SwitchGroup>
);
