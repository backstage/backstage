'use client';

import * as Table from '../Table';
import { Chip } from '../Chip';
import { icons } from '../../../../packages/canon';

// Define a more specific type for the data object
type PropData = {
  values?: string | string[];
  responsive?: boolean;
  default?: string;
};

// Modify the PropsTable component to use the new type
export const PropsTable = <T extends Record<string, PropData>>({
  data,
}: {
  data: T;
}) => {
  const completeData = {
    ...data,
    children: {
      values: 'ReactNode',
      responsive: false,
    },
    className: {
      values: 'string',
      responsive: false,
    },
    style: {
      values: 'CSSProperties',
      responsive: false,
    },
  };

  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Default</Table.HeaderCell>
          <Table.HeaderCell>Responsive</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(completeData).map(n => (
          <Table.Row key={n}>
            <Table.Cell>
              <Chip head>{n}</Chip>
            </Table.Cell>
            <Table.Cell>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}
              >
                {completeData[n].values === 'icon' ? (
                  Object.keys(icons).map(icon => <Chip key={icon}>{icon}</Chip>)
                ) : Array.isArray(completeData[n].values) ? (
                  completeData[n].values.map(t => <Chip key={t}>{t}</Chip>)
                ) : (
                  <Chip>{completeData[n].values}</Chip>
                )}
              </div>
            </Table.Cell>
            <Table.Cell>
              <Chip>
                {completeData[n].default ? completeData[n].default : '-'}
              </Chip>
            </Table.Cell>
            <Table.Cell>
              <Chip>{completeData[n].responsive ? 'Yes' : 'No'}</Chip>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
