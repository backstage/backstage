# Development Environment

Open a terminal window and start the web app using the following commands from the project root:

```bash
$ yarn install # may take a while

$ yarn start
```

The final `yarn start` command should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

By default, backstage will start on port 3000, however you can override this by setting an environment variable `PORT` on your local machine. e.g. `export PORT=8080` then running `yarn start`. Or `PORT=8080 yarn start`.

Once successfully started, you should see the following message in your terminal window:

```
You can now view example-app in the browser.

  Local:            http://localhost:8080
  On Your Network:  http://192.168.1.224:8080
```

### (Optional)Try on Docker

Run the following commands if you have Docker environment

```bash
$ yarn docker-build
$ docker run --rm -it -p 80:80 spotify/backstage
```

Then open http://localhost/ on your browser.

> See [package.json](/package.json) for other yarn commands/options.

[Next Step - Create a Backstage plugin](create-a-plugin.md)

[Back to Docs](README.md)
