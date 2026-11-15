---
name: backend-plugin-development
description: Reference for developing Backstage backend plugins and modules on the new backend system. Use this skill when writing or changing tests for a backend plugin, module, service, or router, including mocking core services and credentials and testing against real databases, caches, the filesystem, or remote services.
---

# Backend Plugin Development

This skill collects the checks and traps that matter when working on a backend plugin or module built with `@backstage/backend-plugin-api`.

It is a reference, not a procedure. Read only the reference that matches the task. To move a plugin's Express router to typed OpenAPI tooling, use the `onboard-to-openapi-server` skill.

## References

| Read                             | When                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [Testing](references/testing.md) | Adding or changing tests, mocking core services or credentials, or testing databases, caches, files, or remote services |

## Further reading

- [Building backend plugins and modules](https://backstage.io/docs/backend-system/building-plugins-and-modules/index)
- [Testing backend plugins and modules](https://backstage.io/docs/backend-system/building-plugins-and-modules/testing)
- [Core backend services](https://backstage.io/docs/backend-system/core-services/index)
