FROM python:3.8-slim AS scaffolder
RUN pip install cookiecutter==1.7.0 --index-url https://pypi.python.org/simple
ENTRYPOINT [ "cookiecutter" ]