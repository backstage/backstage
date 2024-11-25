import React from 'react';
import * as Table from '../../../../docs/components';
import { Chip } from '../../../../docs/components';
import { listResponsiveValues } from '../../../utils/list-values';
import { responsiveProperties } from '../sprinkles.css';

export const PropsTable = () => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(responsiveProperties.styles)
          .filter(
            n =>
              ![
                'padding',
                'paddingX',
                'paddingY',
                'paddingLeft',
                'paddingRight',
                'paddingTop',
                'paddingBottom',
                'p',
                'px',
                'py',
                'pl',
                'pr',
                'pt',
                'pb',
                'margin',
                'marginX',
                'marginY',
                'marginLeft',
                'marginRight',
                'marginTop',
                'marginBottom',
                'm',
                'mx',
                'my',
                'ml',
                'mr',
                'mt',
                'mb',
              ].includes(n),
          )
          .map(n => (
            <Table.Row key={n}>
              <Table.Cell>
                <Chip head>{n}</Chip>
              </Table.Cell>
              <Table.Cell>
                {listResponsiveValues(
                  n as keyof typeof responsiveProperties.styles,
                ).map(value => (
                  <Chip key={value}>{value}</Chip>
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};
