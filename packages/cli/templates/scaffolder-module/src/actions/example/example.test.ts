import { PassThrough } from 'stream';
import { createAcmeExampleAction } from './example';

describe('acme:example', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call action', async () => {
    const action = createAcmeExampleAction();

    const logger = { info: jest.fn() };

    await action.handler({
      input: {
        myParameter: 'test',
      },
      workspacePath: '/tmp',
      logger: logger as any,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        // Usage of createMockDirectory is recommended for testing of filesystem operations
        throw new Error('Not implemented');
      },
    });

    expect(logger.info).toHaveBeenCalledWith(
      'Running example template with parameters: test',
    );
  });
});
