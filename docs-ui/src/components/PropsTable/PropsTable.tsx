'use client';

import * as Table from '../Table';
import { Chip } from '../Chip';
import { TypePopup } from './TypePopup';

import { PropDef } from '@/utils/propDefs';

type PropData = PropDef;

type ColumnType = 'prop' | 'type' | 'default' | 'description' | 'responsive';

interface ColumnConfig {
  key: ColumnType;
  width: string;
}

const defaultColumns: ColumnConfig[] = [
  { key: 'prop', width: '16%' },
  { key: 'type', width: '50%' },
  { key: 'default', width: '20%' },
  { key: 'responsive', width: '14%' },
];

const columnLabels: Record<ColumnType, string> = {
  prop: 'Prop',
  type: 'Type',
  default: 'Default',
  description: 'Description',
  responsive: 'Responsive',
};

export const PropsTable = <T extends Record<string, PropData>>({
  data,
  columns = defaultColumns,
}: {
  data: T;
  columns?: ColumnConfig[];
}) => {
  if (!data) return null;

  const renderCell = (
    propName: string,
    propData: PropData,
    column: ColumnType,
  ) => {
    const enumValues =
      Array.isArray(propData.values) &&
      propData.values.map(t => <Chip key={t}>{t}</Chip>);

    switch (column) {
      case 'prop':
        return <Chip head>{propName}</Chip>;

      case 'type':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {propData.type === 'string' && <Chip>string</Chip>}
            {propData.type === 'number' && <Chip>number</Chip>}
            {propData.type === 'boolean' && <Chip>boolean</Chip>}
            {propData.type === 'enum' && enumValues}
            {propData.type === 'spacing' && (
              <>
                <Chip>0.5, 1, 1.5, 2, 3, ..., 14</Chip>
                <Chip>string</Chip>
              </>
            )}
            {propData.type === 'complex' && propData.complexType && (
              <TypePopup
                complexType={propData.complexType}
                name={propData.complexType.name}
              />
            )}
            {propData.type === 'enum | string' && (
              <>
                {enumValues}
                <Chip>string</Chip>
              </>
            )}
          </div>
        );

      case 'default':
        return propData.default ? <Chip>{propData.default}</Chip> : null;

      case 'description':
        return propData.description || null;

      case 'responsive':
        return <Chip>{propData.responsive ? 'Yes' : 'No'}</Chip>;

      default:
        return null;
    }
  };

  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          {columns.map(col => (
            <Table.HeaderCell key={col.key} style={{ width: col.width }}>
              {columnLabels[col.key]}
            </Table.HeaderCell>
          ))}
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(data).map(n => (
          <Table.Row key={n}>
            {columns.map(col => (
              <Table.Cell key={col.key} style={{ width: col.width }}>
                {renderCell(n, data[n], col.key)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
