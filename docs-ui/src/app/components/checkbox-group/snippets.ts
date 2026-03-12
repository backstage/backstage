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

export const controlledSnippet = `const [values, setValues] = useState<string[]>(['email']);

<CheckboxGroup
  label="Choose platforms for notifications"
  value={values}
  onChange={setValues}
>
  <Checkbox value="github">GitHub</Checkbox>
  <Checkbox value="slack">Slack</Checkbox>
  <Checkbox value="email">Email</Checkbox>
</CheckboxGroup>`;
