# Security Policy

## Supported Versions

See our [Release & Versioning Policy](https://backstage.io/docs/overview/versioning-policy#release-versioning-policy).

## Reporting a Vulnerability

Please report sensitive security issues via Spotify's [bug-bounty program](https://hackerone.com/spotify) rather than GitHub.

If you have questions about a potential vulnerability, please reach out on Discord by asking for a maintainer in the `#support` channel, or via direct message to a maintainer.

## Remediation and Notification Process

Vulnerabilities are handled and published through [GitHub Security Advisories](https://docs.github.com/en/code-security/security-advisories/about-github-security-advisories).

In the event of a vulnerability the runbook for the maintainers is as follows:

1. Create a [new draft security advisory](https://github.com/backstage/backstage/security/advisories/new). The values and descriptions don't need to be perfect to begin with as they can be edited later. For severity, use the "Assess severity using CVSS" and refer to [the guide](https://www.first.org/cvss/v3.1/user-guide) for help.
2. Request a CVE identification number. It can take up to 72h for one to be assigned so be sure to do this early on.
3. If there is not already a patch for the vulnerability, collaborate on one in a private fork:
   1. Head to the security advisory on GitHub and [create a private fork](https://docs.github.com/en/code-security/security-advisories/collaborating-in-a-temporary-private-fork-to-resolve-a-security-vulnerability)
   1. [Invite any collaborators](https://docs.github.com/en/code-security/security-advisories/adding-a-collaborator-to-a-security-advisory) from outside the maintainer team that should be part of creating a fix.
   1. Create one or multiple Pull Requests with fixes towards the fork. Note that these PRs will not have CI checks run on them, so more care should be taken to run local validation. The PRs are also not merged like normal PRs, but are instead merged straight into the main repo all at once when the merge button is hit on the security advisory.
4. Once the fix is ready in a PR or private fork and it is time to release it, there are a couple of options. Either merge into the main branch with a changeset and wait for a regular release, or do a quick release by manually bumping the version in `package.json` of the affected package, along with a manual `CHANGELOG.md` entry. Note that a quick release will only work if the package does not have any other pending changes that depend on pending changes in other packages, so be sure to manually check that first, and fall back to an early regular release if needed. In general it's best to stick with the regular release flow, with the quick release being used only for time sensitive fixes.
5. Finalize and publish the security advisory. Note that once you hit the publish button it's no longer possible to edit the advisory. Just like the CVE number this can take up to 72h, and expect it to be slower than the CVE number request.

## Vulnerability Policies

Backstage uses Snyk vulnerability scans in order to make sure we minimize vulnerabilities in our dependencies and get notified of new vulnerabilities.

There are many situations where a vulnerability does not affect a particular dependency because of how the vulnerable package is used. In that situation the package authors may choose to stay at the current version rather than bumping the dependency, leading to a warning in the vulnerability scans but no actual vulnerability.

To work around this and other similar issues, Snyk provides a method to ignore vulnerabilities. In order to provide the best visibility and most utility to adopters of Backstage, we store these ignore rules in `.snyk` policy files. This allows adopters to rely on our ignore policies if they wish to do so.

Adding a new ignore policy is done by creating or modifying an existing `.snyk` file within a package root. See the [Snyk Documentation](https://support.snyk.io/hc/en-us/articles/360007487097-The-snyk-file) for details on the syntax. Always include a description, full path, and time limit of the ignore policy.

## Coding Practices

In this section we highlight patterns where particular care needs to be taken in order to avoid security vulnerabilities, as well as the best practices to follow.

### Local file path resolution

A common pitfall in backend packages is to resolve local file paths based on user input, without sufficiently protecting against input that traverses outside the intended directory.

For example, consider the following code:

```ts
// WARNING: DO NOT DO THIS

import { join } from 'path';
import fs from 'fs-extra';

function writeTemporaryFile(tmpDir: string, name: string, content: string) {
  const filePath = join(tmpDir, name);
  await fs.writeFile(filePath, content);
}
```

If the `name` of the file is controlled by the user, they can for example enter `../../../../etc/hosts` as the name of the file. This can lead to a file being written outside the intended directory, which in turn can be used to inject malicious code or other form of attacks.

The recommended solution to this is to use `resolveSafeChildPath` from `@backstage/backend-common` to resolve the file path instead. It makes sure that the resolved path does not fall outside the provided directory. If you simply want to validate whether a file path is safe, you can use `isChildPath` instead.

The insecure example above should instead be written like this:

```ts
// THIS IS GOOD, DO THIS

import { resolveSafeChildPath } from '@backstaghe/backend-common';
import fs from 'fs-extra';

function writeTemporaryFile(tmpDir: string, name: string, content: string) {
  const filePath = resolveSafeChildPath(tmpDir, name);
  await fs.writeFile(filePath, content);
}
```

### Express responses

When returning a response from an Express route, always use `.json(...)` or `.end()` without any arguments. This ensures that the response can not be interpreted as an HTML document with embedded JavaScript by the browser. Never use `.send(...)` unless you want to send other forms of content, and be sure to always set an explicit content type. If you need to return HTML or other content that may be executed by the browser, be very careful how you handle user input.

If you want to return an error response, simply throw the error or pass it on to the `next(...)` callback. There is a middleware installed that will transform the error into a JSON response. Many of the common HTTP errors are available from `@backstage/errors`, for example `NotFoundError`, which will also set the correct status code.

The following example show how to return an error that contains user input:

```ts
res.send(`Invalid id: '${req.params.id}'`); // BAD

// import { InputError } from '@backstage/errors';
throw new InputError(`Invalid id: '${req.params.id}'`); // GOOD

// OR, in case a custom response is needed
res.json({ message: `Invalid id: '${req.params.id}'` }); // NOT BAD
```

No matter how trivial it may seem, always use `.json(...)`. It reduces the risk that a future refactoring introduces vulnerabilities:

```ts
res.send({ ok: true }); // BAD

res.json({ ok: true }); // GOOD
```

If you absolutely must return a string with `.send(...)`, use an explicit and secure `Content-Type`:

```ts
res.send(`message=${message}`); // BAD

res.contentType('text/plain').send(`message=${message}`); // GOOD
```

An example of how to return dynamic HTML is not provided here. If you need to do so, proceed with extreme caution and be very sure that you know what you are doing.
