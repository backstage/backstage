FROM ruby:3.3@sha256:24af4f0bf0af61d04a5ead4f43e7ad468a1b2ff05844d7780555a13a78615ced

RUN apt-get update -qq && \
    apt-get install -y nodejs postgresql-client git && \
    rm -rf /var/lib/apt/lists/

RUN gem install rails
