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
import {
  Content,
  Header,
  HeaderTabs,
  InfoCard,
  Page,
  Progress,
  ResponseErrorPanel,
  Table,
} from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  UsageSessionSummary,
  usageAnalyticsReadAggregatesPermission,
  usageAnalyticsReadDetailsPermission,
} from '@backstage/plugin-usage-analytics-common';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { useEffect, useMemo, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import useInterval from 'react-use/lib/useInterval';
import {
  UsageReportFilters,
  usageAnalyticsApiRef,
} from '../../api/UsageAnalyticsApi';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'pages', label: 'Pages' },
  { id: 'users', label: 'Users' },
  { id: 'sessions', label: 'Sessions' },
];

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
});
const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
const numberFormatter = new Intl.NumberFormat();
const tableOptions = {
  paging: false,
  search: false,
  toolbar: false,
  padding: 'dense',
} as const;

const filterFields = [
  { name: 'from', label: 'From', type: 'date' },
  { name: 'to', label: 'To', type: 'date' },
  { name: 'userEntityRef', label: 'User', type: 'text' },
  { name: 'path', label: 'Path', type: 'text' },
  { name: 'pluginId', label: 'Plugin', type: 'text' },
  { name: 'action', label: 'Action', type: 'text' },
] as const;

type FilterName = (typeof filterFields)[number]['name'];
type FilterValues = Record<FilterName, string>;

const emptyFilters: FilterValues = {
  from: '',
  to: '',
  userEntityRef: '',
  path: '',
  pluginId: '',
  action: '',
};

const usePageStyles = makeStyles(theme => ({
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(6, 2),
    color: theme.palette.text.secondary,
  },
  sessionMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

/**
 * Usage analytics dashboard component.
 *
 * @public
 */
export function UsageAnalyticsPageContent() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [filters, setFilters] = useState<FilterValues>(emptyFilters);
  const options = useMemo(() => filterOptions(filters), [filters]);
  const filterKey = JSON.stringify(options);
  return (
    <Page themeId="tool">
      <Header
        title="Usage analytics"
        subtitle="First-party activity, sessions, and online presence"
      />
      <HeaderTabs
        tabs={tabs}
        selectedIndex={selectedTab}
        onChange={setSelectedTab}
      />
      <Content>
        <Box mb={3}>
          <FilterBar values={filters} onChange={setFilters} />
        </Box>
        {selectedTab === 0 && (
          <OverviewContent key={filterKey} filters={options} />
        )}
        {selectedTab === 1 && (
          <PagesContent key={filterKey} filters={options} />
        )}
        {selectedTab === 2 && (
          <RequirePermission permission={usageAnalyticsReadDetailsPermission}>
            <UsersContent key={filterKey} filters={options} />
          </RequirePermission>
        )}
        {selectedTab === 3 && (
          <RequirePermission permission={usageAnalyticsReadDetailsPermission}>
            <SessionsContent key={filterKey} filters={options} />
          </RequirePermission>
        )}
      </Content>
    </Page>
  );
}

function OverviewContent({ filters }: { filters: UsageReportFilters }) {
  const api = useApi(usageAnalyticsApiRef);
  const reports = useAsync(
    () =>
      Promise.all([
        api.getOverview(filters),
        api.getTimeseries('day', filters),
        api.getEventTypes(filters),
        api.getPlugins({ ...filters, limit: 10 }),
      ]),
    [api, filters],
  );
  const presence = useAsyncRetry(() => api.getPresenceSummary(), [api]);
  useInterval(presence.retry, presence.loading ? null : 30_000);
  if (reports.loading || (presence.loading && !presence.value)) {
    return <Progress />;
  }
  if (reports.error || presence.error) {
    return <ResponseErrorPanel error={(reports.error ?? presence.error)!} />;
  }
  const [overview, timeseries, eventTypes, plugins] = reports.value!;
  return (
    <>
      <Box mb={3}>
        <Grid container spacing={3}>
          {[
            ['Events', overview.eventCount],
            ['Active users', overview.activeUsers],
            ['Sessions', overview.sessions],
            ['Page views', overview.pageViews],
            ['Online now', presence.value!.onlineUsers],
          ].map(([label, value]) => (
            <Grid item key={label} xs={6} sm={4} md>
              <InfoCard title={String(label)}>
                <Typography variant="h4">
                  {numberFormatter.format(Number(value))}
                </Typography>
              </InfoCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <InfoCard title="Daily activity" noPadding>
            <Table
              columns={[
                {
                  title: 'Day',
                  field: 'start',
                  render: bucket => formatDate(bucket.start),
                },
                { title: 'Events', field: 'eventCount', type: 'numeric' },
                { title: 'Users', field: 'activeUsers', type: 'numeric' },
                { title: 'Sessions', field: 'sessions', type: 'numeric' },
              ]}
              data={timeseries.buckets}
              options={tableOptions}
            />
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <InfoCard title="Event types" noPadding>
            <Table
              columns={[
                {
                  title: 'Action',
                  field: 'action',
                  render: item => (
                    <Chip label={item.action} size="small" variant="outlined" />
                  ),
                },
                { title: 'Events', field: 'count', type: 'numeric' },
              ]}
              data={eventTypes.items}
              options={tableOptions}
            />
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <InfoCard title="Popular plugins" noPadding>
            <Table
              columns={[
                {
                  title: 'Plugin',
                  field: 'pluginId',
                  render: plugin => (
                    <Chip label={plugin.pluginId} size="small" />
                  ),
                },
                { title: 'Events', field: 'events', type: 'numeric' },
                { title: 'Users', field: 'uniqueUsers', type: 'numeric' },
              ]}
              data={plugins.items}
              options={{ ...tableOptions, sorting: false }}
            />
          </InfoCard>
        </Grid>
      </Grid>
    </>
  );
}

function PagesContent({ filters }: { filters: UsageReportFilters }) {
  const api = useApi(usageAnalyticsApiRef);
  const pagination = usePagination();
  const state = useAsync(
    () => api.getPages({ ...filters, ...pagination.request }),
    [api, filters, pagination.request],
  );
  usePaginationBounds(pagination, state.value?.total);
  if (state.loading) return <Progress />;
  if (state.error) return <ResponseErrorPanel error={state.error} />;
  return (
    <InfoCard title={`Pages (${state.value!.total})`} noPadding>
      <Table
        columns={[
          {
            title: 'Path',
            field: 'path',
            render: page => (
              <Typography variant="body2" component="code">
                {page.path}
              </Typography>
            ),
          },
          { title: 'Views', field: 'pageViews', type: 'numeric' },
          { title: 'Users', field: 'uniqueUsers', type: 'numeric' },
          {
            title: 'Estimated time',
            field: 'estimatedDurationSeconds',
            render: page => formatDuration(page.estimatedDurationSeconds),
          },
          {
            title: 'Last viewed',
            field: 'lastViewedAt',
            render: page => formatDateTime(page.lastViewedAt),
          },
        ]}
        data={state.value!.items}
        options={pagination.options}
        {...pagination.tableProps(state.value!.total)}
      />
    </InfoCard>
  );
}

function UsersContent({ filters }: { filters: UsageReportFilters }) {
  const classes = usePageStyles();
  const api = useApi(usageAnalyticsApiRef);
  const [userEntityRef, setUserEntityRef] = useState<string>();
  const usersPagination = usePagination();
  const historyPagination = usePagination();
  const onlinePagination = usePagination();
  const users = useAsync(
    () => api.getUsers({ ...filters, ...usersPagination.request }),
    [api, filters, usersPagination.request],
  );
  const history = useAsync(
    () =>
      userEntityRef
        ? api.getActivity({
            ...filters,
            userEntityRef,
            ...historyPagination.request,
            orderField: 'occurredAt',
            orderDirection: 'asc',
          })
        : Promise.resolve(undefined),
    [api, filters, historyPagination.request, userEntityRef],
  );
  const online = useAsyncRetry(
    () => api.getOnlineUsers(onlinePagination.request),
    [api, onlinePagination.request],
  );
  usePaginationBounds(usersPagination, users.value?.total);
  usePaginationBounds(historyPagination, history.value?.total);
  usePaginationBounds(onlinePagination, online.value?.total);
  useInterval(online.retry, online.loading ? null : 30_000);
  if (users.loading || (online.loading && !online.value)) return <Progress />;
  if (users.error || online.error) {
    return <ResponseErrorPanel error={(users.error ?? online.error)!} />;
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <InfoCard title={`Users (${users.value!.total})`} noPadding>
          <Table
            columns={[
              {
                title: 'User',
                field: 'userEntityRef',
                render: user => (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                      historyPagination.reset();
                      setUserEntityRef(user.userEntityRef);
                    }}
                  >
                    {user.userEntityRef}
                  </Button>
                ),
              },
              { title: 'Events', field: 'eventCount', type: 'numeric' },
              { title: 'Sessions', field: 'sessionCount', type: 'numeric' },
              {
                title: 'Last seen',
                field: 'lastSeenAt',
                render: user => formatDateTime(user.lastSeenAt),
              },
            ]}
            data={users.value!.items}
            options={usersPagination.options}
            {...usersPagination.tableProps(users.value!.total)}
          />
        </InfoCard>
      </Grid>
      <Grid item xs={12} lg={6}>
        <InfoCard title={`Online users (${online.value!.total})`} noPadding>
          <Table
            columns={[
              { title: 'User', field: 'userEntityRef' },
              {
                title: 'Sessions',
                field: 'activeSessionCount',
                type: 'numeric',
              },
              {
                title: 'Path',
                field: 'currentPath',
                render: user => (
                  <Typography variant="body2" component="code">
                    {user.currentPath}
                  </Typography>
                ),
              },
              {
                title: 'Last heartbeat',
                field: 'lastSeenAt',
                render: user => formatDateTime(user.lastSeenAt),
              },
            ]}
            data={online.value!.items}
            options={onlinePagination.options}
            {...onlinePagination.tableProps(online.value!.total)}
          />
        </InfoCard>
      </Grid>
      <Grid item xs={12}>
        <InfoCard
          title={userEntityRef ? `History · ${userEntityRef}` : 'User history'}
          noPadding
        >
          {!userEntityRef && (
            <div className={classes.emptyState}>
              <Typography variant="body1">
                Select a user to see their recent activity.
              </Typography>
            </div>
          )}
          {history.loading && userEntityRef && <Progress />}
          {history.error && <ResponseErrorPanel error={history.error} />}
          {history.value && (
            <Table
              columns={[
                {
                  title: 'Time',
                  field: 'occurredAt',
                  render: event => formatDateTime(event.occurredAt),
                },
                {
                  title: 'Action',
                  field: 'action',
                  render: event => (
                    <Chip
                      label={event.action}
                      size="small"
                      variant="outlined"
                    />
                  ),
                },
                {
                  title: 'Path',
                  field: 'currentPath',
                  render: event => (
                    <Typography variant="body2" component="code">
                      {event.currentPath}
                    </Typography>
                  ),
                },
                { title: 'Plugin', field: 'pluginId' },
              ]}
              data={history.value.items}
              options={historyPagination.options}
              {...historyPagination.tableProps(history.value.total)}
            />
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
}

function SessionsContent({ filters }: { filters: UsageReportFilters }) {
  const classes = usePageStyles();
  const api = useApi(usageAnalyticsApiRef);
  const sessionsPagination = usePagination();
  const sessions = useAsync(
    () => api.getSessions({ ...filters, ...sessionsPagination.request }),
    [api, filters, sessionsPagination.request],
  );
  const timelinePagination = usePagination();
  const [selectedSession, setSelectedSession] = useState<UsageSessionSummary>();
  const timeline = useAsync(
    () =>
      selectedSession
        ? api.getActivity({
            ...filters,
            ...timelinePagination.request,
            orderField: 'occurredAt',
            orderDirection: 'asc',
            sessionId: selectedSession.sessionId,
          })
        : Promise.resolve(undefined),
    [api, filters, selectedSession, timelinePagination.request],
  );
  usePaginationBounds(sessionsPagination, sessions.value?.total);
  usePaginationBounds(timelinePagination, timeline.value?.total);
  if (sessions.loading) return <Progress />;
  if (sessions.error) return <ResponseErrorPanel error={sessions.error} />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={5}>
        <InfoCard title="Recent sessions" noPadding>
          <Table
            columns={[
              {
                title: 'Session',
                field: 'sessionId',
                render: item => (
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                      timelinePagination.reset();
                      setSelectedSession(item);
                    }}
                  >
                    {item.sessionId}
                  </Button>
                ),
              },
              { title: 'User', field: 'userEntityRef' },
              {
                title: 'Last activity',
                field: 'lastSeenAt',
                render: item => formatDateTime(item.lastSeenAt),
              },
            ]}
            data={sessions.value!.items}
            options={sessionsPagination.options}
            {...sessionsPagination.tableProps(sessions.value!.total)}
          />
        </InfoCard>
      </Grid>
      <Grid item xs={12} lg={7}>
        <InfoCard title="Session timeline" noPadding>
          {timeline.loading && selectedSession && <Progress />}
          {timeline.error && <ResponseErrorPanel error={timeline.error} />}
          {!selectedSession && (
            <div className={classes.emptyState}>
              <Typography variant="body1">
                Select a recent session to inspect its timeline.
              </Typography>
            </div>
          )}
          {selectedSession && timeline.value && !timeline.loading && (
            <Box p={2}>
              <div className={classes.sessionMeta}>
                <Chip label={selectedSession.userEntityRef} size="small" />
                <Chip
                  label={formatDuration(selectedSession.durationSeconds)}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${timeline.value.total} events`}
                  size="small"
                  variant="outlined"
                />
              </div>
              <Table
                columns={[
                  {
                    title: 'Time',
                    field: 'occurredAt',
                    render: event => formatDateTime(event.occurredAt),
                  },
                  {
                    title: 'Action',
                    field: 'action',
                    render: event => (
                      <Chip
                        label={event.action}
                        size="small"
                        variant="outlined"
                      />
                    ),
                  },
                  {
                    title: 'Path',
                    field: 'currentPath',
                    render: event => (
                      <Typography variant="body2" component="code">
                        {event.currentPath}
                      </Typography>
                    ),
                  },
                ]}
                data={timeline.value.items}
                options={timelinePagination.options}
                {...timelinePagination.tableProps(timeline.value.total)}
              />
            </Box>
          )}
        </InfoCard>
      </Grid>
    </Grid>
  );
}

function usePagination(defaultPageSize = 25) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const request = useMemo(
    () => ({
      limit: pageSize,
      offset: page * pageSize,
    }),
    [page, pageSize],
  );
  const options = useMemo(
    () => ({
      ...tableOptions,
      paging: true,
      sorting: false,
      pageSize,
      pageSizeOptions: [25, 50, 100],
      emptyRowsWhenPaging: false,
    }),
    [pageSize],
  );
  return {
    page,
    pageSize,
    setPage,
    request,
    options,
    reset: () => setPage(0),
    tableProps: (totalCount: number) => ({
      page,
      totalCount,
      onPageChange: setPage,
      onRowsPerPageChange: (size: number) => {
        setPage(0);
        setPageSize(size);
      },
    }),
  };
}

function usePaginationBounds(
  pagination: ReturnType<typeof usePagination>,
  totalCount: number | undefined,
) {
  const { page, pageSize, setPage } = pagination;
  useEffect(() => {
    if (totalCount === undefined) {
      return;
    }
    const lastPage = Math.max(0, Math.ceil(totalCount / pageSize) - 1);
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, pageSize, setPage, totalCount]);
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.round(totalSeconds);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

/** @public */
export const UsageAnalyticsPage = () => {
  return (
    <RequirePermission permission={usageAnalyticsReadAggregatesPermission}>
      <UsageAnalyticsPageContent />
    </RequirePermission>
  );
};

const useFilterStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

function FilterBar(props: {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}) {
  const classes = useFilterStyles();
  return (
    <Paper elevation={0} className={classes.root}>
      <Grid container spacing={2} alignItems="center">
        {filterFields.map(field => (
          <Grid item xs={6} sm={4} md={2} key={field.name}>
            <TextField
              id={`usage-analytics-filter-${field.name}`}
              fullWidth
              size="small"
              variant="outlined"
              label={field.label}
              name={field.name}
              type={field.type}
              value={props.values[field.name]}
              InputLabelProps={{ shrink: true }}
              onChange={event =>
                props.onChange({
                  ...props.values,
                  [field.name]: event.target.value,
                })
              }
            />
          </Grid>
        ))}
        <Grid item>
          <Button size="small" onClick={() => props.onChange(emptyFilters)}>
            Clear
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function filterOptions(values: FilterValues): UsageReportFilters {
  const result: UsageReportFilters = {};
  for (const { name } of filterFields) {
    if (values[name]) {
      result[name] = filterValue(name, values[name]);
    }
  }
  return result;
}

function filterValue(key: FilterName, value: string) {
  if (key === 'from') return `${value}T00:00:00.000Z`;
  if (key === 'to') {
    const exclusiveEnd = new Date(`${value}T00:00:00.000Z`);
    exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
    return exclusiveEnd.toISOString();
  }
  return value;
}
