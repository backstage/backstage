# DiscoveryApi

The DiscoveryApi type is defined at
[packages/core-api/src/apis/definitions/DiscoveryApi.ts:30](https://github.com/backstage/backstage/blob/ca535f2f66c3a4980c80f4b1a049dfd07569010e/packages/core-api/src/apis/definitions/DiscoveryApi.ts#L30).

The following Utility API implements this type:
[discoveryApiRef](./README.md#discovery)

## Members

### getBaseUrl()

Returns the HTTP base backend URL for a given plugin, without a trailing slash.

This method must always be called just before making a request. as opposed to
fetching the URL when constructing an API client. That is to ensure that more
flexible routing patterns can be supported.

For example, asking for the URL for `auth` may return something like
`https://backstage.example.com/api/auth`

<pre>
getBaseUrl(pluginId: string): Promise&lt;string&gt;
</pre>
