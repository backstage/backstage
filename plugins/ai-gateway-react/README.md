# AI gateway React

Web library for the [AI gateway backend](../ai-gateway-backend) plugin. It lets frontend code generate text and structured objects with the models that the operator has configured on the backend.

## Usage

With the new frontend system, install the plugin, which provides the API:

```bash
yarn --cwd packages/app add @backstage/plugin-ai-gateway-react
```

```ts title="packages/app/src/App.tsx"
import aiGatewayPlugin from '@backstage/plugin-ai-gateway-react/alpha';

const app = createApp({ features: [aiGatewayPlugin] });
```

Then use the API from your components:

```ts
import { useApi } from '@backstage/core-plugin-api';
import { aiGatewayApiRef } from '@backstage/plugin-ai-gateway-react';

const aiGateway = useApi(aiGatewayApiRef);

const { text } = await aiGateway.generateText({ prompt: 'Say hello' });

const { object } = await aiGateway.generateObject<{ summary: string }>({
  prompt: 'Summarize this change',
  schema: {
    type: 'object',
    properties: { summary: { type: 'string' } },
    required: ['summary'],
  },
});

const { textStream, response } = aiGateway.streamText(
  { prompt: 'Explain this change' },
  { signal: abortController.signal },
);
for await (const delta of textStream) {
  // render delta
}
const { finishReason, usage } = await response;
```

The server does not validate generated objects against the schema, so validate `object` before you rely on its shape.
