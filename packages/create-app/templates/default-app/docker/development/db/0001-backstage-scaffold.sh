#!/bin/sh
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-SQL
    CREATE DATABASE backstage_plugin_auth;
    CREATE DATABASE backstage_plugin_catalog;
    CREATE DATABASE backstage_plugin_identity;
    CREATE DATABASE backstage_plugin_scaffolder;
    CREATE DATABASE backstage_plugin_proxy;
    CREATE DATABASE backstage_plugin_techdocs;
    GRANT ALL PRIVILEGES ON DATABASE backstage_plugin_auth TO backstage;
    GRANT ALL PRIVILEGES ON DATABASE backstage_plugin_catalog TO backstage;
    GRANT ALL PRIVILEGES ON DATABASE backstage_plugin_identity TO backstage;
    GRANT ALL PRIVILEGES ON DATABASE backstage_plugin_scaffolder TO backstage;
    GRANT ALL PRIVILEGES ON DATABASE backstage_plugin_proxy TO backstage;
    GRANT ALL PRIVILEGES ON DATABASE backstage_plugin_techdocs TO backstage;
SQL
