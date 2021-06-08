#!/bin/sh
exec /usr/bin/java $JVM_DEFAULT_ARGS $JVM_ARGS -jar /usr/share/{{cookiecutter.artifact_id}}/{{cookiecutter.artifact_id}}.jar "$@"
