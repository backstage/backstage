import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
  Entity,
} from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { Logger } from 'winston';

/**
 * An entity provider that can be used for load testing. Not for production use.
 *
 * @remarks
 *
 * Add it to the catalog builder in your
 * `packages/backend/src/plugins/catalog.ts` doing some type of work, for
 * example:
 *
 * ```
 * builder.addEntityProvider(
 *   new LoadTestingEntityProvider({
 *     logger: env.logger,
 *     onStartup: async ({ connection, generateRandomEntities }) => {
 *       await connection.applyMutation({
 *         type: 'full',
 *         entities: generateRandomEntities(100000).map(e => ({
 *           entity: e,
 *           locationKey: 'l',
 *         })),
 *       });
 *     },
 *   }),
 * );
 * ```
 *
 * The provider will run the test, outputting some timing info onto the console.
 * It will also clean up everything you added through the given connection.
 */
export class LoadTestingEntityProvider implements EntityProvider {
  constructor(private readonly options: LoadTestingEntityProviderOptions) {}

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.getProviderName} */
  getProviderName() {
    return `LoadTestingEntityProvider`;
  }

  /** {@inheritdoc @backstage/plugin-catalog-node#EntityProvider.connect} */
  async connect(connection: EntityProviderConnection) {
    const delayStartup = this.options.delayStartup ?? 10_000;
    const logger = this.options.logger.child({
      class: LoadTestingEntityProvider.prototype.constructor.name,
    });

    if (delayStartup) {
      logger.info(
        `[LOAD-TEST] Starting in ${(delayStartup / 1000).toFixed(1)}s`,
      );
    }

    setTimeout(async () => {
      const timer = () => {
        const startedOn = Date.now();
        return () => `${((Date.now() - startedOn) / 1000).toFixed(1)}s`;
      };

      const overallTimer = timer();
      logger.info(`[LOAD-TEST] Started`);

      const runTimer = timer();
      try {
        await this.options.onStartup({
          connection,
          logger,
          generateRandomEntities,
        });
        logger.info(`[LOAD-TEST] Finished in ${runTimer()}`);
      } catch (error) {
        logger.error(`[LOAD-TEST] Failed after ${runTimer()}`, error);
      }

      const cleanupTimer = timer();
      logger.info(`[LOAD-TEST] Running cleanup`);
      await connection.applyMutation({
        type: 'full',
        entities: [],
      });

      logger.info(`[LOAD-TEST] ***************************************`);
      logger.info(`[LOAD-TEST] Test run time:     ${runTimer()}`);
      logger.info(`[LOAD-TEST] Cleanup run time:  ${cleanupTimer()}`);
      logger.info(`[LOAD-TEST] Total time:        ${overallTimer()}`);
      logger.info(`[LOAD-TEST] ***************************************`);
    }, delayStartup);
  }
}

function generateRandomEntities(count: number): Entity[] {
  const result: Entity[] = [];

  for (let i = 1; i <= count; ++i) {
    result.push({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        annotations: {
          [ANNOTATION_ORIGIN_LOCATION]: 'url:http://example.com/load-testing',
          [ANNOTATION_LOCATION]: 'url:http://example.com/load-testing',
        },
        namespace: 'load-test',
        name: `load-test-${i}`,
      },
      spec: {
        type: 'load-test-data',
        owner: 'me',
        lifecycle: 'experimental',
      },
    });
  }

  return result;
}

/**
 * Options for LoadTestingEntityProvider.
 */
export interface LoadTestingEntityProviderOptions {
  /**
   * The logger to use.
   */
  logger: Logger;

  /**
   * The number of milliseconds of delay to wait before starting the test. This
   * gives the backend a chance to settle into a stable state before the test
   * starts.
   *
   * @defaultValue 5000
   */
  delayStartup?: number;

  /**
   * What work to do on startup.
   */
  onStartup: (context: {
    connection: EntityProviderConnection;
    logger: Logger;
    generateRandomEntities(count: number): Entity[];
  }) => Promise<void>;
}
