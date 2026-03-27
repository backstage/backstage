/*
 * Copyright 2020 The Backstage Authors
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
import { ComponentType, PropsWithChildren } from 'react';
import { LinkButton } from './LinkButton';
import { useLocation } from 'react-router-dom';
import { createRouteRef, useRouteRef } from '@backstage/core-plugin-api';
import { wrapInTestApp } from '@backstage/test-utils';
import { Link } from '../Link';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

const routeRef = createRouteRef({
  id: 'storybook.test-route',
});

const Location = () => {
  const location = useLocation();
  return <pre>Current location: {location.pathname}</pre>;
};

export default {
  title: 'Inputs/Button',
  component: LinkButton,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <>
          <p className="text-sm text-muted-foreground">
            A collection of buttons that should be used in the Backstage
            interface. These leverage the properties inherited from{' '}
            <Link to="https://ui.shadcn.com/docs/components/button">
              shadcn/ui Button
            </Link>
            , but include an opinionated set that align to the Backstage design.
          </p>

          <Separator />

          <div>
            <div>
              <Location />
            </div>
            <Story />
          </div>
        </>,
        { mountedRoutes: { '/hello': routeRef } },
      ),
  ],
  tags: ['!manifest'],
};

export const Default = () => {
  const link = useRouteRef(routeRef);
  // Design Permutations:
  // variant = default | secondary | outline | destructive | ghost | link
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h6 className="text-base font-semibold">Default Button:</h6>
          <p className="text-sm text-muted-foreground">
            This is the default button design which should be used in most
            cases.
          </p>
          <pre className="text-xs text-muted-foreground mt-1">
            variant="default"
          </pre>
        </div>
        <LinkButton to={link()} variant="default">
          Register Component
        </LinkButton>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h6 className="text-base font-semibold">Secondary Button:</h6>
          <p className="text-sm text-muted-foreground">
            Used for actions that cancel, skip, and in general perform negative
            functions, etc.
          </p>
          <pre className="text-xs text-muted-foreground mt-1">
            variant="secondary"
          </pre>
        </div>
        <LinkButton to={link()} variant="secondary">
          Cancel
        </LinkButton>
      </div>
      <div className="flex items-center justify-between gap-4 pb-4">
        <div>
          <h6 className="text-base font-semibold">Tertiary Button:</h6>
          <p className="text-sm text-muted-foreground">
            Used commonly in a ButtonGroup and when the button function itself
            is not a primary function on a page.
          </p>
          <pre className="text-xs text-muted-foreground mt-1">
            variant="outline"
          </pre>
        </div>
        <LinkButton to={link()} variant="outline">
          View Details
        </LinkButton>
      </div>
    </div>
  );
};

export const ButtonLinks = () => {
  const link = useRouteRef(routeRef);

  const handleClick = () => {
    return 'Your click worked!';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <LinkButton to={link()} variant="outline">
          Route Ref
        </LinkButton>
        <span className="text-sm text-muted-foreground">
          has props for both shadcn/ui Button as well as for react-router-dom's
          Route object.
        </span>
      </div>

      <div className="flex items-center gap-4 border-b border-border pb-4">
        <LinkButton to="/staticpath" variant="outline">
          Static Path
        </LinkButton>
        <span className="text-sm text-muted-foreground">
          links to a statically defined route. In general, this should be
          avoided.
        </span>
      </div>

      <div className="flex items-center gap-4 border-b border-border pb-4">
        <Button variant="outline" asChild>
          <a href="https://backstage.io">View URL</a>
        </Button>
        <span className="text-sm text-muted-foreground">
          links to a defined URL using shadcn/ui Button.
        </span>
      </div>

      <div className="flex items-center gap-4 pb-4">
        <Button variant="outline" onClick={handleClick}>
          Trigger Event
        </Button>
        <span className="text-sm text-muted-foreground">
          triggers an onClick event using shadcn/ui Button.
        </span>
      </div>
    </div>
  );
};
