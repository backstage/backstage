---
status: completed
priority: p2
issue_id: '018'
tags: [code-review, security, correctness]
dependencies: []
---

# 018 — Ciphertext components not validated before use in `decrypt()` — log injection and corrupt IV risk

## Problem Statement

`decrypt()` in `crypto.ts` parses the stored ciphertext format `v1:<iv_hex>:<tag_hex>:<data_hex>`
by splitting on `:` and passing the parts directly to `Buffer.from()` and AES-GCM decipher
operations. Two validation gaps exist:

**1. Unvalidated version string in error message (log injection):**

```typescript
const [version, ivHex, tagHex, dataHex] = stored.split(':');
if (version !== 'v1') {
  throw new Error(`Unsupported provider token ciphertext version: ${version}`);
}
```

`version` comes from the DB row content. A tampered DB row (e.g., by a compromised DB credential)
could contain a version string with `\n`, `\r`, or structured log-injection payloads. The error
propagates to `logger.error` calls in `DefaultProviderTokenService`, potentially injecting
log lines with attacker-controlled content.

**2. No IV length validation before `Buffer.from(ivHex, 'hex')`:**
AES-256-GCM requires a 12-byte (96-bit) IV. If `ivHex` is an odd-length hex string, Node's
`Buffer.from` silently truncates it, producing a short IV. GCM authentication will fail, but
the error surface is after the buffer allocation — the crypto library may behave unexpectedly
before reaching the auth tag check.

## Findings

- **`plugins/provider-token-backend/src/crypto.ts`** (decrypt function): unvalidated version string in error message
- **`plugins/provider-token-backend/src/crypto.ts`** (decrypt function): no IV length check before `Buffer.from(ivHex, 'hex')`
- **`plugins/provider-token-backend/src/crypto.ts`** (decrypt function): no data hex length or format check

## Proposed Solution

Add validation before any `Buffer.from` or decipher operations:

```typescript
function decrypt(stored: string, key: Buffer): string {
  const [version, ivHex, tagHex, dataHex] = stored.split(':');

  // Sanitize version before use in error messages
  if (!/^[a-z0-9_-]{1,16}$/.test(version ?? '')) {
    throw new Error('Malformed provider token ciphertext: invalid version');
  }
  if (version !== 'v1') {
    throw new Error(
      `Unsupported provider token ciphertext version: ${version}`,
    );
  }

  // Validate component lengths (12-byte IV = 24 hex chars, 16-byte GCM tag = 32 hex chars)
  if (!ivHex || ivHex.length !== 24) {
    throw new Error('Malformed provider token ciphertext: invalid IV length');
  }
  if (!tagHex || tagHex.length !== 32) {
    throw new Error('Malformed provider token ciphertext: invalid tag length');
  }
  if (!dataHex || dataHex.length % 2 !== 0) {
    throw new Error('Malformed provider token ciphertext: invalid data length');
  }

  // ... existing decipher code
}
```

## Files to Change

- `plugins/provider-token-backend/src/crypto.ts` — add validation in `decrypt()`
- `plugins/provider-token-backend/src/crypto.test.ts` — add test cases for malformed ciphertext inputs
