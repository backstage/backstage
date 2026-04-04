/*
 * Copyright 2026 Estehsan Tariq
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

import { useEffect, useState, Fragment } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { InfoCard } from '@backstage/core-components';
import { OnboardingApi } from '../../api/OnboardingApi';
import { TeamOnboardingStats } from '../../types';

const PROGRESS_COLOR = '#1D9E75';

const MiniProgress = withStyles({
  root: { height: 6, borderRadius: 3 },
  colorPrimary: { backgroundColor: '#e0e0e0' },
  bar: { borderRadius: 3, backgroundColor: PROGRESS_COLOR },
})(LinearProgress);

const useStyles = makeStyles((theme: Theme) => ({
  statsGrid: {
    marginBottom: theme.spacing(3),
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
  },
  statLabel: {
    color: theme.palette.text.secondary,
  },
  searchField: {
    marginBottom: theme.spacing(2),
  },
  progressCell: {
    minWidth: 120,
  },
  blockedChip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    height: 20,
    fontSize: '0.7rem',
  },
  blockedTaskItem: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': { borderBottom: 'none' },
  },
}));

function daysSince(dateStr: string): number {
  const start = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** @public */
export interface TeamViewProps {
  onboardingApi: OnboardingApi;
}

/** @public */
export function TeamView(props: TeamViewProps) {
  const { onboardingApi } = props;
  const classes = useStyles();

  const [teamName, setTeamName] = useState('');
  const [stats, setStats] = useState<TeamOnboardingStats | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [expandedRow, setExpandedRow] = useState<string | undefined>();

  const handleSearch = async () => {
    if (!teamName.trim()) return;
    setLoading(true);
    setError(undefined);
    try {
      const result = await onboardingApi.getTeamStats(teamName.trim());
      setStats(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStats(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamName) {
      const timer = setTimeout(handleSearch, 500);
      return () => clearTimeout(timer);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamName]);

  const handleRowExpand = (userId: string) => {
    setExpandedRow(expandedRow === userId ? undefined : userId);
  };

  return (
    <Box>
      <TextField
        className={classes.searchField}
        label="Team name"
        variant="outlined"
        size="small"
        value={teamName}
        onChange={e => setTeamName(e.target.value)}
        placeholder="e.g. platform"
        fullWidth
      />

      {loading && <LinearProgress />}

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      {stats && (
        <>
          <Grid container spacing={3} className={classes.statsGrid}>
            <Grid item xs={12} sm={4}>
              <InfoCard title="Active Joiners" variant="gridItem">
                <Typography className={classes.statValue}>
                  {stats.activeJoiners.length}
                </Typography>
                <Typography className={classes.statLabel}>
                  currently onboarding
                </Typography>
              </InfoCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoCard title="Avg. Completion" variant="gridItem">
                <Typography className={classes.statValue}>
                  {stats.avgCompletionPercent}%
                </Typography>
                <Typography className={classes.statLabel}>
                  across all joiners
                </Typography>
              </InfoCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <InfoCard title="Blocked Tasks" variant="gridItem">
                <Typography className={classes.statValue}>
                  {stats.totalBlockedTasks}
                </Typography>
                <Typography className={classes.statLabel}>
                  need attention
                </Typography>
              </InfoCard>
            </Grid>
          </Grid>

          {stats.activeJoiners.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Days Since Start</TableCell>
                    <TableCell className={classes.progressCell}>
                      Progress
                    </TableCell>
                    <TableCell>Blocked</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.activeJoiners.map(joiner => (
                    <Fragment key={joiner.userId}>
                      <TableRow
                        hover
                        onClick={() => handleRowExpand(joiner.userId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <IconButton size="small">
                            {expandedRow === joiner.userId ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{joiner.displayName}</TableCell>
                        <TableCell>{joiner.role}</TableCell>
                        <TableCell>
                          {daysSince(joiner.startDate)} days
                        </TableCell>
                        <TableCell className={classes.progressCell}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center' }}
                            style={{ gap: '8px' }}
                          >
                            <Box flex={1}>
                              <MiniProgress
                                variant="determinate"
                                value={joiner.completionPercent}
                              />
                            </Box>
                            <Typography variant="caption">
                              {joiner.completionPercent}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {joiner.blockedTaskCount > 0 ? (
                            <Chip
                              label={joiner.blockedTaskCount}
                              className={classes.blockedChip}
                              size="small"
                            />
                          ) : (
                            <Typography variant="caption" color="textSecondary">
                              0
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <Collapse
                            in={expandedRow === joiner.userId}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1}>
                              <Typography variant="subtitle2" gutterBottom>
                                Blocked tasks for {joiner.displayName}
                              </Typography>
                              {joiner.blockedTaskCount > 0 ? (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {joiner.blockedTaskCount} task(s) are
                                  currently blocked. View their individual
                                  checklist for details.
                                </Typography>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  No blocked tasks.
                                </Typography>
                              )}
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No active joiners found for team &quot;{stats.teamName}&quot;.
            </Typography>
          )}
        </>
      )}

      {!stats && !loading && !error && (
        <Typography variant="body2" color="textSecondary">
          Enter a team name to view onboarding stats.
        </Typography>
      )}
    </Box>
  );
}
