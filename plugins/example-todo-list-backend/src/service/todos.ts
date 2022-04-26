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
import { v4 as uuid } from 'uuid';
import { NotFoundError } from '@backstage/errors';

export type Todo = {
  title: string;
  author?: string;
  id: string;
  timestamp: number;
};

export type TodoFilter = {
  property: Exclude<keyof Todo, 'timestamp'>;
  values: Array<string | undefined>;
};

export type TodoFilters =
  | {
      anyOf: TodoFilters[];
    }
  | { allOf: TodoFilters[] }
  | { not: TodoFilters }
  | TodoFilter;

const todos: { [key: string]: Todo } = {};

const matches = (todo: Todo, filters?: TodoFilters): boolean => {
  if (!filters) {
    return true;
  }

  if ('allOf' in filters) {
    return filters.allOf.every(filter => matches(todo, filter));
  }

  if ('anyOf' in filters) {
    return filters.anyOf.some(filter => matches(todo, filter));
  }

  if ('not' in filters) {
    return !matches(todo, filters.not);
  }

  return filters.values.includes(todo[filters.property]);
};

export function add(todo: Omit<Todo, 'id' | 'timestamp'>) {
  const id = uuid();

  const obj: Todo = { ...todo, id, timestamp: Date.now() };
  todos[id] = obj;
  return obj;
}

export function getTodo(id: string) {
  return todos[id];
}

export function update({ id, title }: { id: string; title: string }) {
  let todo = todos[id];
  if (!todo) {
    throw new NotFoundError('Item not found');
  }

  todo = { ...todo, title, timestamp: Date.now() };
  todos[id] = todo;
  return todo;
}

export function getAll(filter?: TodoFilters) {
  return Object.values(todos)
    .filter(value => matches(value, filter))
    .sort((a, b) => b.timestamp - a.timestamp);
}

// prepopulate the db
add({ title: 'just a note' });
add({ title: 'another note' });
