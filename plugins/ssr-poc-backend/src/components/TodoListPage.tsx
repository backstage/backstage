/*
 * Copyright 2025 The Backstage Authors
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
import { FC } from 'react';
import { TodoListItem } from './TodoListItem.tsx';

export const TodoListPage: FC = () => {
  const todos = [
    { id: 1, text: 'Learn React', complete: true },
    { id: 2, text: 'Build a Todo App', complete: false },
    { id: 3, text: 'Deploy the App', complete: false },
  ];

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <TodoListItem
            key={todo.id}
            text={todo.text}
            complete={todo.complete}
          />
        ))}
      </ul>
    </div>
  );
};
