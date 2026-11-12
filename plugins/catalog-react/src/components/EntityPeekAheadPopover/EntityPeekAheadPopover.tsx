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

import useAsyncFn from 'react-use/esm/useAsyncFn';
import { catalogApiRef } from '../../api';
import {
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Popover from '@material-ui/core/Popover';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useApiHolder } from '@backstage/core-plugin-api';
import { isGroupEntity, isUserEntity } from '@backstage/catalog-model';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import {
  EntityCardActions,
  UserCardActions,
  GroupCardActions,
} from './CardActionComponents';
import { debounce, uniqueId } from 'lodash';
import { catalogReactTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Properties for an entity popover on hover of a component.
 *
 * @public
 */
export type EntityPeekAheadPopoverProps = PropsWithChildren<{
  entityRef: string;
  delayTime?: number;
}>;

const useStyles = makeStyles(() => {
  return {
    popover: {
      pointerEvents: 'none',
    },
    popoverPaper: {
      width: '30em',
      pointerEvents: 'auto',
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

/**
 * Shows an entity popover on hover of a component.
 *
 * @public
 */
export const EntityPeekAheadPopover = (props: EntityPeekAheadPopoverProps) => {
  const { entityRef, children, delayTime = 500 } = props;
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const classes = useStyles();
  const apiHolder = useApiHolder();
  const [popupId] = useState(() => uniqueId('entity-peek-ahead-'));
  const triggerRef = useRef<HTMLSpanElement>(null);
  const paperRef = useRef<HTMLElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const debouncedOpen = useMemo(
    () => debounce((anchor: HTMLElement) => setAnchorEl(anchor), delayTime),
    [delayTime],
  );

  useEffect(() => () => debouncedOpen.cancel(), [debouncedOpen]);

  const handleClose = () => {
    debouncedOpen.cancel();
    setAnchorEl(null);
  };

  const handleLeave = (event: MouseEvent | FocusEvent) => {
    const target = event.relatedTarget;
    if (
      target instanceof Node &&
      (triggerRef.current?.contains(target) ||
        paperRef.current?.contains(target))
    ) {
      return;
    }
    handleClose();
  };

  const [{ loading, error, value: entity }, load] = useAsyncFn(async () => {
    const catalogApi = apiHolder.get(catalogApiRef);
    if (catalogApi) {
      const retrievedEntity = await catalogApi.getEntityByRef(entityRef);
      if (!retrievedEntity) {
        throw new Error(`${entityRef} not found`);
      }
      return retrievedEntity;
    }
    return undefined;
  }, [apiHolder, entityRef]);

  useEffect(() => {
    if (anchorEl && !entity && !error && !loading) {
      load();
    }
  }, [anchorEl, load, entity, error, loading]);

  return (
    <>
      <Typography
        component="span"
        ref={triggerRef}
        onMouseEnter={event => debouncedOpen(event.currentTarget)}
        onMouseLeave={handleLeave}
        onFocus={event => debouncedOpen(event.currentTarget)}
        onBlur={handleLeave}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            handleClose();
          }
        }}
        aria-owns={anchorEl ? popupId : undefined}
        aria-haspopup="true"
      >
        {children}
      </Typography>
      <Popover
        id={popupId}
        className={classes.popover}
        PaperProps={{
          className: classes.popoverPaper,
          onMouseLeave: handleLeave,
          onBlur: handleLeave,
        }}
        TransitionProps={{
          onEntering: element => {
            paperRef.current = element;
          },
          onExited: () => {
            paperRef.current = null;
          },
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
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
          <CardContent>
            {error && <ResponseErrorPanel error={error} />}
            {loading && <Progress />}
            {entity && (
              <>
                <Typography color="textSecondary">
                  {entity.metadata.namespace}
                </Typography>
                <Typography variant="h5" component="div">
                  {entity.metadata.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {entity.kind}
                </Typography>
                {entity.metadata.description && (
                  <Typography
                    className={classes.descriptionTypography}
                    paragraph
                  >
                    {entity.metadata.description}
                  </Typography>
                )}
                <Typography>{entity.spec?.type?.toString()}</Typography>
                <Box marginTop="0.5em">
                  {(entity.metadata.tags || [])
                    .slice(0, maxTagChips)
                    .map(tag => {
                      return <Chip key={tag} size="small" label={tag} />;
                    })}
                  {entity.metadata.tags?.length &&
                    entity.metadata.tags?.length > maxTagChips && (
                      <Tooltip title={t('entityPeekAheadPopover.title')}>
                        <Chip key="other-tags" size="small" label="..." />
                      </Tooltip>
                    )}
                </Box>
              </>
            )}
          </CardContent>
          {!error && entity && (
            <CardActions>
              <>
                {isUserEntity(entity) && <UserCardActions entity={entity} />}
                {isGroupEntity(entity) && <GroupCardActions entity={entity} />}
                <EntityCardActions entity={entity} />
              </>
            </CardActions>
          )}
        </Card>
      </Popover>
    </>
  );
};
