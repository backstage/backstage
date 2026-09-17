'use client';

import { useState } from 'react';
import { Switch } from '../../../../../packages/ui/src/components/Switch/Switch';

export const Default = () => {
  return <Switch label="Switch" />;
};

export const Disabled = () => {
  return <Switch label="Switch" isDisabled />;
};

export const DefaultSelected = () => {
  return <Switch label="Switch" defaultSelected />;
};

export const ReadOnly = () => {
  return <Switch label="Switch" isSelected isReadOnly />;
};

export const Controlled = () => {
  const [selected, setSelected] = useState(false);
  return (
    <Switch
      label={selected ? 'On' : 'Off'}
      isSelected={selected}
      onChange={setSelected}
    />
  );
};
