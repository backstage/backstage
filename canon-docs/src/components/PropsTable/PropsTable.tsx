import React from 'react';
import * as Table from '../Table';
import { Chip } from '../Chip';

// Define a more specific type for the data object
type PropData = {
  type: string | string[];
  responsive: boolean;
};

// Modify the PropsTable component to use the new type
export const PropsTable = <T extends Record<string, PropData>>({
  data,
}: {
  data: T;
}) => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Responsive</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(data).map(n => (
          <Table.Row key={n}>
            <Table.Cell>
              <Chip head>{n}</Chip>
            </Table.Cell>
            <Table.Cell>
              <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}
              >
                {Array.isArray(data[n].type) ? (
                  data[n].type.map(t => <Chip key={t}>{t}</Chip>)
                ) : (
                  <Chip>{data[n].type}</Chip>
                )}
              </div>
            </Table.Cell>
            <Table.Cell>
              <Chip>{data[n].responsive ? 'Yes' : 'No'}</Chip>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
