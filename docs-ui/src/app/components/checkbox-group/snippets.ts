export const checkboxGroupUsageSnippet = `import { CheckboxGroup, Checkbox } from '@backstage/ui';

<CheckboxGroup label="Choose platforms for notifications" defaultValue={['github']}>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;

export const defaultSnippet = `<CheckboxGroup label="Choose platforms for notifications" defaultValue={['github']}>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;

export const horizontalSnippet = `<CheckboxGroup
  label="Choose platforms for notifications"
  defaultValue={['github']}
  orientation="horizontal"
>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;

export const disabledSnippet = `<CheckboxGroup
  label="Choose platforms for notifications"
  defaultValue={['github']}
  isDisabled
>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;

export const disabledSingleSnippet = `<CheckboxGroup
  label="Choose platforms for notifications"
  defaultValue={['github']}
>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack" isDisabled>Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;

export const validationSnippet = `<CheckboxGroup
  label="Choose platforms for notifications"
  defaultValue={['github', 'slack']}
  validationBehavior="aria"
  validate={value =>
    value.includes('slack') ? 'Slack is not available in your region.' : null
  }
>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;

export const readOnlySnippet = `<CheckboxGroup
  label="Choose platforms for notifications"
  defaultValue={['github']}
  isReadOnly
>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;
