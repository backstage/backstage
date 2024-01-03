import React from 'react';

import { configApiRef, useApi } from '@backstage/core-plugin-api';

import { makeStyles } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { notificationsApiRef, NotificationsCreateRequest } from '../../api';

const useStyles = makeStyles({
  container: {
    width: '60%',
    minWidth: '30rem',
  },
});

export const SendNotification = () => {
  const notificationsApi = useApi(notificationsApiRef);
  const configApi = useApi(configApiRef);
  const styles = useStyles();

  const [notificationId, setNotificationId] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  const [origin, setOrigin] = React.useState<string>('my-origin');
  const [title, setTitle] = React.useState<string>('my-title');
  const [message, setMessage] = React.useState<string>();
  const [topic, setTopic] = React.useState<string>();
  const [targetUsers, setTargetUsers] = React.useState<string[]>();
  const [targetGroups, setTargetGroups] = React.useState<string[]>();
  const [actions, setActions] = React.useState<string>();

  const handleSubmit = async () => {
    try {
      const parsedActions = actions ? JSON.parse(actions) : undefined;

      const notification: NotificationsCreateRequest = {
        origin,
        title,
        message,
        actions: parsedActions,
        topic,
        targetUsers,
        targetGroups,
      };

      const id = await notificationsApi.createNotification(notification);
      setNotificationId(id);
    } catch (_e) {
      const e = _e as Error;
      setError(e.message);
    }
  };

  const getCurl = () => {
    const data: NotificationsCreateRequest = {
      title,
      origin,
    };

    try {
      if (message) {
        data.message = message;
      }
      if (topic) {
        data.topic = topic;
      }
      if (actions) {
        data.actions = JSON.parse(actions);
      }
      if (targetUsers && targetUsers.length > 0) {
        data.targetUsers = targetUsers;
      }
      if (targetGroups && targetGroups.length > 0) {
        data.targetGroups = targetGroups;
      }

      return `curl -X POST ${configApi.getString(
        'backend.baseUrl',
      )}/api/notifications/notifications -H "Content-Type: application/json" -d '${JSON.stringify(
        data,
      )}'`;
    } catch {
      return 'Incorrect input';
    }
  };

  return (
    <>
      <Stack className={styles.container} spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        {notificationId && (
          <Alert severity="info">
            A notification has been created with id: ${notificationId}
          </Alert>
        )}

        <form>
          <Stack spacing={2}>
            <TextField
              required
              id="title"
              label="Title"
              onChange={e => setTitle(e.target.value)}
              value={title}
            />

            <TextField
              id="message"
              label="Message"
              onChange={e => setMessage(e.target.value)}
              value={message}
            />

            <TextField
              required
              id="origin"
              label="Origin"
              onChange={e => setOrigin(e.target.value)}
              value={origin}
            />

            <TextField
              id="topic"
              label="Topic"
              onChange={e => setTopic(e.target.value)}
              value={topic}
            />

            <TextField
              id="targetUsers"
              label="Target users"
              onChange={e =>
                setTargetUsers(
                  e.target.value
                    ?.split(',')
                    .map(v => v.trim())
                    .filter(Boolean),
                )
              }
              value={targetUsers?.join(',')}
              helperText="Comma separated list. Example: jdoe,anotherUser"
            />

            <TextField
              id="targetGroups"
              label="Target user groups"
              onChange={e =>
                setTargetGroups(
                  e.target.value
                    ?.split(',')
                    .map(v => v.trim())
                    .filter(Boolean),
                )
              }
              value={targetGroups?.join(',')}
              helperText={
                <>
                  Comma separated list. Example: groupA,groupB
                  <br />
                  If both targetUsers and targetGroups are empty, the
                  notification is system-wide (means: Updates)
                </>
              }
            />

            <TextField
              id="actions"
              label="Actions"
              onChange={e => setActions(e.target.value)}
              value={actions}
              helperText='A JSON array of items with title and URL. Example: [ {"title": "My action", "url": "http://foo.bar"} ]'
            />
          </Stack>

          <Button variant="outlined" onClick={handleSubmit}>
            Create message
          </Button>
        </form>
      </Stack>
      <>
        <Typography variant="h6">Example cURL</Typography>
        <Typography paragraph>{getCurl()}</Typography>
      </>
    </>
  );
};
