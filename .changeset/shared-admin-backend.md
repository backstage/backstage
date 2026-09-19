---
'@backstage/plugin-permission-backend': patch
---

Registers the shared administration permission and evaluates plugin administration conditions using exact plugin IDs.

Supports universal resource permission checks from frontend and backend clients. These checks allow only unconditional policy grants and return denied decisions without exposing conditions for conditional grants. Existing scoped and conditional authorization behavior is unchanged.
