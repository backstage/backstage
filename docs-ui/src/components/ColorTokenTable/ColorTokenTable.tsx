'use client';

import { useState } from 'react';
import * as Table from '@/components/Table';
import { Chip } from '@/components/Chip';
import { TokenPreview } from '@/components/TokenPreview';
import styles from './ColorTokenTable.module.css';

type TokenRow = { name: string; description: string };
type Family = {
  key: string;
  label: string;
  description: string;
  tokens: TokenRow[];
};

// Builds the shared 11-token variant list for a semantic color family that
// exposes both a base and a subdued variant.
const variantTokens = (family: string, word: string): TokenRow[] => [
  { name: `--bui-${family}-bg`, description: `Base ${word} background color.` },
  {
    name: `--bui-${family}-bg-hover`,
    description: `Base ${word} background color when hovered.`,
  },
  {
    name: `--bui-${family}-bg-disabled`,
    description: `Base ${word} background color when disabled.`,
  },
  {
    name: `--bui-${family}-bg-subdued`,
    description: `Subdued ${word} background color.`,
  },
  {
    name: `--bui-${family}-bg-subdued-hover`,
    description: `Subdued ${word} background color when hovered.`,
  },
  {
    name: `--bui-${family}-bg-subdued-disabled`,
    description: `Subdued ${word} background color when disabled.`,
  },
  {
    name: `--bui-${family}-border`,
    description: `Border color for ${word} surfaces.`,
  },
  {
    name: `--bui-${family}-fg`,
    description: `Foreground color on top of the base ${word} background.`,
  },
  {
    name: `--bui-${family}-fg-disabled`,
    description: `Foreground color on top of the disabled base ${word} background.`,
  },
  {
    name: `--bui-${family}-fg-subdued`,
    description: `Foreground color on top of the subdued ${word} background.`,
  },
  {
    name: `--bui-${family}-fg-subdued-disabled`,
    description: `Foreground color on top of the disabled subdued ${word} background.`,
  },
];

const FAMILIES: Family[] = [
  {
    key: 'accent',
    label: 'Accent',
    description:
      'The primary brand color, used for the most prominent interactive elements such as primary buttons.',
    tokens: [
      { name: '--bui-accent-bg', description: 'Accent background color.' },
      {
        name: '--bui-accent-bg-hover',
        description: 'Accent background color when hovered.',
      },
      {
        name: '--bui-accent-bg-disabled',
        description: 'Accent background color when disabled.',
      },
      {
        name: '--bui-accent-fg',
        description: 'Foreground color on top of the accent background.',
      },
      {
        name: '--bui-accent-fg-disabled',
        description:
          'Foreground color on top of the disabled accent background.',
      },
    ],
  },
  {
    key: 'announcement',
    label: 'Announcement',
    description:
      'Used for informational content and neutral status. Provides a base and a subdued variant.',
    tokens: variantTokens('announcement', 'announcement'),
  },
  {
    key: 'warning',
    label: 'Warning',
    description: 'Used for cautionary states and information.',
    tokens: variantTokens('warning', 'warning'),
  },
  {
    key: 'negative',
    label: 'Negative',
    description: 'Used for errors and destructive actions.',
    tokens: variantTokens('negative', 'negative'),
  },
  {
    key: 'positive',
    label: 'Positive',
    description: 'Used for success states and positive feedback.',
    tokens: variantTokens('positive', 'positive'),
  },
];

export const ColorTokenTable = () => {
  const [key, setKey] = useState(FAMILIES[0].key);
  const family = FAMILIES.find(f => f.key === key) ?? FAMILIES[0];

  return (
    <div className={styles.wrapper}>
      <label className={styles.controls}>
        <span className={styles.label}>Color family</span>
        <select
          className={styles.select}
          value={key}
          onChange={event => setKey(event.target.value)}
        >
          {FAMILIES.map(f => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <p className={styles.description}>{family.description}</p>

      <Table.Root>
        <Table.Header>
          <Table.HeaderRow>
            <Table.HeaderCell>Preview</Table.HeaderCell>
            <Table.HeaderCell>Prop</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
          </Table.HeaderRow>
        </Table.Header>
        <Table.Body>
          {family.tokens.map(token => (
            <Table.Row key={token.name}>
              <Table.Cell>
                <TokenPreview token={token.name} kind="color" />
              </Table.Cell>
              <Table.Cell>
                <Chip head>{token.name}</Chip>
              </Table.Cell>
              <Table.Cell>{token.description}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
