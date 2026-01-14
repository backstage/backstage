'use client';

import { Chip } from '../Chip';
import * as Table from '../Table';
import { TypePopup } from './TypePopup';

import { PropDef } from '@/utils/propDefs';

// Use the proper PropDef type
type PropData = PropDef;

// Modify the PropsTable component to use the new type
export const PropsTable = <T extends Record<string, PropData>>({
  data,
  isHook,
}: {
  data: T;
  isHook?: boolean;
}) => {
  if (!data) return null;

  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell style={{ width: isHook ? '30%' : '16%' }}>
            Prop
          </Table.HeaderCell>
          <Table.HeaderCell style={{ width: '40%' }}>Type</Table.HeaderCell>
          <Table.HeaderCell style={{ width: isHook ? '30%' : '20%' }}>
            Default
          </Table.HeaderCell>
          {!isHook && (
            <Table.HeaderCell style={{ width: '14%' }}>
              Responsive
            </Table.HeaderCell>
          )}
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(data).map(n => {
          const enumValues =
            Array.isArray(data[n].values) &&
            data[n].values.map(t => <Chip key={t}>{t}</Chip>);

          return (
            <Table.Row key={n}>
              <Table.Cell style={{ width: isHook ? '30%' : '16%' }}>
                <Chip head>{n}</Chip>
              </Table.Cell>
              <Table.Cell style={{ width: '40%' }}>
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
              <Table.Cell style={{ width: isHook ? '30%' : '20%' }}>
                <Chip>{data[n].default ? data[n].default : '-'}</Chip>
              </Table.Cell>
              {!isHook && (
                <Table.Cell style={{ width: '14%' }}>
                  <Chip>{data[n].responsive ? 'Yes' : 'No'}</Chip>
                </Table.Cell>
              )}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};
