import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';

export function waitWorkflow() {
  type InputParameters = {
    name: string;
    delayMilliseconds: number;
    maxCalls: number;
  };

  return createTemplateAction<InputParameters>({
    id: 'stress:waitWorkflow',
    schema: {
      input: {
        required: ['name'],
        type: 'object',
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            description:
              'The Ticket Number used to check the status of the Workflow.',
          },
          delayMilliseconds: {
            type: 'number',
            title: 'Delay',
            description:
              'The amount of milliseconds to delay before the next checkStatus call.',
          },
          maxCalls: {
            type: 'number',
            title: 'Max Calls',
            description:
              'The amount of maximum calls allowed to check a status before stopping.',
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          status: {
            title: 'Status',
            type: 'object',
            properties: {
              message: {
                title: 'Status Message',
                type: 'string',
              },
            },
          },
          results: {
            title: 'Results from Ticket execution',
            type: 'object',
          },
        },
      },
    },
    async handler(ctx) {
      const { name, maxCalls, delayMilliseconds } = getParameters(ctx.input);

      ctx.logger.info(`Running the long running workflow: ${name}...`);

      let i = 1;

      for (;;) {
        ctx.logger.info(`waiting... [${i}/${maxCalls}]`);

        if (i++ >= maxCalls) {
          break;
        }

        await new Promise(res => setTimeout(res, delayMilliseconds));
      }

      ctx.output('status.message', 'Workflow completed');
    },
  });

  function getParameters(input: InputParameters) {
    const { name, delayMilliseconds, maxCalls } = input;
    return {
      name,
      maxCalls: maxCalls ?? 30,
      delayMilliseconds: delayMilliseconds ?? 2000,
    };
  }
}
