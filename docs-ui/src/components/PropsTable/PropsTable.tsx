'use client';

import * as Table from '../Table';
import { Chip } from '../Chip';
import { TypePopup } from './TypePopup';
import { icons } from '../../../../packages/ui';

import { PropDef } from '@/utils/propDefs';

// Use the proper PropDef type
type PropData = PropDef;

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
          <Table.HeaderCell style={{ width: '50%' }}>Type</Table.HeaderCell>
          <Table.HeaderCell style={{ width: '20%' }}>Default</Table.HeaderCell>
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
              <Table.Cell style={{ width: '50%' }}>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}
                >
                  {data[n].type === 'string' && <Chip>string</Chip>}
                  {data[n].type === 'number' && <Chip>number</Chip>}
                  {data[n].type === 'boolean' && <Chip>boolean</Chip>}
                  {data[n].type === 'enum' && enumValues}
                  {data[n].type === 'spacing' && (
                    <>
                      <Chip>0.5, 1, 1.5, 2, 3, ..., 14</Chip>
                      <Chip>string</Chip>
                    </>
                  )}
                  {data[n].type === 'complex' && data[n].complexType && (
                    <TypePopup
                      complexType={data[n].complexType}
                      name={data[n].complexType.name}
                    />
                  )}
                  {data[n].type === 'enum | string' && (
                    <>
                      {enumValues}
                      <Chip>string</Chip>
                    </>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell style={{ width: '20%' }}>
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
