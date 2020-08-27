FROM openjdk:11-alpine
ENTRYPOINT ["/usr/bin/{{cookiecutter.artifact_id}}.sh"]

COPY {{cookiecutter.artifact_id}}.sh /usr/bin/{{cookiecutter.artifact_id}}.sh
COPY target/{{cookiecutter.artifact_id}}.jar /usr/share/{{cookiecutter.artifact_id}}/{{cookiecutter.artifact_id}}.jar
