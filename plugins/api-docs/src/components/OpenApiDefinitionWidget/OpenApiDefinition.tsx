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

import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const useStyles = makeStyles(theme => ({
  root: {
    '& .swagger-ui': {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,

      [`& .scheme-container`]: {
        backgroundColor: theme.palette.background.default,
      },
      [`& .opblock-tag,
          .opblock-tag small,
          table thead tr td,
          table thead tr th`]: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
      },
      [`& section.models,
          section.models.is-open h4`]: {
        borderColor: theme.palette.divider,
      },
      [`& .model-title,
          .model .renderedMarkdown,
          .model .description`]: {
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeightRegular,
      },
      [`& h1, h2, h3, h4, h5, h6,
          .errors h4, .error h4, .opblock h4, section.models h4,
          .response-control-media-type__accept-message,
          .opblock-summary-description,
          .opblock-summary-operation-id,
          .opblock-summary-path,
          .opblock-summary-path__deprecated,
          .opblock-external-docs-wrapper,
          .opblock-section-header .btn,
          .opblock-section-header>label,
          .scheme-container .schemes>label,a.nostyle,
          .parameter__name,
          .response-col_status,
          .response-col_links,
          .error .btn,
          .info .title,
          .info .base-url`]: {
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
      },
      [`& .opblock .opblock-section-header, 
          .model-box,
          section.models .model-container`]: {
        background: theme.palette.background.default,
      },
      [`& .prop-format,
          .parameter__in`]: {
        color: theme.palette.text.disabled,
      },
      [`& table.model, 
          .parameter__type,
          .model.model-title,
          .model-title,
          .model span,
          .model .brace-open,
          .model .brace-close,
          .model .property.primitive,
          .model .renderedMarkdown,
          .model .description,
          .errors small`]: {
        color: theme.palette.text.secondary,
      },
      [`& .parameter__name.required:after`]: {
        color: theme.palette.warning.dark,
      },
      [`& table.model, 
          table.model .model,
          .opblock-external-docs-wrapper`]: {
        fontSize: theme.typography.fontSize,
      },
      [`& table.headers td`]: {
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
      },
      [`& .model-hint`]: {
        color: theme.palette.text.hint,
        backgroundColor: theme.palette.background.paper,
      },
      [`& .opblock-summary-method, 
          .info a`]: {
        fontFamily: theme.typography.fontFamily,
      },
      [`& .info, .opblock, .tab`]: {
        [`& li, p`]: {
          fontFamily: theme.typography.fontFamily,
          color: theme.palette.text.primary,
        },
      },
      [`& a`]: {
        color: theme.palette.primary.main,
      },
      [`& .renderedMarkdown code`]: {
        color: theme.palette.secondary.light,
      },
      [`& .property-row td:first-child`]: {
        color: theme.palette.text.primary,
      },
      [`& span.prop-type`]: {
        color: theme.palette.success.light,
      },
    },
  },
}));

export type OpenApiDefinitionProps = {
  definition: string;
};

export const OpenApiDefinition = ({ definition }: OpenApiDefinitionProps) => {
  const classes = useStyles();

  // Due to a bug in the swagger-ui-react component, the component needs
  // to be created without content first.
  const [def, setDef] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDef(definition), 0);
    return () => clearTimeout(timer);
  }, [definition, setDef]);

  return (
    <div className={classes.root}>
      <SwaggerUI spec={def} url="" deepLinking />
    </div>
  );
};
