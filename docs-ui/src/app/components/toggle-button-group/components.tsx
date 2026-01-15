'use client';

import { ToggleButtonGroup } from '../../../../../packages/ui/src/components/ToggleButtonGroup/ToggleButtonGroup';
import { ToggleButton } from '../../../../../packages/ui/src/components/ToggleButton/ToggleButton';
import { RiBold, RiItalic, RiUnderline } from '@remixicon/react';
import { useState } from 'react';

export const Default = () => {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <ToggleButtonGroup
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={keys => setSelected(Array.from(keys as Set<string>))}
    >
      <ToggleButton id="bold" icon={<RiBold />} />
      <ToggleButton id="italic" icon={<RiItalic />} />
      <ToggleButton id="underline" icon={<RiUnderline />} />
    </ToggleButtonGroup>
  );
};

export const SingleSelection = () => {
  const [selected, setSelected] = useState<string>('left');
  return (
    <ToggleButtonGroup
      selectionMode="single"
      selectedKeys={[selected]}
      onSelectionChange={keys => {
        const key = Array.from(keys as Set<string>)[0];
        if (key) setSelected(key);
      }}
    >
      <ToggleButton id="left">Left</ToggleButton>
      <ToggleButton id="center">Center</ToggleButton>
      <ToggleButton id="right">Right</ToggleButton>
    </ToggleButtonGroup>
  );
};

export const Sizes = () => {
  const [small, setSmall] = useState<string[]>([]);
  const [medium, setMedium] = useState<string[]>([]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ToggleButtonGroup
        size="small"
        selectionMode="multiple"
        selectedKeys={small}
        onSelectionChange={keys => setSmall(Array.from(keys as Set<string>))}
      >
        <ToggleButton id="bold" icon={<RiBold />} />
        <ToggleButton id="italic" icon={<RiItalic />} />
        <ToggleButton id="underline" icon={<RiUnderline />} />
      </ToggleButtonGroup>
      <ToggleButtonGroup
        size="medium"
        selectionMode="multiple"
        selectedKeys={medium}
        onSelectionChange={keys => setMedium(Array.from(keys as Set<string>))}
      >
        <ToggleButton id="bold" icon={<RiBold />} />
        <ToggleButton id="italic" icon={<RiItalic />} />
        <ToggleButton id="underline" icon={<RiUnderline />} />
      </ToggleButtonGroup>
    </div>
  );
};

export const Disabled = () => {
  return (
    <ToggleButtonGroup isDisabled selectionMode="multiple">
      <ToggleButton id="bold" icon={<RiBold />} />
      <ToggleButton id="italic" icon={<RiItalic />} />
      <ToggleButton id="underline" icon={<RiUnderline />} />
    </ToggleButtonGroup>
  );
};
