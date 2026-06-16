export const switchGroupUsageSnippet = `import { SwitchGroup, Switch } from '@backstage/ui';

<SwitchGroup label="Notification preferences" defaultValue={['email']}>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;

export const defaultSnippet = `<SwitchGroup label="Notification preferences" defaultValue={['email']}>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;

export const horizontalSnippet = `<SwitchGroup
  label="Notification preferences"
  defaultValue={['email']}
  orientation="horizontal"
>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;

export const disabledSnippet = `<SwitchGroup
  label="Notification preferences"
  defaultValue={['email']}
  isDisabled
>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;

export const disabledSingleSnippet = `<SwitchGroup
  label="Notification preferences"
  defaultValue={['email']}
>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" isDisabled />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;

export const validationSnippet = `<SwitchGroup
  label="Notification preferences"
  defaultValue={['email', 'slack']}
  validationBehavior="aria"
  validate={value =>
    value.includes('slack')
      ? 'Slack notifications are not available in your region.'
      : null
  }
>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;

export const readOnlySnippet = `<SwitchGroup
  label="Notification preferences"
  defaultValue={['email']}
  isReadOnly
>
  <Switch value="email" label="Email notifications" />
  <Switch value="slack" label="Slack notifications" />
  <Switch value="push" label="Push notifications" />
</SwitchGroup>`;
