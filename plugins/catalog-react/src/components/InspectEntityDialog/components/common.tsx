/*
 * Copyright 2022 The Backstage Authors
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

import { Link } from '@backstage/core-components';
import { HelpCircle } from 'lucide-react';
import { ReactNode } from 'react';

export function ListItemText(props: {
  primary: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="font-mono text-sm">{props.primary}</div>
      {props.secondary !== undefined && (
        <div className="font-mono text-sm text-muted-foreground">
          {props.secondary}
        </div>
      )}
    </div>
  );
}

export function ListSubheader(props: { children?: ReactNode }) {
  return (
    <div className="font-mono text-sm font-medium px-4 py-2 text-muted-foreground">
      {props.children}
    </div>
  );
}

export function Container(props: {
  title: ReactNode;
  helpLink?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-2">
      <div className="border rounded-lg">
        <div className="p-4">
          <h6 className="text-lg font-semibold mb-2">
            {props.title}
            {props.helpLink && <HelpIcon to={props.helpLink} />}
          </h6>
          {props.children}
        </div>
      </div>
    </div>
  );
}

// Extracts a link from a value, if possible
function findLink(value: string): string | undefined {
  if (value.match(/^url:https?:\/\//)) {
    return value.slice('url:'.length);
  }
  if (value.match(/^https?:\/\//)) {
    return value;
  }
  return undefined;
}

export function KeyValueListItem(props: {
  indent?: boolean;
  entry: [string, string];
}) {
  const [key, value] = props.entry;
  const link = findLink(value);

  return (
    <li className="px-2 py-1 flex items-center">
      {props.indent && <span className="mr-2 w-6 shrink-0" />}
      <ListItemText
        primary={key}
        secondary={link ? <Link to={link}>{value}</Link> : value}
      />
    </li>
  );
}

export function HelpIcon(props: { to: string }) {
  return (
    <Link to={props.to} className="ml-1 text-muted-foreground inline-block">
      <HelpCircle className="w-[1em] h-[1em]" />
    </Link>
  );
}
