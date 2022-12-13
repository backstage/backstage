import { PassThrough } from 'stream';
import { createAcmeExampleAction } from './example';
import { getVoidLogger } from '@backstage/backend-common';

describe('acme:example', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call action', async () => {
    const action = createAcmeExampleAction();

    const logger = getVoidLogger();
    jest.spyOn(logger, 'info');

    await action.handler({
      input: {
        myParameter: 'test',
      },
      workspacePath: '/tmp',
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        // Usage of mock-fs is recommended for testing of filesystem operations
        throw new Error('Not implemented');
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Running example template with parameters: test',
    );
  });
});
