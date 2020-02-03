import re
import sys


def validate(name, regex, error_message):
    if not re.match(regex, name):
        print(error_message % name)

        # exits with status 1 to indicate failure
        sys.exit(1)


validate('{{ cookiecutter.plugin_name }}',
         r'^[a-z-]+$', 'ERROR: %s is not a valid plugin name! Only lowercase letters and hyphens are valid (Examples: my-amazing-plugin, myamazingplugin).')
