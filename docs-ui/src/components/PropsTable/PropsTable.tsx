'use client';

import * as Table from '../Table';
import { Chip } from '../Chip';
import { TypePopup } from './TypePopup';
import { SpacingPopup } from './SpacingPopup';
import { SpacingGroupRow } from './SpacingGroupRow';

import { PropDef } from '@/utils/propDefs';

type PropData = PropDef;

type ColumnType = 'prop' | 'type' | 'default' | 'description' | 'responsive';

interface ColumnConfig {
  key: ColumnType;
  width: string;
}

const defaultColumns: ColumnConfig[] = [
  { key: 'prop' as const, width: '15%' },
  { key: 'type' as const, width: '25%' },
  { key: 'default' as const, width: '15%' },
  { key: 'description' as const, width: '45%' },
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
            {propData.type === 'spacing' && Array.isArray(propData.values) && (
              <SpacingPopup values={propData.values} />
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
        return propData.default ? <Chip>{propData.default}</Chip> : '-';

      case 'description':
        return propData.description ? (
          <span style={{ fontSize: '14px' }}>{propData.description}</span>
        ) : null;

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
        {Object.keys(data).map(n => {
          const propData = data[n];

          // Handle spacing-group type
          if (propData.type === 'spacing-group' && propData.spacingGroup) {
            return (
              <SpacingGroupRow
                key={n}
                spacingGroup={propData.spacingGroup}
                description={propData.description}
                columns={columns}
              />
            );
          }

          // Handle regular props
          return (
            <Table.Row key={n}>
              {columns.map(col => (
                <Table.Cell key={col.key} style={{ width: col.width }}>
                  {renderCell(n, propData, col.key)}
                </Table.Cell>
              ))}
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};
