import { useState, useCallback } from 'react';
import { useAsync } from 'react-use';
import pluginManagerBootstrap from 'plugins/pluginManagerBootstrap';
import StackOverflowClient from 'shared/apis/stackOverflow/StackOverflowClient';
import { useUser } from 'shared/apis/user';

const LAST_READ_KEY = 'notifications.stackoverflowUnanswered.lastReadTimestamp';

export const useStackoverflowUnansweredQuestions = () => {
  const [lastRead, setLastRead] = useState(() => Number(localStorage.getItem(LAST_READ_KEY)) || 0);
  const user = useUser();

  const markRead = useCallback(() => {
    const now = new Date().getTime();
    localStorage.setItem(LAST_READ_KEY, String(now));
    setLastRead(now);
  }, []);

  const status = useAsync(async () => {
    const squadIds = user.groups.filter(group => group.type === 'squad').map(s => s.id);
    const tags = pluginManagerBootstrap.plugins.reduce((tags, plugin) => {
      if (squadIds.includes(plugin.owner)) tags = tags.concat(plugin.stackoverflowTags);
      return tags;
    }, []);
    if (tags.length) {
      return await StackOverflowClient.unansweredFor(tags, lastRead);
    } else {
      return [];
    }
  }, [lastRead]);

  return {
    ...status,
    markRead,
  };
};
