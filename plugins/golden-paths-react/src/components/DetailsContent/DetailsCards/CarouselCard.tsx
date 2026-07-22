/*
 * Copyright 2026 The Backstage Authors
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
import { PropsWithChildren, useCallback, useState } from 'react';
import {
  Card,
  CardHeader,
  Collapse,
  CardContent,
  Divider,
  Box,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import ArrowIcon from '../../../icons/arrow.svg';
import { GoldenPathEntityStepV1beta1 } from '@backstage/plugin-golden-paths-common';
import { useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  EntityRefLinks,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { FavoriteEntity } from '@backstage/plugin-catalog-react';
import { useCarouselCardStyles } from './DetailsCards.styles';
import ErrorCard from './ErrorCard';
import useAsyncRetry from 'react-use/esm/useAsyncRetry';

interface Props {
  item: GoldenPathEntityStepV1beta1;
  isLast: boolean;
}

const CarouselCard = ({ item, isLast }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const classes = useCarouselCardStyles();
  const toggle = () => setExpanded(prev => !prev);
  const catalogApi = useApi(catalogApiRef);
  const {
    value: template,
    error,
    loading,
    retry,
  } = useAsyncRetry(async (): Promise<Entity | undefined> => {
    if (!item || !item.template) return undefined;
    return await catalogApi.getEntityByRef(item.template);
  });

  const owners = getEntityRelations(template, RELATION_OWNED_BY);
  const isTemplateName = !!(
    template?.metadata?.title || template?.metadata?.name
  );
  const Wrapper = useCallback(
    ({ children }: PropsWithChildren) => (
      <Box className={classes.wrapper} onClick={toggle}>
        <img src={ArrowIcon} alt="" className={classes.arrow} />
        {children}
        {isLast && <img src={ArrowIcon} alt="" className={classes.arrow} />}
      </Box>
    ),
    [classes, isLast],
  );

  if (error) {
    return (
      <Wrapper>
        <ErrorCard message="Couldn’t load template" onRetry={retry} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Card className={classes.card}>
        {loading ? (
          <Box className={classes.loadingHeader}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {isTemplateName ? (
              <CardHeader
                classes={{ root: classes.header }}
                title={
                  <Box className={classes.titleBox}>
                    <Typography>{template?.spec?.type as string}</Typography>
                    {template && (
                      <FavoriteEntity
                        className={classes.favoriteIcon}
                        entity={template}
                      />
                    )}
                  </Box>
                }
                subheader={
                  <Typography className={classes.subheader} variant="h6">
                    {template?.metadata?.title || template?.metadata?.name}
                  </Typography>
                }
              />
            ) : (
              <CardHeader
                classes={{ root: classes.noTemplateHeader }}
                title={<Typography>No Template Found</Typography>}
                subheader={
                  <Typography variant="body2" color="textSecondary">
                    {`No template exists for "${item.name}".`}
                  </Typography>
                }
              />
            )}
            {template && (
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {template?.metadata.description}
                  </Typography>
                  <Divider className={classes.divider} />
                  <Box className={classes.linkBox}>
                    <EntityRefLinks entityRefs={owners} />
                  </Box>
                </CardContent>
              </Collapse>
            )}
          </>
        )}
      </Card>
    </Wrapper>
  );
};

export default CarouselCard;
