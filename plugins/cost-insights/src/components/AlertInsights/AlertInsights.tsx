/*
 * Copyright 2020 Spotify AB
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

import React, { useCallback, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import { Box, Grid, Snackbar } from '@material-ui/core';
import { default as MuiAlert } from '@material-ui/lab/Alert';
import { AlertDialog } from './AlertDialog';
import { AlertStatusSummary } from './AlertStatusSummary';
import { AlertStatusSummaryButton } from './AlertStatusSummaryButton';
import { AlertInsightsHeader } from './AlertInsightsHeader';
import { AlertInsightsSection } from './AlertInsightsSection';
import {
  useAlerts,
  useScroll,
  useLoading,
  ScrollType,
  MapLoadingToProps,
} from '../../hooks';
import { DefaultLoadingAction } from '../../utils/loading';
import { Alert, AlertOptions, Maybe } from '../../types';
import { sumOfAllAlerts } from '../../utils/alerts';

type MapLoadingtoAlerts = (isLoading: boolean) => void;

const mapLoadingToAlerts: MapLoadingToProps<MapLoadingtoAlerts> = ({
  dispatch,
}) => (isLoading: boolean) =>
  dispatch({ [DefaultLoadingAction.CostInsightsAlerts]: isLoading });

type AlertInsightsProps = {
  group: string;
  active: Alert[];
  snoozed: Alert[];
  accepted: Alert[];
  dismissed: Alert[];
};

export const AlertInsights = ({
  group,
  active,
  snoozed,
  accepted,
  dismissed,
}: AlertInsightsProps) => {
  const [alerts, setAlerts] = useAlerts();
  const [scroll, , ScrollAnchor] = useScroll();
  const dispatchLoadingAlerts = useLoading(mapLoadingToAlerts);
  // Allow users to pass null values for data.
  const [data, setData] = useState<Maybe<any>>(undefined);
  const [error, setError] = useState<Maybe<Error>>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);

  const closeDialog = useCallback(() => {
    setData(undefined);
    setDialogOpen(false);
    setAlerts({ dismissed: null, snoozed: null, accepted: null });
  }, [setAlerts]);

  useEffect(() => {
    async function callHandler(
      options: AlertOptions,
      callback: (options: AlertOptions) => Promise<Alert[]>,
    ) {
      closeDialog();
      dispatchLoadingAlerts(true);
      try {
        const a: Alert[] = await callback(options);
        setAlerts({ alerts: a });
      } catch (e) {
        setError(e);
      } finally {
        dispatchLoadingAlerts(false);
      }
    }

    const options: AlertOptions = { data, group };
    const onSnoozed = alerts.snoozed?.onSnoozed?.bind(alerts.snoozed) ?? null;
    const onAccepted =
      alerts.accepted?.onAccepted?.bind(alerts.accepted) ?? null;
    const onDismissed =
      alerts.dismissed?.onDismissed?.bind(alerts.dismissed) ?? null;

    if (data !== undefined) {
      if (onSnoozed) {
        callHandler(options, onSnoozed);
      } else if (onAccepted) {
        callHandler(options, onAccepted);
      } else if (onDismissed) {
        callHandler(options, onDismissed);
      }
    }
  }, [group, data, alerts, setAlerts, closeDialog, dispatchLoadingAlerts]);

  useEffect(() => {
    if (scroll === ScrollType.AlertSummary) {
      setSummaryOpen(true);
    }
  }, [scroll]);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    } else {
      setSnackbarOpen(false);
    }
  }, [error]);

  useEffect(() => {
    function toggleDialogOnStatusChange() {
      const isAlertSnoozed = !!alerts.snoozed;
      const isAlertAccepted = !!alerts.accepted;
      const isAlertDismissed = !!alerts.dismissed;

      if (isAlertSnoozed || isAlertDismissed || isAlertAccepted) {
        setDialogOpen(true);
      } else {
        setDialogOpen(false);
      }
    }

    toggleDialogOnStatusChange();
  }, [alerts.snoozed, alerts.dismissed, alerts.accepted]);

  function onSnackbarClose() {
    setError(null);
  }

  function onDialogSubmit(data: any) {
    setData(data);
  }

  function onSummaryButtonClick() {
    setSummaryOpen(prevOpen => !prevOpen);
  }

  const total = [accepted, snoozed, dismissed].reduce(sumOfAllAlerts, 0);

  const isAlertStatusSummaryDisplayed = !!total;
  const isAlertInsightSectionDisplayed = !!active.length;
  // AlertInsights will not display if there aren't any active or hidden items.

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <AlertInsightsHeader
          title="Your team's action items"
          subtitle={
            isAlertInsightSectionDisplayed
              ? 'This section outlines suggested action items your team can address to improve cloud costs.'
              : "All of your team's action items are hidden. Maybe it's time to give them another look?"
          }
        />
      </Grid>
      {isAlertInsightSectionDisplayed && (
        <Grid item container direction="column" spacing={4}>
          {active.map((alert, index) => (
            <Grid item key={`alert-insights-section-${index}`}>
              <AlertInsightsSection alert={alert} number={index + 1} />
            </Grid>
          ))}
        </Grid>
      )}
      {isAlertStatusSummaryDisplayed && (
        <Grid item>
          <Box position="relative" display="flex" justifyContent="flex-end">
            <ScrollAnchor id={ScrollType.AlertSummary} />
            <AlertStatusSummaryButton onClick={onSummaryButtonClick}>
              {pluralize('Hidden Action Item', total)}
            </AlertStatusSummaryButton>
          </Box>
          <AlertStatusSummary
            open={isSummaryOpen}
            snoozed={snoozed}
            accepted={accepted}
            dismissed={dismissed}
          />
        </Grid>
      )}
      <AlertDialog
        group={group}
        open={isDialogOpen}
        snoozed={alerts.snoozed}
        accepted={alerts.accepted}
        dismissed={alerts.dismissed}
        onClose={closeDialog}
        onSubmit={onDialogSubmit}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6_000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={onSnackbarClose}
      >
        <MuiAlert onClose={onSnackbarClose} severity="error">
          {error?.message}
        </MuiAlert>
      </Snackbar>
    </Grid>
  );
};
