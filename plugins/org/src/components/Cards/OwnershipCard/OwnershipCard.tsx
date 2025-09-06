/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { ComponentsGrid } from './ComponentsGrid';
import { EntityRelationAggregation } from '../types';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { orgTranslationRef } from '../../../translation';
import Box from '@material-ui/core/Box';

/** @public */
export type OwnershipCardClassKey =
  | 'card'
  | 'cardContent'
  | 'list'
  | 'listItemText'
  | 'listItemSecondaryAction'
  | 'grid';

const useStyles = makeStyles(
  theme =>
    createStyles({
      card: {
        maxHeight: '100%',
      },
      cardContent: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
      list: {
        [theme.breakpoints.down('xs')]: {
          padding: `0 0 12px`,
        },
      },
      listItemText: {
        [theme.breakpoints.down('xs')]: {
          paddingRight: 0,
          paddingLeft: 0,
        },
      },
      listItemSecondaryAction: {
        [theme.breakpoints.down('xs')]: {
          width: '100%',
          top: 'auto',
          right: 'auto',
          position: 'relative',
          transform: 'unset',
        },
      },
      grid: {
        overflowY: 'auto',
        marginTop: 0,
      },
      box: {
        overflowY: 'auto',
        padding: theme.spacing(0, 1, 1),
        margin: theme.spacing(0, -1),
      },
    }),
  {
    name: 'PluginOrgOwnershipCard',
  },
);

/** @public */
export const OwnershipCard = (props: {
  variant?: InfoCardVariants;
  entityFilterKind?: string[];
  hideRelationsToggle?: boolean;
  /** @deprecated Please use relationAggregation instead */
  relationsType?: EntityRelationAggregation;
  relationAggregation?: EntityRelationAggregation;
  entityLimit?: number;
  maxScrollHeight?: string;
}) => {
  const {
    variant,
    entityFilterKind,
    hideRelationsToggle,
    entityLimit = 6,
    maxScrollHeight: propMaxScrollHeight,
  } = props;
  const relationAggregation = props.relationAggregation ?? props.relationsType;
  const relationsToggle =
    hideRelationsToggle === undefined ? false : hideRelationsToggle;
  const maxScrollHeight =
    variant !== 'fullHeight' ? propMaxScrollHeight : undefined;
  const classes = useStyles();
  const { entity } = useEntity();
  const { t } = useTranslationRef(orgTranslationRef);

  const defaultRelationAggregation =
    entity.kind === 'User' ? 'aggregated' : 'direct';
  const [getRelationAggregation, setRelationAggregation] = useState(
    relationAggregation ?? defaultRelationAggregation,
  );

  useEffect(() => {
    if (!relationAggregation) {
      setRelationAggregation(defaultRelationAggregation);
    }
  }, [setRelationAggregation, defaultRelationAggregation, relationAggregation]);

  return (
    <InfoCard
      title={t('ownershipCard.title')}
      variant={variant}
      className={classes.card}
      cardClassName={classes.cardContent}
    >
      {!relationsToggle && (
        <List dense>
          <ListItem className={classes.list}>
            <ListItemText className={classes.listItemText} />
            <ListItemSecondaryAction
              className={classes.listItemSecondaryAction}
            >
              {t('ownershipCard.aggregateRelationsToggle.directRelations')}
              <Tooltip
                placement="top"
                arrow
                title={
                  getRelationAggregation === 'direct'
                    ? t(
                        'ownershipCard.aggregateRelationsToggle.directRelations',
                      )
                    : t(
                        'ownershipCard.aggregateRelationsToggle.aggregatedRelations',
                      )
                }
              >
                <Switch
                  color="primary"
                  checked={getRelationAggregation !== 'direct'}
                  onChange={() => {
                    const updatedRelationAggregation =
                      getRelationAggregation === 'direct'
                        ? 'aggregated'
                        : 'direct';
                    setRelationAggregation(updatedRelationAggregation);
                  }}
                  name="pin"
                  inputProps={{
                    'aria-label': t(
                      'ownershipCard.aggregateRelationsToggle.ariaLabel',
                    ),
                  }}
                />
              </Tooltip>
              {t('ownershipCard.aggregateRelationsToggle.aggregatedRelations')}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      )}
      <Box maxHeight={maxScrollHeight} className={classes.box}>
        <ComponentsGrid
          className={classes.grid}
          entity={entity}
          entityLimit={entityLimit}
          relationAggregation={getRelationAggregation}
          entityFilterKind={entityFilterKind}
        />
      </Box>
    </InfoCard>
  );
};
