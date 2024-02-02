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
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Notification,
  NotificationType,
} from '@backstage/plugin-notifications-common';
import { useNavigate } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '@material-ui/icons/Check';
import Bookmark from '@material-ui/icons/Bookmark';
import { notificationsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import Inbox from '@material-ui/icons/Inbox';
import CloseIcon from '@material-ui/icons/Close';
// @ts-ignore
import RelativeTime from 'react-relative-time';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles(theme => ({
  table: {
    border: `1px solid ${theme.palette.divider}`,
  },
  header: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  notificationRow: {
    cursor: 'pointer',
    '&.unread': {
      border: '1px solid rgba(255, 255, 255, .3)',
    },
    '& .hideOnHover': {
      display: 'initial',
    },
    '& .showOnHover': {
      display: 'none',
    },
    '&:hover': {
      '& .hideOnHover': {
        display: 'none',
      },
      '& .showOnHover': {
        display: 'initial',
      },
    },
  },
  actionButton: {
    padding: '9px',
  },
  checkBox: {
    padding: '0 10px 10px 0',
  },
}));

/** @public */
export const NotificationsTable = (props: {
  onUpdate: () => void;
  type: NotificationType;
  notifications?: Notification[];
}) => {
  const { notifications, type } = props;
  const navigate = useNavigate();
  const styles = useStyles();
  const [selected, setSelected] = useState<string[]>([]);
  const notificationsApi = useApi(notificationsApiRef);

  const onCheckBoxClick = (id: string) => {
    const index = selected.indexOf(id);
    if (index !== -1) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  useEffect(() => {
    setSelected([]);
  }, [type]);

  const isChecked = (id: string) => {
    return selected.indexOf(id) !== -1;
  };

  const isAllSelected = () => {
    return (
      selected.length === notifications?.length && notifications.length > 0
    );
  };

  return (
    <Table size="small" className={styles.table}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={3}>
            {type !== 'saved' && !notifications?.length && 'No notifications'}
            {type !== 'saved' && !!notifications?.length && (
              <Checkbox
                size="small"
                style={{ paddingLeft: 0 }}
                checked={isAllSelected()}
                onClick={() => {
                  if (isAllSelected()) {
                    setSelected([]);
                  } else {
                    setSelected(
                      notifications ? notifications.map(n => n.id) : [],
                    );
                  }
                }}
              />
            )}
            {type === 'saved' &&
              `${notifications?.length ?? 0} saved notifications`}
            {selected.length === 0 &&
              !!notifications?.length &&
              type !== 'saved' &&
              'Select all'}
            {selected.length > 0 && `${selected.length} selected`}
            {type === 'done' && selected.length > 0 && (
              <Button
                startIcon={<Inbox fontSize="small" />}
                onClick={() => {
                  notificationsApi
                    .updateNotifications({ ids: selected, done: false })
                    .then(() => props.onUpdate());
                  setSelected([]);
                }}
              >
                Move to inbox
              </Button>
            )}

            {type === 'undone' && selected.length > 0 && (
              <Button
                startIcon={<Check fontSize="small" />}
                onClick={() => {
                  notificationsApi
                    .updateNotifications({ ids: selected, done: true })
                    .then(() => props.onUpdate());
                  setSelected([]);
                }}
              >
                Mark as done
              </Button>
            )}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.notifications?.map(notification => {
          return (
            <TableRow
              key={notification.id}
              className={`${styles.notificationRow} ${
                !notification.read ? 'unread' : ''
              }`}
              hover
            >
              <TableCell
                width="60px"
                style={{ verticalAlign: 'center', paddingRight: '0px' }}
              >
                <Checkbox
                  className={styles.checkBox}
                  size="small"
                  checked={isChecked(notification.id)}
                  onClick={() => onCheckBoxClick(notification.id)}
                />
              </TableCell>
              <TableCell
                onClick={() =>
                  notificationsApi
                    .updateNotifications({ ids: [notification.id], read: true })
                    .then(() => navigate(notification.payload.link))
                }
                style={{ paddingLeft: 0 }}
              >
                <Typography variant="subtitle2">
                  {notification.payload.title}
                </Typography>
                <Typography variant="body2">
                  {notification.payload.description}
                </Typography>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>
                <Box className="hideOnHover">
                  <RelativeTime value={notification.created} />
                </Box>
                <Box className="showOnHover">
                  <Tooltip title={notification.payload.link}>
                    <IconButton
                      className={styles.actionButton}
                      onClick={() =>
                        notificationsApi
                          .updateNotifications({
                            ids: [notification.id],
                            read: true,
                          })
                          .then(() => navigate(notification.payload.link))
                      }
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={notification.read ? 'Move to inbox' : 'Mark as done'}
                  >
                    <IconButton
                      className={styles.actionButton}
                      onClick={() => {
                        if (notification.read) {
                          notificationsApi
                            .updateNotifications({
                              ids: [notification.id],
                              done: false,
                            })
                            .then(() => {
                              props.onUpdate();
                            });
                        } else {
                          notificationsApi
                            .updateNotifications({
                              ids: [notification.id],
                              done: true,
                            })
                            .then(() => {
                              props.onUpdate();
                            });
                        }
                      }}
                    >
                      {notification.read ? (
                        <Inbox fontSize="small" />
                      ) : (
                        <Check fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={notification.saved ? 'Remove from saved' : 'Save'}
                  >
                    <IconButton
                      className={styles.actionButton}
                      onClick={() => {
                        if (notification.saved) {
                          notificationsApi
                            .updateNotifications({
                              ids: [notification.id],
                              saved: false,
                            })
                            .then(() => {
                              props.onUpdate();
                            });
                        } else {
                          notificationsApi
                            .updateNotifications({
                              ids: [notification.id],
                              saved: true,
                            })
                            .then(() => {
                              props.onUpdate();
                            });
                        }
                      }}
                    >
                      {notification.saved ? (
                        <CloseIcon fontSize="small" />
                      ) : (
                        <Bookmark fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
