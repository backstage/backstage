import { ConfigReader } from '@backstage/config';
import { ApiProvider } from '@backstage/core-app-api';
import { configApiRef, DiscoveryApi, discoveryApiRef } from '@backstage/core-plugin-api';
import {
    renderInTestApp, setupRequestMockHandlers, TestApiRegistry
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { gerritChangesBuffer, gerritUsersBuffer } from '../__fixtures__';
import { GerritReviews } from './GerritReviews';

jest.mock('react-text-truncate', () => {
    const { forwardRef } = jest.requireActual('react');
    return {
        __esModule: true,
        default: forwardRef((props: any, ref: any) => (
            <div ref={ref}>{props.text}</div>
        )),
    };
});

describe('gerrit reviews', () => {
    let apis: any;
    const mockBaseUrl = 'http://localhost:7007/proxy';
    const server = setupServer(
        rest.get(`${mockBaseUrl}/gerrit/a/accounts/*`, (_, res, ctx) =>
            res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.body(gerritUsersBuffer),
            ),
        ),
        rest.get(`${mockBaseUrl}/gerrit/a/changes/*`, (_, res, ctx) =>
            res(
                ctx.status(200),
                ctx.set('Content-Type', 'application/json'),
                ctx.body(gerritChangesBuffer)
            ),
        ),
    );

    // Enable handlers for network requests
    setupRequestMockHandlers(server);

    beforeEach(() => {
        const provider = {
            host: 'gerrit-review.gic.ericsson.se',
            query: 'state=ACTIVE',
        };
        const config = {
            catalog: {
                providers: {
                    gerrit: {
                        'active-g1': provider,
                    },
                },
            },
            integrations: {
                gerrit: [{
                    host: 'gerrit-review.gic.ericsson.se',
                    baseUrl: 'https://gerrit-review.gic.ericsson.se',
                    cloneUrl: 'https://gerrit-review.gic.ericsson.se/admin/repos',
                    gitilesBaseUrl: 'https://gerrit-review.gic.ericsson.se/plugins/gitiles',
                }]
            },
        };

        const mockDiscoveryApi = {
            getBaseUrl: () => mockBaseUrl,
        } as unknown as Partial<DiscoveryApi>;

        apis = TestApiRegistry.from(
            [discoveryApiRef, mockDiscoveryApi],
            [configApiRef, new ConfigReader(config)]
        );
    });

    it('should render Gerrit Review Card', async () => {
        await renderInTestApp(
            <ApiProvider apis={apis}>
                <GerritReviews />
            </ApiProvider>,
            {
                mountedRoutes: {
                    '/gerrit': rootRouteRef,
                },
            },
        );
        expect(screen.getByText('My Gerrit Review Dashboard!')).toBeInTheDocument();
        expect(screen.getByText('Open Reviews')).toBeInTheDocument();
        expect(screen.getByText('Incoming Reviews')).toBeInTheDocument();
        expect(screen.getByText('Closed Reviews')).toBeInTheDocument();
        expect(screen.getByText('Gerrit User')).toBeInTheDocument();
        expect(screen.getAllByText('Subject')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Owner')[0]).toBeInTheDocument();
    });

    it('should not render GerritReviewCard:Due to HTTP errors', async () => {
        server.use(
            rest.get(`${mockBaseUrl}/gerrit/a/changes/`, (_req, res, ctx) => {
                return res(ctx.status(500))
            }),
        );

        await renderInTestApp(
            <ApiProvider apis={apis}>
                <GerritReviews />
            </ApiProvider>,
            {
                mountedRoutes: {
                    '/gerrit': rootRouteRef,
                },
            },
        );
        expect(screen.getAllByText("Internal Server Error")).toHaveLength(3);
        expect(screen.queryByText('Gerrit User')).toBeInTheDocument();
        expect(screen.queryByText('Open Reviews')).not.toBeInTheDocument();
        expect(screen.queryByText('Incoming Reviews')).not.toBeInTheDocument();
        expect(screen.queryByText('Closed Reviews')).not.toBeInTheDocument();
        expect(screen.queryByText('My Gerrit Review Dashboard!')).toBeInTheDocument();
    });

    it('should render GerritReviewCard with only closed reviews', async () => {
        server.use(
            rest.get(`${mockBaseUrl}/gerrit/a/changes/*`, (req, res, ctx) => {
                // Remove special chars and white spaces before checking
                const gerritReviewParam = req.url.searchParams.get('q')?.replace(/\W+/g, '');
                if (gerritReviewParam === 'isclosedownerself') {
                    return res(
                        ctx.status(200),
                        ctx.set('Content-Type', 'application/json'),
                        ctx.body(gerritChangesBuffer)
                    )
                }
                return res(
                    ctx.status(500),
                    ctx.set('Content-Type', 'application/json'),
                )
            }
            ));

        await renderInTestApp(
            <ApiProvider apis={apis}>
                <GerritReviews />
            </ApiProvider>,
            {
                mountedRoutes: {
                    '/gerrit': rootRouteRef,
                },
            },
        );
        expect(screen.getByText('Gerrit User')).toBeInTheDocument();
        expect(screen.queryByText('Closed Reviews')).toBeInTheDocument();
        expect(screen.queryByText('Open Reviews')).not.toBeInTheDocument();
        expect(screen.queryByText('Incoming Reviews')).not.toBeInTheDocument();
    });
});
