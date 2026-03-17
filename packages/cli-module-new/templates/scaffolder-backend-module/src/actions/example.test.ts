import { createExampleAction } from './example';
import {createMockActionContext} from '@backstage/plugin-scaffolder-node-test-utils'

describe('createExampleAction', () => {
  it('should call action', async () => {
    const action = createExampleAction();

    await expect(action.handler(createMockActionContext({
      input: {
        myParameter: 'test',
      },
    }))).resolves.toBeUndefined()
  });

  it('should fail when passing foo', async () => {
    const action = createExampleAction();

    await expect(action.handler(createMockActionContext({
      input: {
        myParameter: 'foo',
      },
    }))).rejects.toThrow("myParameter cannot be 'foo'")
  });
});
