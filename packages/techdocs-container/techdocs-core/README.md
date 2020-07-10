# techdocs-core

This is the base [Mkdocs](https://mkdocs.org) plugin used when using Mkdocs with Spotify's TechDocs. It is written in Python and packages all of our Mkdocs defaults, such as theming, plugins, etc in a single plugin.

## Usage

**Installation instructions TBD.** We haven't published it to a Python registry yet.

Once you have installed the `mkdocs-techdocs-core` plugin, you'll need to add it to your `mkdocs.yml`.

```yaml
site_name: Backstage Docs

nav:
  - Home: index.md
  - Developing a Plugin: developing-a-plugin.md

plugins:
  - techdocs-core
```

## Running Locally

You can install this package locally using `pip` and the `--editable` flag used for making developing Python packages.

```bash
pip install --editable .
```

You'll then have the `techdocs-core` package available to use in Mkdocs and `pip` will point the dependency to this folder.

## Running with Docker

In the parent `Dockerfile` we add this folder to the build and install the package locally in the container. In the future, we'll probably move away from this approach and have it download directly from a Python registry (and this folder will publish to one).

See the `README.md` located in the `mkdocs/` folder for more details on how to build and run the Docker container.

## Linting

```bash
pip install -r requirements.txt
python -m black src/
```

**Note:** This will write to all Python files in `src/` with the formatted code. If you would like to only check to see if it passes, simply append the `--check` flag.
