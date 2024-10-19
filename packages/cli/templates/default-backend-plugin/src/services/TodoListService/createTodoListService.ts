import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import crypto from 'node:crypto';
import { TodoItem, TodoListService } from './types';

// TEMPLATE NOTE:
// This is a simple in-memory todo list store. It is recommended to use a
// database to store data in a real application. See the database service
// documentation for more information on how to do this:
// https://backstage.io/docs/backend-system/core-services/database
export async function createTodoListService({
  auth,
  logger,
  catalog,
}: {
  auth: AuthService;
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;
}): Promise<TodoListService> {
  logger.info('Initializing TodoListService');

  const storedTodos = new Array<TodoItem>();

  return {
    async createTodo(input, options) {
      let title = input.title;

      // TEMPLATE NOTE:
      // A common pattern for Backstage plugins is to pass an entity reference
      // from the frontend to then fetch the entire entity from the catalog in the
      // backend plugin.
      if (input.entityRef) {
        // TEMPLATE NOTE:
        // Cross-plugin communication uses service-to-service authentication. The
        // `AuthService` lets you generate a token that is valid for communication
        // with the target plugin only. You must also provide credentials for the
        // identity that you are making the request on behalf of.
        //
        // If you want to make a request using the plugin backend's own identity,
        // you can access it via the `auth.getOwnServiceCredentials()` method.
        // Beware that this bypasses any user permission checks.
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: options.credentials,
          targetPluginId: 'catalog',
        });
        const entity = await catalog.getEntityByRef(input.entityRef, {
          token,
        });
        if (!entity) {
          throw new NotFoundError(
            `No entity found for ref '${input.entityRef}'`,
          );
        }

        // TEMPLATE NOTE:
        // Here you could read any form of data from the entity. A common use case
        // is to read the value of a custom annotation for your plugin. You can
        // read more about how to add custom annotations here:
        // https://backstage.io/docs/features/software-catalog/extending-the-model#adding-a-new-annotation
        //
        // In this example we just use the entity title to decorate the todo item.

        const entityDisplay = entity.metadata.title ?? input.entityRef;
        title = `[${entityDisplay}] ${input.title}`;
      }

      const id = crypto.randomUUID();
      const createdBy = options.credentials.principal.userEntityRef;
      const newTodo = {
        title,
        id,
        createdBy,
        createdAt: new Date().toISOString(),
      };

      storedTodos.push(newTodo);

      // TEMPLATE NOTE:
      // The second argument of the logger methods can be used to pass
      // structured metadata. You can read more about the logger service here:
      // https://backstage.io/docs/backend-system/core-services/logger
      logger.info('Created new todo item', { id, title, createdBy });

      return newTodo;
    },

    async listTodos() {
      return { items: Array.from(storedTodos) };
    },

    async getTodo(request: { id: string }) {
      const todo = storedTodos.find(item => item.id === request.id);
      if (!todo) {
        throw new NotFoundError(`No todo found with id '${request.id}'`);
      }
      return todo;
    },
  };
}
