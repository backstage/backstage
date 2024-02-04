FROM ruby:3.3@sha256:79fd4a27fc343abc7372e9082fcfae3750e24cdb519c1cfd89cfa7a4d48a5191

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
