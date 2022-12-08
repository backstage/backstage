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
import { entityRouteRef } from '../../routes';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { catalogApiRef } from '../../api';
import React, { PropsWithChildren, useEffect } from 'react';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Alert, Skeleton } from '@material-ui/lab';
import EmailIcon from '@material-ui/icons/Email';
import InfoIcon from '@material-ui/icons/Info';
import { useApiHolder, useRouteRef } from '@backstage/core-plugin-api';
import {
  CompoundEntityRef,
  isUserEntity,
  isGroupEntity,
} from '@backstage/catalog-model';
import { Link, Progress } from '@backstage/core-components';

export type EntityPeekAheadPopoverProps = {
  entityRef: CompoundEntityRef;
};

const useStyles = makeStyles(() => {
  return {
    popoverPaper: {
      width: '30em',
    },
    descriptionTypography: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
  };
});

const maxTagChips = 4;

export const EntityPeekAheadPopover = ({
  entityRef,
  children,
}: PropsWithChildren<EntityPeekAheadPopoverProps>) => {
  const entityRoute = useRouteRef(entityRouteRef);
  const classes = useStyles();
  const apiHolder = useApiHolder();
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'entity-peek-ahead',
  });

  const [{ loading, error, value: entity }, load] = useAsyncFn(async () => {
    const catalogApi = apiHolder.get(catalogApiRef);
    if (catalogApi) {
      const retrievedEntity = await catalogApi.getEntityByRef(entityRef);
      if (!retrievedEntity) {
        throw new Error(`${entityRef.name} was not found`);
      }
      return retrievedEntity;
    }
    return undefined;
  }, [apiHolder, entityRef]);

  useEffect(() => {
    if (popupState.isOpen && !entity && !error && !loading) {
      load();
    }
  }, [popupState.isOpen, load, entity, error, loading]);

  return (
    <>
      <div data-testid="trigger" {...bindHover(popupState)}>
        {children}
      </div>
      <HoverPopover
        PaperProps={{
          className: classes.popoverPaper,
        }}
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Card>
          {loading && <Progress />}
          <CardContent>
            <Typography color="textSecondary">{entityRef.namespace}</Typography>
            <Typography variant="h5" component="div">
              {entityRef.name}
            </Typography>
            {error && <Alert severity="warning">{error.message}</Alert>}
            {entity ? (
              <>
                <Typography color="textSecondary">{entity.kind}</Typography>
                <Typography className={classes.descriptionTypography} paragraph>
                  {entity.metadata.description}
                </Typography>
                <Typography>{entity.spec?.type}</Typography>
                <Box marginTop="0.5em">
                  {(entity.metadata.tags || [])
                    .slice(0, maxTagChips)
                    .map(tag => {
                      return <Chip size="small" label={tag} />;
                    })}
                  {entity.metadata.tags?.length &&
                    entity.metadata.tags?.length > maxTagChips && (
                      <Tooltip title="Drill into the entity to see all of the tags.">
                        <Chip size="small" label="..." />
                      </Tooltip>
                    )}
                </Box>
              </>
            ) : (
              <>
                <Skeleton width="30%" variant="text" />
                <Skeleton variant="text" />
                <Skeleton width="50%" variant="text" />
                <Skeleton width="20%" variant="text" />
              </>
            )}
          </CardContent>
          <CardActions>
            {entity &&
              (isUserEntity(entity) || isGroupEntity(entity)) &&
              entity.spec.profile?.email && (
                <Tooltip title={`Email ${entity.spec.profile.email}`}>
                  <Button
                    target="_blank"
                    href={`mailto:${entity.spec.profile.email}`}
                    size="small"
                  >
                    <EmailIcon color="action" />
                  </Button>
                </Tooltip>
              )}
            <Tooltip title="Show details">
              <Link component="button" to={entityRoute(entityRef)}>
                <InfoIcon color="action" />
              </Link>
            </Tooltip>
          </CardActions>
        </Card>
      </HoverPopover>
    </>
  );
};
