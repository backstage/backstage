# example-ai-code-review

A demo page at `/ai-code-review` that reviews a GitHub pull request with an AI model.
It runs entirely in the browser:

- The diff is fetched from the GitHub API with the signed-in user's own token (via `scmAuthApi`).
  The token is only sent to GitHub and never to a Backstage backend.
- The review is generated through the AI gateway (`@backstage/plugin-ai-gateway-backend`), which uses the
  provider key configured by the operator. Nothing is posted to GitHub.

## Configuration

Add a provider to `app-config.local.yaml`, and make sure the GitHub integration and GitHub sign-in are configured:

```yaml
ai:
  defaultProvider: anthropic
  providers:
    anthropic:
      type: anthropic
      apiKey: ${ANTHROPIC_API_KEY}
      defaultModels:
        text-generation: claude-sonnet-4-5
```

Then run `yarn start` and open `/ai-code-review`.
