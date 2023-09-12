# Hermes

[Hermes](https://ghe.spotify.net/hermes/hermes/wiki) is being deprecated in favor of gRPC and HTTP, you can read more about it [here](https://backstage.spotify.net/docs/default/component/architecture/radar/frameworks/hermes). There are still some services that use Hermes, so having the Hermes tools can be useful. Down below is a tutorial of how to install/test/use Hermes.

## Installing Hermes

!!! note
Your SSH authentication needs to be working to complete this step.
Make sure you followed all the steps in the [Spotify network access](../2-spotify-network-access/) section.

> [Hermes](https://ghe.spotify.net/hermes/hermes/wiki)\* is a protocol similar to HTTP that is commonly used in the Spotify backend. We have a set of Hermes command line tools that you need to install -- including **_jhurl_**, the Hermes equivalent of **curl**, which is useful for testing Hermes endpoints. Hermes is being replaced by gRPC, but there are still a lot of services that use Hermes, so having the Hermes tools will be useful.

Get the Hermes tools through the [homebrew-spotify](https://ghe.spotify.net/shared/homebrew-spotify) [tap](https://backstage.spotify.net/docs/backend-golden-path/part-1-configuring-your-local-development-environment/3-installing-the-standard-backend-development-toolkit/#spotify-brew-tap):

### Install on MacOS

```sh
brew install spotify/sptaps/hmtools
```

### Install on Linux

Run `apt install spotify-hermes-tools`

!!! note
If you get:

    ```sh
    E: Unable to locate package spotify-hermes-tools
    ```

    You'll need to add `repository.spotify.net` as a repository before installation. This can be done in the following manner.

    Run:

    ```sh
    sudo vim /etc/apt/sources.list.d/spotify-private-stable.list
    ```

    **For the next two commands/instructions, if you're still using a Trusty machine, please replace the references of `bionic` with `trusty`.**

    Ensure that the content of that file is the following:

    ```sh
    # spotify-private-stable
    deb https://repository.spotify.net/focal stable main non-free
    deb-src https://repository.spotify.net/focal stable main non-free
    ```

    To get an apt key for the repository, then run:

    ```sh
    curl -O https://repository.spotify.net/direct/focal/pool/stable/non-free/apt-keys/spotify-apt-keys_3.0-2022-03-21-18-10-59-81a1669_all.deb && sudo dpkg -i spotify-apt-keys_3.0-2022-03-21-18-10-59-81a1669_all.deb
    ```

    And then run:

    ```sh
    sudo apt-get update && sudo apt-get install spotify-hermes-tools
    ```

!!! note
If using Ubuntu version 20.04 or newer, previous steps might not work. An alternative is to clone the repository (https://ghe.spotify.net/hermes/hermes-tools), and compile hermes-tools. If running `mvn package` throws an error related with dependencies, probably you're missing Artifactory `settings.xml` file. Follow the instructions here: https://backstage.spotify.net/docs/artifactory/user/setup/ and then try building again.
Afterwards, just add `bin` directory to `PATH` environment variable.

### Install on Windows

- Clone git repository: https://ghe.spotify.net/hermes/hermes-tools.git.
- Build with maven: `mvn package`.
- Add `bin` directory to user's PATH environment variable.
- Add a new environment variable named JAVA that points to the java executable. Note that it must have no spaces so use the shortened 8 character version of any directories that have spaces. For example `C:\Progra~1\Amazon~1\jdk17.0.2_8\bin\java`
- Use from Bash shell.

### Test jhurl

Verify that **jhurl** works by asking the Spotify **metadata** service for some episode information:

```sh
jhurl -s services.gew1 "hm://metadata/3/episode/1d3cf0c650765c3e9f7c8ee3dce4e5f0?alt=json"
```

The response should look something like this:

```sh
Reply UUID:      05cba3acb5281a-a6f840-b2ec-714d-c0f161ed
Request UUID:    05cba3aca3be24-a1becb-285b-7f3c-00000000
Duration:        973ms
Status:          200 OK
Content-Type:    application/json; charset=utf-8
MD-Projected-Time: 1629225643727
MD-Stored-Locally-Time: 1629225645090
MC-Cache-Policy: public
MC-TTL:          600
MD-Version:      0
MC-ETag:         \x0a\x10\x95\xd3\xb3\x13p0\xffC)h\x9a&P+b\x8e\x10\xcf\xdd\xa9\xab\xb5/\x18\x00

['{"gid": "1d3cf0c650765c3e9f7c8ee3dce4e5f0","name": "Move fast and make sure nobody gets pager alerts at 2AM","duration": 1584718,...
```

!!! note
If you get UnsatisfiedLinkError when running jhurl in an Apple Silicon (e.g. M1) Mac, make sure you are running version `0.2.7` and above of `hermes-tools`.

## Create a GHE repository through backstage

If you want to enable the Hermes server and client modules,

- Check the **Hermes** checkbox

when creating the GHE repository.

## Verifying that the service is running locally

### Calling via jhurl

Let's try talking to the running service through **_jhurl_**.

In your Terminal window, enter:

```sh
echo '{"string_one" :"golden", "string_two" :"path", "reverse" : "false"}' | jhurl -X POST -z tcp://localhost:5700 "hm://<service-id>/concat"
```

(Note: make sure you replace the `<service-id>` with the name of your service - as it is in Backstage)

The response should look something like this:

```sh
Reply UUID:      058cb2fad55654-6fe434-0b24-c051-00000000
Request UUID:    058cb2fad38f62-8997e6-9e1c-c3c7-00000000
Duration:        44ms
Status:          200 OK
Content-Length:  10

['goldenpath']
```

If you get this response, Hermes works OK.

### Calling via CURL

You can also call Hermes using a standard CURL:

```sh
curl -X "POST" 0.0.0.0:8080/concat -d '{"string_one" :"golden", "string_two" :"path", "reverse" : "false"}'
```

The response should look something like this:

```
goldenpath
```

## Understanding Hermes routes and endpoints

In the `ConcatHermesResource` class, locate the `routes()` method.

Notice that the method contains one example route. A route is both an endpoint address to which our service listens and a specification of how requests that come to that endpoint are to be handled.

Here is the `concat` route which defines an endpoint that can be called through an HTTP POST request:

```java
Route.async("POST", "/concat", this::concat)
    .withMiddleware(ConcatHermesResource::serialize)
    .withDocString(
        "Concat handler", "Concatenates two strings, in an optional reversed order."));
```

This route specifies that a method also called `concat` is to be used to handle any incoming requests to this endpoint. Here is the code of `concat`, which can also be found in the `ConcatHermesResource` class:

```java
  CompletionStage<Response<String>> concat(final RequestContext context) {
    LOG.info("Received concat request over Hermes.");
    ...
    return completedFuture(
        Response.forPayload(
            ConcatUtils.concatenate(request.stringOne(), request.stringTwo(), request.reverse())));
  }
```

!!! note
[Here](https://ghe.spotify.net/grpc/grpc-examples) is examples on how to call a Hermes endpoint from a gRPC service.

## Documenting Hermes APIs

Documentation for a Hermes route can be supplied through the method `.withDocString`, have a look at the **ConcatHermesResource.routes** method to see an example.

When your service is deployed and running in production, its documentation will be automatically displayed on the service's **API** tab in Backstage, making it easy for other users to see what endpoints are available to them:

![backstage service dashd api](../part-3-developing-your-backend-service/img/image_0.png)

### Troubleshooting

To make your API docs available via Backstage Hermes must be enabled, even if you only expect it to be called via HTTP. This is a missing feature in Backstage so make sure you have the [`HermesServerModule`](https://ghe.spotify.net/first-aid/accountprivacy-api/pull/46/files), the [`hermes.server.address`](https://ghe.spotify.net/first-aid/accountprivacy-api/pull/45/files) config key, and the hermes ports exposed in [`kubernetes/deployment.yaml`](https://ghe.spotify.net/first-aid/accountprivacy-api/pull/44/files) and [`kubernetes/service.yaml`](https://ghe.spotify.net/first-aid/accountprivacy-api/pull/42/files).

## starting a docker container locally and calling it

Start a container from the image that you created by running the following:

```sh
docker run --rm --dns 1.1.1.1 -p 8080:8080 -p 5700:5700 -p 5990:5990 -e SPOTIFY_DOMAIN=gew1.spotify.net $(jq -r '.image' target/jib-image.json)
```

!!! note "Port mappings"
The -p option maps the internal ports of the running Apollo service to the external ports of the Docker container. Port 8080 is the default HTTP port in Apollo, 5700 is the default Hermes port and 5990 is the default gRPC port.

You can now `jhurl` the service in another Terminal window using the IP address of the container and the port,

jhurl to it with:

```sh
echo '{"string_one" :"greet", "string_two" :"ings", "reverse" : "false"}' | jhurl -X POST -z tcp://localhost:5700 "hm://<service-id>/concat"
```

## Integration test

The Hermes test methods use the `ServiceHelper#request(Request)` to make the request.

## Hermes mocking

Hermock has submodule for intercepting and mocking Hermes requests found [here](https://ghe.spotify.net/refused/hermock/tree/master/testcontainers).

Included as a separate maven module:

```xml
<dependency>
  <groupId>com.spotify</groupId>
  <artifactId>spotify-hermock-testcontainers</artifactId>
  <scope>test</scope>
</dependency>
```

Create and start a container intercepting all Hermes services using
nameless service discovery.

```java
private static HermockProxyContainer proxy =
    new HermockProxyContainer()
        .withNameless(nameless)
        // All services with hm protocol will get routed here
        .registerNamelessAllHermesServices();
...
// Start with @Container in JUnit 5 or @Rule/@ClassRule in JUnit 4 or proxy.start()
```

Then we declare rules how to mock the Hermes messages.

```java
proxy.mock()
  .when(username("barry"::equals))
  .reply(statusOK().and(payload("manilow")));
```

## Checking that your changes reach production

Call your service using **jhurl** with the following call,

```sh
echo '{"string_one" :"hello", "string_two" :"production", "reverse" : "false"}' | jhurl -X POST -s services.gew1.spotify.net "hm://<service-discovery-name>/concat"
```

If the service is up and running, you should get a `helloproduction` response.

## Exposing your service to the outside world

To make our service accessible to the outside world, we will be using [Webgate](https://backstage.spotify.net/components/webgate) which translates HTTP to our in-house protocol Hermes and back. In this tutorial we'll configure Edgeproxy to route traffic through Webgate to our service, using set of experimental webgate domains that we often use when testing new services.
You will need to create a config file in the [edge-control-service](https://ghe.spotify.net/edge/edge-control-service/) repo on GHE. For simplicity, we can do this directly in the browser using a codemod that generates configuration for a **Hermes** backend (important to note that this codemod is only for backends with Hermes endpoints).

Navigate to the `edge-proxy-hermes-config` [codemod](https://backstage.spotify.net/codemods/edge-proxy-hermes-config).

1. Update "Service Discovery Name" to the service discovery name of your service (which you can find in the service's **Metadata** box in its **Overview** in Backstage)
2. Check "Employee Only"
3. Check "Exposed To Internet"
4. Under "Webgate Domain Set" select "Experimental"
5. Keep "Prefix" selected as "Internet Matching Rule Type"
6. Under "Internet Matching Rule" replace the / with /<service-discovery-name>/ using the same service discovery name from step 1
7. Submit the form

This will automatically raise a PR in the [edge-control-service](https://ghe.spotify.net/edge/edge-control-service/) repo.

The output will look something like this:

```yaml
hermes_endpoints:
  - service_discovery_name: <service-discovery-name>
    access_control:
      employee_only: true
      allow_unauthenticated: false
    exposed_paths:
      - domains:
          - exp.wg.spotify.com
          - gae-exp.spotify.com
          - gew-exp.spotify.com
          - guc-exp.spotify.com
        matching_rules:
          - prefix: '/<service-discovery-name>/'
        rule_acceess_control:
          exposed_to_internet: true
          exposed_internally: false
```
