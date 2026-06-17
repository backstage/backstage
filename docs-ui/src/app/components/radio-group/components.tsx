'use client';

import {
  RadioGroup,
  Radio,
} from '../../../../../packages/ui/src/components/RadioGroup/RadioGroup';

export const Default = () => {
  return (
    <RadioGroup label="What is your favorite pokemon?">
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  );
};

export const Horizontal = () => {
  return (
    <RadioGroup label="What is your favorite pokemon?" orientation="horizontal">
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  );
};

export const Disabled = () => {
  return (
    <RadioGroup label="What is your favorite pokemon?" isDisabled>
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  );
};

export const DisabledSingle = () => {
  return (
    <RadioGroup label="What is your favorite pokemon?">
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander" isDisabled>
        Charmander
      </Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  );
};

export const Validation = () => {
  return (
    <RadioGroup
      label="What is your favorite pokemon?"
      name="pokemon"
      defaultValue="charmander"
      validationBehavior="aria"
      validate={value => (value === 'charmander' ? 'Nice try!' : null)}
    >
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  );
};

export const ReadOnly = () => {
  return (
    <RadioGroup
      label="What is your favorite pokemon?"
      isReadOnly
      defaultValue="charmander"
    >
      <Radio value="bulbasaur">Bulbasaur</Radio>
      <Radio value="charmander">Charmander</Radio>
      <Radio value="squirtle">Squirtle</Radio>
    </RadioGroup>
  );
};
