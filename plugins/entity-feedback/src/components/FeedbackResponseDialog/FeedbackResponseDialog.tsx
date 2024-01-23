/*
 * Copyright 2023 The Backstage Authors
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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Progress } from '@backstage/core-components';
import {
  ErrorApiError,
  errorApiRef,
  useApi,
  alertApiRef,
} from '@backstage/core-plugin-api';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  makeStyles,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { ReactNode, useState } from 'react';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { entityFeedbackApiRef } from '../../api';

/**
 * @public
 */
export interface EntityFeedbackResponse {
  id: string;
  label: string;
  mustComment?: boolean;
}

const defaultFeedbackResponses: EntityFeedbackResponse[] = [
  { id: 'incorrect', label: 'Incorrect info' },
  { id: 'missing', label: 'Missing info' },
  { id: 'other', label: 'Other (please specify below)', mustComment: true },
];

/**
 * @public
 */
export interface FeedbackResponseDialogProps {
  entity: Entity;
  feedbackDialogResponses?: EntityFeedbackResponse[];
  feedbackDialogTitle?: ReactNode;
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles({
  contactConsent: {
    marginTop: '5px',
  },
});

export const FeedbackResponseDialog = (props: FeedbackResponseDialogProps) => {
  const {
    entity,
    feedbackDialogResponses = defaultFeedbackResponses,
    feedbackDialogTitle = 'Please provide feedback on what can be improved',
    open,
    onClose,
  } = props;
  const classes = useStyles();
  const errorApi = useApi(errorApiRef);
  const feedbackApi = useApi(entityFeedbackApiRef);
  const alertApi = useApi(alertApiRef);
  const [responseSelections, setResponseSelections] = useState(
    Object.fromEntries(feedbackDialogResponses.map(r => [r.id, false])),
  );
  const [comments, setComments] = useState('');
  const [consent, setConsent] = useState(true);
  const requireComments = feedbackDialogResponses
    .filter(r => r.mustComment)
    .map(r => r.id);

  const isMandatedBoxChecked = () => {
    const checkedBoxes = Object.keys(responseSelections).filter(
      id => responseSelections[id],
    );
    return checkedBoxes.some(id => requireComments.includes(id));
  };

  const [{ loading: saving }, saveResponse] = useAsyncFn(async () => {
    if (requireComments.length > 0) {
      if (comments.length === 0 && isMandatedBoxChecked()) {
        alertApi.post({
          message:
            'The selected option(s) require a comment. Please provide a comment.',
          severity: 'info',
        });
        return;
      }
      if (comments.length > 0 && !isMandatedBoxChecked()) {
        alertApi.post({
          message: 'Please select the option(s) that require a comment.',
          severity: 'info',
        });
        return;
      }
    }
    try {
      await feedbackApi.recordResponse(stringifyEntityRef(entity), {
        comments,
        consent,
        response: Object.keys(responseSelections)
          .filter(id => responseSelections[id])
          .join(','),
      });
      onClose();
    } catch (e) {
      errorApi.post(e as ErrorApiError);
    }
  }, [comments, consent, entity, feedbackApi, onClose, responseSelections]);

  const selectMandatedBox = (res: boolean) => {
    const newResponseSelections = { ...responseSelections };
    requireComments.forEach(id => newResponseSelections[id] === res);
    setResponseSelections(newResponseSelections);
  };

  const verifyComments = (e: any) => {
    setComments(e.target.value);
    if (requireComments.length > 0) {
      selectMandatedBox(true);
      if (e.target.value.length === 0) {
        selectMandatedBox(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={() => !saving && onClose()}>
      {saving && <Progress />}
      <DialogTitle>{feedbackDialogTitle}</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">Choose all that apply</FormLabel>
          <FormGroup>
            {feedbackDialogResponses.map(response => (
              <FormControlLabel
                key={response.id}
                control={
                  <Checkbox
                    checked={responseSelections[response.id]}
                    disabled={saving}
                    name={response.id}
                    onChange={e =>
                      setResponseSelections({
                        ...responseSelections,
                        [e.target.name]: e.target.checked,
                      })
                    }
                  />
                }
                label={response.label}
              />
            ))}
          </FormGroup>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            data-testid="feedback-response-dialog-comments-input"
            disabled={saving}
            label="Additional comments"
            multiline
            minRows={2}
            onChange={e => verifyComments(e)}
            variant="outlined"
            value={comments}
          />
        </FormControl>
        <Typography className={classes.contactConsent}>
          Can we reach out to you for more info?
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>No</Grid>
            <Grid item>
              <Switch
                checked={consent}
                disabled={saving}
                onChange={e => setConsent(e.target.checked)}
              />
            </Grid>
            <Grid item>Yes</Grid>
          </Grid>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" disabled={saving} onClick={onClose}>
          Close
        </Button>
        <Button
          color="primary"
          data-testid="feedback-response-dialog-submit-button"
          disabled={saving}
          onClick={saveResponse}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
