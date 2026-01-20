export const radioGroupUsageSnippet = `import { RadioGroup } from '@backstage/ui';

<RadioGroup />`;

export const defaultSnippet = `<RadioGroup label="What is your favorite pokemon?">
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const horizontalSnippet = `<RadioGroup
  label="What is your favorite pokemon?"
  orientation="horizontal"
>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const disabledSnippet = `<RadioGroup label="What is your favorite pokemon?" isDisabled>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const disabledSingleSnippet = `<RadioGroup label="What is your favorite pokemon?">
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander" isDisabled>
    Charmander
  </Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const validationSnippet = `<RadioGroup
  label="What is your favorite pokemon?"
  name="pokemon"
  defaultValue="charmander"
  validationBehavior="aria"
  validate={value => (value === 'charmander' ? 'Nice try!' : null)}
>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;

export const readOnlySnippet = `<RadioGroup
  label="What is your favorite pokemon?"
  isReadOnly
  defaultValue="charmander"
>
  <Radio value="bulbasaur">Bulbasaur</Radio>
  <Radio value="charmander">Charmander</Radio>
  <Radio value="squirtle">Squirtle</Radio>
</RadioGroup>`;
