---
status: pending
priority: p2
issue_id: '021'
tags: [code-review, security, cryptography]
dependencies: []
---

# 021 — HKDF salt is a static compile-time constant — no per-deployment key isolation

## Problem Statement

`deriveKey()` in `crypto.ts` uses HKDF-SHA-256 with a hardcoded salt:

```typescript
const derivedKey = crypto.hkdfSync(
  'sha256',
  ikm,
  Buffer.from('backstage-provider-token-salt-v1', 'utf8'), // ← static constant
  Buffer.from('provider-token-service', 'utf8'),
  32,
);
```

HKDF's salt is intended to provide entropy when the IKM has low entropy, and also to achieve
key separation between deployments. With a static salt, two deployments sharing the same
`providerToken.encryptionSecret` value (realistic when teams copy `.env` files or share a
secrets manager entry across environments) will derive **identical AES-256-GCM keys**.

Practical consequence: a database backup from staging can be decrypted using the production
key (and vice versa). Any operator with access to one environment's DB and another
environment's config file can read both environments' tokens.

## Findings

- **`plugins/provider-token-backend/src/crypto.ts`** (deriveKey function): hardcoded salt string `'backstage-provider-token-salt-v1'`

## Proposed Solution

Include a deployment-specific value in the HKDF `info` parameter. The `app.baseUrl` config
value is already available and is unique per deployment:

```typescript
export function deriveKey(secret: string, appBaseUrl: string): Buffer {
  const ikm = Buffer.from(secret, 'utf8');
  const salt = Buffer.from('backstage-provider-token-salt-v1', 'utf8'); // can stay static
  const info = Buffer.from(`provider-token-service:${appBaseUrl}`, 'utf8'); // deployment-specific
  return Buffer.from(crypto.hkdfSync('sha256', ikm, salt, info, 32));
}
```

**Migration concern:** Changing the key derivation will invalidate all existing encrypted tokens
in the database. A migration strategy is required:

1. Add a new version prefix (e.g., `v2`) to newly encrypted rows.
2. `decrypt()` detects `v1` rows and uses the old key derivation (static info) to decrypt,
   then immediately re-encrypts with the `v2` key (deployment-specific info) and writes back.
3. After all rows have been migrated (monitor via a row count query), remove the v1 path.

Alternatively, a simpler approach: document that `providerToken.encryptionSecret` must be
**unique per deployment** (do not share across environments) and add a config validator check
that warns if `app.baseUrl` contains `localhost` or `staging` while the secret matches a
known-weak format. This avoids the migration complexity entirely.

## Files to Change

- `plugins/provider-token-backend/src/crypto.ts` — add `appBaseUrl` parameter to `deriveKey()`
- `plugins/provider-token-backend/src/plugin.ts` — pass `config.getString('app.baseUrl')` to `deriveKey()`
- `plugins/provider-token-backend/src/DefaultProviderTokenService.ts` — update `deriveKey` call if moved there
