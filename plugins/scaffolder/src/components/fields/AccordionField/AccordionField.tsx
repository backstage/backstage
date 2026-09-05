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
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AccordionFieldProps } from './schema';

/**
 * Propagates whether any ancestor AccordionField is currently collapsed.
 * When true, all descendant AccordionFields suppress the HTML `required`
 * attribute on their inputs so browser constraint validation is not triggered
 * on hidden (collapsed) form controls.
 */
const AccordionAncestorCollapsedContext = createContext(false);

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

/** Orders property keys according to uiSchema's ui:order array.
 *  A '*' entry acts as a wildcard placeholder for all unmentioned keys.
 *  Keys listed in ui:order that are absent from properties are ignored. */
function orderProperties(
  properties: Record<string, object>,
  uiOrder?: string[],
): string[] {
  const keys = Object.keys(properties);
  if (!uiOrder || uiOrder.length === 0) return keys;

  const wildcardPos = uiOrder.indexOf('*');
  const explicitly = uiOrder.filter(k => k !== '*');
  const rest = keys.filter(k => !explicitly.includes(k));

  if (wildcardPos === -1) {
    return [...explicitly.filter(k => k in properties), ...rest];
  }

  const before = uiOrder.slice(0, wildcardPos).filter(k => k in properties);
  const after = uiOrder.slice(wildcardPos + 1).filter(k => k in properties);
  return [...before, ...rest, ...after];
}

/** Returns true only when the errorSchema contains at least one non-empty
 *  __errors array. RJSF can produce keys with empty arrays (e.g. after
 *  merging extraErrors), so a simple Object.keys().length check would cause
 *  false positives and expand the accordion when there are no real errors. */
function hasNonEmptyErrors(schema: Record<string, any>): boolean {
  if (Array.isArray(schema.__errors) && schema.__errors.length > 0) return true;
  return Object.keys(schema)
    .filter(
      k =>
        k !== '__errors' && schema[k] !== null && typeof schema[k] === 'object',
    )
    .some(k => hasNonEmptyErrors(schema[k]));
}

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

  // True when any ancestor AccordionField is collapsed.
  const ancestorCollapsed = useContext(AccordionAncestorCollapsedContext);
  // This accordion's content is effectively hidden if it is collapsed OR any
  // ancestor accordion is collapsed.
  const effectivelyHidden = !expanded || ancestorCollapsed;

  // Tracks the accumulated form data from this render cycle so that child
  // AccordionField init callbacks (which fire before the parent's) are not
  // overwritten when multiple nested accordions call onChange on mount.
  const accumulatedRef = useRef<Record<string, any>>(formData ?? {});
  accumulatedRef.current = formData ?? {};

  const requiredFields = schema.required as string[] | undefined;

  // Initialise to {} on mount only when the schema declares required children,
  // so AJV can validate them even when the accordion object is absent from the
  // parent form data. Skipping this for fully-optional sections avoids emitting
  // an empty {} into the final template parameters when the user never
  // interacts with the accordion. We also skip if a nested AccordionField has
  // already populated data via its own init (children's effects fire first).
  useEffect(() => {
    const hasRequiredChildren =
      Array.isArray(requiredFields) && requiredFields.length > 0;
    if (
      hasRequiredChildren &&
      formData === undefined &&
      Object.keys(accumulatedRef.current).length === 0
    ) {
      onChange({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (errorSchema !== undefined && hasNonEmptyErrors(errorSchema)) {
      setExpanded(true);
    }
  }, [errorSchema]);

  const { SchemaField } = registry.fields;
  const properties = schema.properties as Record<string, object> | undefined;
  const uiOrder = (uiSchema as any)?.['ui:order'] as string[] | undefined;
  const propertyKeys = properties ? orderProperties(properties, uiOrder) : [];
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
        <AccordionDetails
          id={`${rootId}-accordion-content`}
          className={classes.details}
        >
          {/* display:none provides visual hiding; effectivelyHidden cascades
              via context so nested AccordionFields also suppress `required`
              on their inputs when any ancestor accordion is collapsed. */}
          <AccordionAncestorCollapsedContext.Provider value={effectivelyHidden}>
            <div style={expanded ? undefined : { display: 'none' }}>
              {propertyKeys.map(key => {
                const propertySchema = properties![key];
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
                    onChange={(value: any) => {
                      accumulatedRef.current = {
                        ...accumulatedRef.current,
                        [key]: value,
                      };
                      onChange(accumulatedRef.current);
                    }}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    registry={registry}
                    formContext={formContext}
                    disabled={disabled}
                    readonly={readonly}
                    required={
                      !effectivelyHidden &&
                      (requiredFields?.includes(key) ?? false)
                    }
                    rawErrors={
                      Object.keys(propertyErrorSchema).length > 0
                        ? propertyErrorSchema.__errors ?? []
                        : []
                    }
                  />
                );
              })}
            </div>
          </AccordionAncestorCollapsedContext.Provider>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
