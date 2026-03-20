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
import { useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AccordionFieldProps } from './schema';

const useStyles = makeStyles(theme => ({
  accordion: {
    marginBottom: theme.spacing(2),
    '&:before': {
      display: 'none',
    },
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
  summary: {
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightMedium as number,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
}));

/**
 * A layout field that wraps child template fields inside a collapsible
 * Material-UI Accordion. Children are always mounted so that validation
 * and default-value population work correctly regardless of expand state.
 *
 * @public
 */
export const AccordionField = (props: AccordionFieldProps) => {
  const {
    schema,
    uiSchema,
    idSchema,
    formData,
    errorSchema,
    onChange,
    onBlur,
    onFocus,
    registry,
    formContext,
    disabled,
    readonly,
  } = props;

  const classes = useStyles();

  const accordionTitle =
    uiSchema?.['ui:options']?.accordionTitle ?? schema.title ?? 'Options';
  const defaultExpanded = uiSchema?.['ui:options']?.defaultExpanded ?? false;

  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const { SchemaField } = registry.fields;
  const properties = schema.properties as Record<string, object> | undefined;
  const requiredFields = schema.required as string[] | undefined;
  const rootId = (idSchema as any)?.$id ?? 'root';

  return (
    <Box mb={2}>
      <Accordion
        expanded={expanded}
        onChange={(_event, isExpanded) => setExpanded(isExpanded)}
        className={classes.accordion}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`${rootId}-accordion-content`}
          id={`${rootId}-accordion-header`}
          className={classes.summary}
        >
          <Typography className={classes.heading}>{accordionTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          {properties &&
            Object.keys(properties).map(key => {
              const propertySchema = properties[key];
              const propertyUiSchema = (uiSchema as any)?.[key] ?? {};
              const propertyIdSchema = (idSchema as any)?.[key] ?? {
                $id: `${rootId}_${key}`,
              };
              const propertyErrorSchema = (errorSchema as any)?.[key] ?? {};

              return (
                <SchemaField
                  key={key}
                  name={key}
                  schema={propertySchema as any}
                  uiSchema={propertyUiSchema}
                  idSchema={propertyIdSchema}
                  formData={(formData as any)?.[key]}
                  errorSchema={propertyErrorSchema}
                  onChange={(value: any) =>
                    onChange({ ...(formData ?? {}), [key]: value })
                  }
                  onBlur={onBlur}
                  onFocus={onFocus}
                  registry={registry}
                  formContext={formContext}
                  disabled={disabled}
                  readonly={readonly}
                  required={requiredFields?.includes(key) ?? false}
                  rawErrors={
                    Object.keys(propertyErrorSchema).length > 0
                      ? propertyErrorSchema.__errors ?? []
                      : []
                  }
                />
              );
            })}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
