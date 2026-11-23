# Connection URL contracts

Read the checked-out
[`withBaseUrl`](../../../../packages/connections/src/system/withBaseUrl.ts),
[`connectionBaseUrlSchema`](../../../../packages/connections/src/system/connectionBaseUrlSchema.ts)
and [lookup implementation](../../../../packages/connections-node/src/lookup.ts)
before changing URL behavior. These are shared contracts, not provider defaults.

## Identity and returned data

`withBaseUrl` adds required `baseUrl` and `getLookupIdentity` to the definition.
The callback derives `{ key: 'host', value: new URL(baseUrl).host }` for lookup and
duplicate validation. It does not add `host` to the parsed or returned connection.
The service matches `new URL(query.url).host`, including non-default ports.
Configured host spelling is preserved in `baseUrl`; parsed lookup hosts are
normalized by the URL parser.

API overrides do not add lookup aliases. Two installations under different
paths on the same host cannot have separate connections of the same type.
Path-aware identity requires a separate framework design; do not implement it
inside a provider definition. See the shared
[lookup rules](../../../../docs/backend-system/core-services/connections/01-concepts.md#lookup-strategies).

## Roots and relative requests

The shared schema accepts absolute HTTP and HTTPS roots with or without a
trailing slash. It adds a missing slash without rewriting the configured spelling,
context path or percent-encoded content. It rejects raw whitespace and controls,
backslashes, credentials (including an empty user), query delimiters and fragment
delimiters (including bare `?` or `#`). IP addresses and internal hosts work;
HTTPS-only and DNS-name restrictions are not part of the shared schema.
Recommend HTTPS when credentials cross untrusted networks.

Append relative request paths without a leading slash. For example,
`new URL('search', 'https://monitoring.example.com/grafana/api/')` keeps
`/grafana/api/`; `/search` discards it. Test with roots returned by the actual
schema or service, not with a test-only slash replacement.

## Optional API roots

The helper does not add `apiBaseUrl`, fill an omitted optional field, derive a
provider API path, or inspect authentication to choose a destination. Declare
that field with `connectionBaseUrlSchema.optional()` when it is useful. An
explicit override may use another host, scheme, port or context path.

Define the consumer's fallback from official provider semantics. Grafana's
[consumer example](../../../../docs/backend-system/core-services/connections/types/grafana.md#search-grafana-dashboards)
uses `connection.apiBaseUrl ?? new URL('api/', connection.baseUrl)`. The optional
field itself remains absent or undefined. Other APIs may use the site root
directly or need an explicit API address; establish that from the provider rather
than copying a prefix or deriving a regional gateway. Explain whether an override
includes the API prefix so consumers do not append it twice.

Integration configuration readers are a separate layer. Their defaults are not
automatically applied by
[connection parsing](../../../../packages/connections/src/config/buildConnectionsFromConfig.ts),
[legacy conversion](../../../../packages/connections/src/config/getLegacyIntegrations.ts)
or [the service](../../../../packages/connections-node/src/DefaultConnectionsService.ts).
Trace the actual returned data before promising a default, and preserve explicit
internal endpoints instead of replacing them with a public host-derived URL.
