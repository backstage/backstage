import {
  coreServices,
  createBackendModule,
  LoggerService,
} from '@backstage/backend-plugin-api';
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
  entitySchemaValidator,
} from '@backstage/catalog-model';
import { InputError } from '@backstage/errors';
import {
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { parseEntityYaml } from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import bodyParser from 'body-parser';
import express from 'express';
import Router from 'express-promise-router';
import lodash from 'lodash';

/**
 * An entity provider attached to a router, that lets users perform direct
 * manipulation of a set of entities using REST requests.
 */
class ImmediateEntityProvider implements EntityProvider {
  private connection?: EntityProviderConnection;
  private readonly entityValidator: (data: unknown) => Entity;

  constructor(private readonly options: ImmediateEntityProviderOptions) {
    this.entityValidator = entitySchemaValidator();
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName() {
    return `ImmediateEntityProvider`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    this.connection = connection;
  }

  getRouter(): express.Router {
    const router = Router();

    router.use(bodyParser.raw({ type: '*/*' }));

    router.post('/immediate/entities', async (req, res) => {
      if (!this.connection) {
        throw new Error(`Service is not yet initialized`);
      }
      const deferred = await this.getRequestBodyEntities(req);
      await this.connection.applyMutation({
        type: 'delta',
        added: deferred,
        removed: [],
      });
      res.status(201).end();
    });

    router.put('/immediate/entities', async (req, res) => {
      if (!this.connection) {
        throw new Error(`Service is not yet initialized`);
      }
      const deferred = await this.getRequestBodyEntities(req);
      await this.connection.applyMutation({
        type: 'full',
        entities: deferred,
      });
      res.status(201).end();
    });

    return router;
  }

  private async getRequestBodyEntities(
    req: express.Request,
  ): Promise<DeferredEntity[]> {
    if (!Buffer.isBuffer(req.body) || !req.body.length) {
      throw new InputError(`Missing request body`);
    }

    const result: DeferredEntity[] = [];

    for await (const item of parseEntityYaml(req.body, {
      type: 'immediate',
      target: 'immediate',
    })) {
      if (item.type === 'entity') {
        const deferred: DeferredEntity = {
          entity: lodash.merge(
            {
              metadata: {
                annotations: {
                  [ANNOTATION_ORIGIN_LOCATION]: 'immediate:immediate',
                  [ANNOTATION_LOCATION]: 'immediate:immediate',
                },
              },
            },
            item.entity,
          ),
          locationKey: `immediate:`,
        };

        await this.options.handleEntity?.(req, deferred);
        deferred.entity = this.entityValidator(deferred.entity);

        result.push(deferred);
      } else if (item.type === 'error') {
        throw new InputError(`Malformed entity YAML, ${item.error}`);
      } else {
        throw new InputError(`Internal error, failed to parse entity`);
      }
    }

    return result;
  }
}

/**
 * Options for {@link ImmediateEntityProvider}.
 */
interface ImmediateEntityProviderOptions {
  /**
   * The logger.
   */
  logger: LoggerService;

  /**
   * An optional callback function to perform adjustments to, or validate, an
   * incoming entity before being stored. It is permitted to modify the deferred
   * entity, but the request is static and has had its body consumed.
   */
  handleEntity?: (
    request: express.Request,
    deferred: DeferredEntity,
  ) => void | Promise<void>;
}

/**
 * Backend module that installs an immediate entity provider.
 *
 * @remarks
 *
 * Install it by doing `backend.add(immediateEntityProviderModule)` in your `packages/backend/src/index.ts` file.
 *
 * API:
 *
 * - `POST /api/catalog/immediate/entities`: Accepts a YAML document of entities, and
 *   inserts or updates the entities that match that document. Returns 201 OK on
 *   success.
 *
 * - `PUT /api/catalog/immediate/entities`: Accepts a YAML document of entities, and
 *   replaces the entire set of entities managed by the provider with those
 *   entities. Returns 201 OK on success.
 */
export const immediateEntityProviderModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'immediate-entity-provider',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        router: coreServices.httpRouter,
        catalogProcessing: catalogProcessingExtensionPoint,
      },
      async init({ logger, router, catalogProcessing }) {
        const provider = new ImmediateEntityProvider({
          logger,
          // add handleEntity here if you need to modify incoming entities before they are stored
        });

        catalogProcessing.addEntityProvider(provider);
        router.use(provider.getRouter());
      },
    });
  },
});
