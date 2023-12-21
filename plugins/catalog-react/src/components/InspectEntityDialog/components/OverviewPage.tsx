/*
 * Copyright 2022 The Backstage Authors
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

import { AlphaEntity } from '@backstage/catalog-model/alpha';
import {
  Box,
  DialogContentText,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  makeStyles,
  Typography,
} from '@material-ui/core';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import React from 'react';
import { EntityRefLink } from '../../EntityRefLink';
import {
  Container,
  HelpIcon,
  KeyValueListItem,
  ListItemText,
  ListSubheader,
} from './common';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { CopyTextButton } from '@backstage/core-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export function OverviewPage(props: { entity: AlphaEntity }) {
  const classes = useStyles();
  const {
    apiVersion,
    kind,
    metadata,
    spec,
    relations = [],
    status = {},
  } = props.entity;

  const groupedRelations = groupBy(
    sortBy(relations, r => r.targetRef),
    'type',
  );

  const entityRef = stringifyEntityRef(props.entity);
  return (
    <>
      <DialogContentText variant="h2">Overview</DialogContentText>
      <div className={classes.root}>
        <Container title="Identity">
          <List dense>
            <ListItem>
              <ListItemText primary="apiVersion" secondary={apiVersion} />
            </ListItem>
            <ListItem>
              <ListItemText primary="kind" secondary={kind} />
            </ListItem>
            {spec?.type && (
              <ListItem>
                <ListItemText
                  primary="spec.type"
                  secondary={spec.type?.toString()}
                />
              </ListItem>
            )}
            {metadata.uid && (
              <ListItem>
                <ListItemText primary="uid" secondary={metadata.uid} />
                <ListItemSecondaryAction>
                  <CopyTextButton text={metadata.uid} />
                </ListItemSecondaryAction>
              </ListItem>
            )}
            {metadata.etag && (
              <ListItem>
                <ListItemText primary="etag" secondary={metadata.etag} />
                <ListItemSecondaryAction>
                  <CopyTextButton text={metadata.etag} />
                </ListItemSecondaryAction>
              </ListItem>
            )}
            <ListItem>
              <ListItemText primary="entityRef" secondary={entityRef} />
              <ListItemSecondaryAction>
                <CopyTextButton text={entityRef} />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Container>

        <Container title="Metadata">
          {!!Object.keys(metadata.annotations || {}).length && (
            <List
              dense
              subheader={
                <ListSubheader>
                  Annotations
                  <HelpIcon to="https://backstage.io/docs/features/software-catalog/well-known-annotations" />
                </ListSubheader>
              }
            >
              {Object.entries(metadata.annotations!).map(entry => (
                <KeyValueListItem key={entry[0]} indent entry={entry} />
              ))}
            </List>
          )}
          {!!Object.keys(metadata.labels || {}).length && (
            <List dense subheader={<ListSubheader>Labels</ListSubheader>}>
              {Object.entries(metadata.labels!).map(entry => (
                <KeyValueListItem key={entry[0]} indent entry={entry} />
              ))}
            </List>
          )}
          {!!metadata.tags?.length && (
            <List dense subheader={<ListSubheader>Tags</ListSubheader>}>
              {metadata.tags.map((tag, index) => (
                <ListItem key={`${tag}-${index}`}>
                  <ListItemIcon />
                  <ListItemText primary={tag} />
                </ListItem>
              ))}
            </List>
          )}
        </Container>

        {!!relations.length && (
          <Container
            title="Relations"
            helpLink="https://backstage.io/docs/features/software-catalog/well-known-relations"
          >
            {Object.entries(groupedRelations).map(
              ([type, groupRelations], index) => (
                <div key={index}>
                  <List dense subheader={<ListSubheader>{type}</ListSubheader>}>
                    {groupRelations.map(group => (
                      <ListItem key={group.targetRef}>
                        <ListItemText
                          primary={
                            <EntityRefLink entityRef={group.targetRef} />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </div>
              ),
            )}
          </Container>
        )}

        {!!status.items?.length && (
          <Container
            title="Status"
            helpLink="https://backstage.io/docs/features/software-catalog/well-known-statuses"
          >
            {status.items.map((item, index) => (
              <div key={index}>
                <Typography>
                  {item.level}: {item.type}
                </Typography>
                <Box ml={2}>{item.message}</Box>
              </div>
            ))}
          </Container>
        )}
      </div>
    </>
  );
}
