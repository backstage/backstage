'use client';

import * as Table from '../Table';
import { Chip } from '../Chip';
import { icons } from '../../../../packages/canon';

// Define a more specific type for the data object
type PropData = {
  values?: string | string[];
  responsive?: boolean;
  default?: string;
  type?: string;
};

// Modify the PropsTable component to use the new type
export const PropsTable = <T extends Record<string, PropData>>({
  data,
}: {
  data: T;
}) => {
  if (!data) return null;

  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell style={{ width: '16%' }}>Prop</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '56%' }}>Type</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '14%' }}>Default</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '14%' }}>
            Responsive
          </Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(data).map(n => {
          const enumValues =
            data[n].values === 'icon'
              ? Object.keys(icons).map(icon => <Chip key={icon}>{icon}</Chip>)
              : Array.isArray(data[n].values) &&
                data[n].values.map(t => <Chip key={t}>{t}</Chip>);

          return (
            <Table.Row key={n}>
              <Table.Cell style={{ width: '16%' }}>
                <Chip head>{n}</Chip>
              </Table.Cell>
              <Table.Cell style={{ width: '56%' }}>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}
                >
                  {data[n].type === 'string' && <Chip>string</Chip>}
                  {data[n].type === 'number' && <Chip>number</Chip>}
                  {data[n].type === 'boolean' && <Chip>boolean</Chip>}
                  {data[n].type === 'enum' && enumValues}
                  {data[n].type === 'enum | string' && (
                    <>
                      {enumValues}
                      <Chip>string</Chip>
                    </>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell style={{ width: '14%' }}>
                <Chip>{data[n].default ? data[n].default : '-'}</Chip>
              </Table.Cell>
              <Table.Cell style={{ width: '14%' }}>
                <Chip>{data[n].responsive ? 'Yes' : 'No'}</Chip>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};
