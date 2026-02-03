'use client';

import { useState } from 'react';
import * as Table from '../Table';
import { Chip } from '../Chip';
import { SpacingPopup } from './SpacingPopup';
import type { SpacingGroupDef } from '@/utils/propDefs';
import { RiArrowDownSLine, RiArrowRightSLine } from '@remixicon/react';
import styles from './SpacingGroupRow.module.css';

interface SpacingGroupRowProps {
  spacingGroup: SpacingGroupDef;
  description?: React.ReactNode;
  columns: Array<{ key: string; width: string }>;
}

export const SpacingGroupRow = ({
  spacingGroup,
  description,
  columns,
}: SpacingGroupRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Separate padding and margin props
  const paddingProps = spacingGroup.props.filter(prop =>
    prop.name.startsWith('p'),
  );
  const marginProps = spacingGroup.props.filter(prop =>
    prop.name.startsWith('m'),
  );

  const renderCell = (columnKey: string) => {
    switch (columnKey) {
      case 'prop':
        return (
          <button
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span className={styles.propName}>
              Spacing props{' '}
              <span className={styles.count}>
                ({spacingGroup.props.length})
              </span>
            </span>
            {isExpanded ? (
              <RiArrowDownSLine className={styles.icon} size={16} />
            ) : (
              <RiArrowRightSLine className={styles.icon} size={16} />
            )}
          </button>
        );

      case 'type':
        return <SpacingPopup values={spacingGroup.values} />;

      case 'default':
        return '-';

      case 'description':
        return description ? (
          <span style={{ fontSize: '14px' }}>{description}</span>
        ) : null;

      case 'responsive':
        return <Chip>{spacingGroup.responsive ? 'Yes' : 'No'}</Chip>;

      default:
        return null;
    }
  };

  return (
    <>
      <Table.Row>
        {columns.map(col => (
          <Table.Cell key={col.key} style={{ width: col.width }}>
            {renderCell(col.key)}
          </Table.Cell>
        ))}
      </Table.Row>
      {isExpanded && (
        <Table.Row>
          <Table.Cell colSpan={columns.length}>
            <div className={styles.expandedContent}>
              <div className={styles.twoColumnLayout}>
                {/* Padding Column */}
                {paddingProps.length > 0 && (
                  <div className={styles.column}>
                    <div className={styles.columnTitle}>Padding</div>
                    <div className={styles.propsGrid}>
                      {paddingProps.map(prop => (
                        <div key={prop.name} className={styles.propRow}>
                          <div className={styles.propRowName}>
                            <Chip head>{prop.name}</Chip>
                          </div>
                          <div className={styles.propRowDescription}>
                            {prop.description}
                          </div>
                          {prop.default && (
                            <div className={styles.propRowDefault}>
                              Default: <Chip>{prop.default}</Chip>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Margin Column */}
                {marginProps.length > 0 && (
                  <div className={styles.column}>
                    <div className={styles.columnTitle}>Margin</div>
                    <div className={styles.propsGrid}>
                      {marginProps.map(prop => (
                        <div key={prop.name} className={styles.propRow}>
                          <div className={styles.propRowName}>
                            <Chip head>{prop.name}</Chip>
                          </div>
                          <div className={styles.propRowDescription}>
                            {prop.description}
                          </div>
                          {prop.default && (
                            <div className={styles.propRowDefault}>
                              Default: <Chip>{prop.default}</Chip>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Table.Cell>
        </Table.Row>
      )}
    </>
  );
};
