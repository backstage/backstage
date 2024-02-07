FROM ruby:3.3@sha256:ee46fdecebe9e0f8c7b88195379130bba37cbc1e759442d062bd35a34aebff5f

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
