/*
 * Copyright 2025 The Backstage Authors
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
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DescriptionIcon from '@material-ui/icons/Description';
import { Link } from '@backstage/core-components';
import {
  entityRouteParams,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { useApp, useRouteRef } from '@backstage/core-plugin-api';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { scaffolderReactTranslationRef } from '../../../translation';
import { useTranslationRef } from '@backstage/frontend-plugin-api';

export interface TemplateDetailButtonProps {
  template: Entity;
}

export const TemplateDetailButton = ({
  template,
}: TemplateDetailButtonProps) => {
  const catalogEntityRoute = useRouteRef(entityRouteRef);
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const entityRef = stringifyEntityRef(template);

  const app = useApp();
  const TemplateIcon = app.getSystemIcon('kind:template') || DescriptionIcon;

  return (
    <Tooltip id={`tooltip-${entityRef}`} title={t('cardHeader.detailBtnTitle')}>
      <IconButton
        aria-label={t('cardHeader.detailBtnTitle')}
        id={`viewDetail-${entityRef}`}
        style={{ padding: 0 }}
        color="inherit"
      >
        <Typography component="span">
          <Link
            to={catalogEntityRoute(entityRouteParams(template))}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <TemplateIcon />
          </Link>
        </Typography>
      </IconButton>
    </Tooltip>
  );
};
