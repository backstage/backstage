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

import { Fragment, ElementType } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DescriptionIcon from '@material-ui/icons/Description';
import SchoolIcon from '@material-ui/icons/School';
import CodeIcon from '@material-ui/icons/Code';
import BuildIcon from '@material-ui/icons/Build';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import { OnboardingTask, ResourceType } from '../../types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.type === 'dark' ? '#1e1e1e' : '#fafafa',
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  inner: {
    padding: theme.spacing(2, 3),
  },
  section: {
    marginBottom: theme.spacing(2),
    '&:last-child': { marginBottom: 0 },
  },
  sectionTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  documentation: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.7,
    color: theme.palette.text.primary,
    '& strong': { fontWeight: 600 },
  },
  stepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: '0.75rem',
    fontWeight: 700,
    marginRight: theme.spacing(1),
    flexShrink: 0,
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1.5),
    '&:last-child': { marginBottom: 0 },
  },
  stepText: {
    lineHeight: 1.6,
  },
  resourceIcon: {
    minWidth: 36,
  },
  resourceItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  durationChip: {
    height: 20,
    fontSize: '0.7rem',
    marginLeft: theme.spacing(1),
  },
  recommendationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
    '&:last-child': { marginBottom: 0 },
  },
  recommendationBullet: {
    color: theme.palette.warning.main,
    marginTop: 2,
    fontSize: '1.2rem',
  },
  timeEstimate: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  resourcePaper: {
    overflow: 'hidden',
  },
}));

const RESOURCE_ICONS: Record<ResourceType, ElementType> = {
  video: PlayCircleFilledIcon,
  doc: DescriptionIcon,
  article: MenuBookIcon,
  course: SchoolIcon,
  repo: CodeIcon,
  tool: BuildIcon,
};

const RESOURCE_LABELS: Record<ResourceType, string> = {
  video: 'Video',
  doc: 'Documentation',
  article: 'Article',
  course: 'Course',
  repo: 'Repository',
  tool: 'Tool',
};

function formatDuration(minutes: number): string {
  if (minutes < 60) return `~${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

/** Parses simple step-by-step documentation text into numbered steps. */
function parseSteps(doc: string): string[] {
  const lines = doc.split('\n').filter(l => l.trim().length > 0);
  // If lines start with "1.", "2." etc, split on those
  const numbered = lines.filter(l => /^\d+[\.\)]\s/.test(l.trim()));
  if (numbered.length > 1) {
    return numbered.map(l => l.replace(/^\d+[\.\)]\s*/, '').trim());
  }
  // Otherwise treat each non-empty line as a step
  return lines.map(l => l.trim());
}

/** @public */
export interface TaskDetailPanelProps {
  task: OnboardingTask;
  open: boolean;
}

/** @public */
export function TaskDetailPanel(props: TaskDetailPanelProps) {
  const { task, open } = props;
  const classes = useStyles();

  const hasDetail =
    task.documentation ||
    (task.resources && task.resources.length > 0) ||
    (task.recommendations && task.recommendations.length > 0);

  if (!hasDetail) return null;

  const steps = task.documentation ? parseSteps(task.documentation) : [];

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box className={classes.root}>
        <Box className={classes.inner}>
          {/* Time Estimate */}
          {task.estimatedMinutes && (
            <Box className={classes.timeEstimate}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">
                Estimated time: {formatDuration(task.estimatedMinutes)}
              </Typography>
            </Box>
          )}

          {/* Step-by-step documentation */}
          {steps.length > 0 && (
            <Box className={classes.section}>
              <Typography variant="subtitle2" className={classes.sectionTitle}>
                <MenuBookIcon fontSize="small" />
                Step-by-step guide
              </Typography>
              <Box>
                {steps.map((step, i) => (
                  <Box key={i} className={classes.stepRow}>
                    <span className={classes.stepNumber}>{i + 1}</span>
                    <Typography variant="body2" className={classes.stepText}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Resources */}
          {task.resources && task.resources.length > 0 && (
            <Box className={classes.section}>
              <Typography variant="subtitle2" className={classes.sectionTitle}>
                <SchoolIcon fontSize="small" />
                Resources &amp; learning materials
              </Typography>
              <Paper variant="outlined" className={classes.resourcePaper}>
                <List dense disablePadding>
                  {task.resources.map((res, i) => {
                    const Icon = RESOURCE_ICONS[res.type] ?? DescriptionIcon;
                    return (
                      <Fragment key={i}>
                        {i > 0 && <Divider />}
                        <ListItem className={classes.resourceItem}>
                          <ListItemIcon className={classes.resourceIcon}>
                            <Icon
                              fontSize="small"
                              color={
                                res.type === 'video' ? 'error' : 'action'
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center">
                                <Link
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  variant="body2"
                                >
                                  {res.title}
                                </Link>
                                <Chip
                                  label={RESOURCE_LABELS[res.type]}
                                  size="small"
                                  variant="outlined"
                                  className={classes.durationChip}
                                />
                                {res.duration && (
                                  <Chip
                                    label={res.duration}
                                    size="small"
                                    variant="outlined"
                                    className={classes.durationChip}
                                    icon={
                                      <AccessTimeIcon
                                        style={{ fontSize: 14 }}
                                      />
                                    }
                                  />
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                      </Fragment>
                    );
                  })}
                </List>
              </Paper>
            </Box>
          )}

          {/* Recommendations */}
          {task.recommendations && task.recommendations.length > 0 && (
            <Box className={classes.section}>
              <Typography variant="subtitle2" className={classes.sectionTitle}>
                <EmojiObjectsIcon fontSize="small" />
                Tips &amp; recommendations
              </Typography>
              {task.recommendations.map((rec, i) => (
                <Box key={i} className={classes.recommendationItem}>
                  <EmojiObjectsIcon className={classes.recommendationBullet} />
                  <Typography variant="body2">{rec}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Collapse>
  );
}
