/*
 * Copyright 2024 The Backstage Authors
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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useApi } from '@backstage/core-plugin-api';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import useAsync from 'react-use/esm/useAsync';
import { operationalZoneApiRef } from '../../api';
import { ZoneBadge } from '../ZoneBadge/ZoneBadge';

/**
 * Content component for the Operational Zones homepage card.
 *
 * @public
 */
export function Content() {
  const api = useApi(operationalZoneApiRef);
  const { value, loading, error } = useAsync(() => api.getZones(), []);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  const zones = value?.zones ?? [];

  if (zones.length === 0) {
    return <ListItem>No operational zones configured</ListItem>;
  }

  return (
    <List dense>
      {zones.map(zone => (
        <ListItem key={zone.id}>
          <ListItemText primary={zone.id} secondary={zone.label} />
          <ZoneBadge level={zone.level} />
        </ListItem>
      ))}
    </List>
  );
}
