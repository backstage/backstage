# Using Cookiecutter with Jinja2 extensions

Jinja2 extensions can be used with the scaffolder's `fetch:cookiecutter` built-in action to add filters, tests, or to extend the parser.

Using Cookiecutter extensions is a two-step process:

- [Installing the extension](#installing-the-extension), and
- [Instructing Cookiecutter to use the extension](#instructing-cookiecutter-to-use-the-extension)

### Installing the extension

This step depends on how the scaffolder is setup to use Cookiecutter:

- Using a local Cookiecutter, or
- Using a Cookiecutter Docker image, e.g. [spotify/backstage-cookiecutter](https://github.com/backstage/backstage/blob/37e35b91/plugins/scaffolder-backend/scripts/Cookiecutter.dockerfile).

Say we want to install [`jinja2_custom_filters_extension`](https://pypi.org/project/jinja2-custom-filters-extension/) to use the `upper_case_first_letter` filter in a Cookiecutter template.

#### Using a local Cookiecutter

The scaffolder is able to execute a locally installed Cookiecutter, and doesn't pull a Docker image in that case. If that's your setup, just ensure that the Jinja2 extensions, available via `pip` are installed alongside Cookiecutter, e.g. if Cookiecutter is baked into a custom Backstage image using `pip` and a `requirements.txt`:

In the custom Backstage Dockerfile:

```Dockerfile
...
RUN pip3 install -r requirements.txt
...
```

In requirements.txt:

```python
...
cookiecutter==1.7.2
jinja2_custom_filters_extension==0.0.2
...
```

#### Using a Cookiecutter Docker image

If the scaffolder doesn't find a local Cookiecutter, it pulls down the `spotify/backstage-cookiecutter` image. You can create a custom Cookiecutter image based on that, install extensions into it, and specify that customised image as an input `imageName` to the `fetch:cookiecutter` action:

```yaml
steps:
  - id: fetch-base
    name: Fetch Base
    action: fetch:cookiecutter
    input:
      url: https://github.com/spotify/cookiecutter-golang
      imageName: 'foo/custom-built-cookiecutter-image-with-extensions'
```

See for example, the [`Dockerfile`](./Dockerfile) in this directory.

### Instructing Cookiecutter to use the extension

Cookiecutter enables extensions mentioned in `cookiecutter.json`. `fetch:cookiecutter` generates a `cookiecutter.json`, deriving its values from `inputs` to `fetch:cookiecutter` in the scaffolder [Template](https://backstage.io/docs/features/software-templates/writing-templates), as:

```yaml
steps:
  - id: fetch-base
    name: Fetch Base
    action: fetch:cookiecutter
    input:
      extensions:
        - jinja2_custom_filters_extension.string_filters_extension.StringFilterExtension
      url: https://github.com/spotify/cookiecutter-golang
      values:
        name: '{{ parameters.name }}'
```

Cookiecutter enables a few extensions by default. See the official Cookiecutter documentation for [Template Extensions](https://cookiecutter.readthedocs.io/en/1.7.2/advanced/template_extensions.html) for a list of such extensions, and more information.
