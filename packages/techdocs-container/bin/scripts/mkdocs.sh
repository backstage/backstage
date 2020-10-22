# script to configure repo_url in mkdocs if required & run mkdocs.

# logging purpose
CONFIG_REPO_URL="repo_url"

# file, from where we can get repository base url.
CATALOG_INFO="catalog-info.yaml"

# mkdocs configuration file
MKDOCS="mkdocs.yml"

# shyaml key chain to achieve techdocs-ref
TECHDOCS_REF_KEY="metadata.annotations.backstage\.io/techdocs-ref"

log() {
    echo "[PRE-CONFIG($1)]: $2"
}

skip() {
    echo "[PRE-CONFIG($1)]: $2 Skipping... "
}

# check if repo_url key already exists in mkdocs.yml. (Skip if exists)
cat $MKDOCS | shyaml get-value repo_url > /dev/null 2>&1
if [[ $? -ne 0 ]]; then
    log $CONFIG_REPO_URL "repo_url does not exist in $MKDOCS. Processing further..."

    # check catalog-info file exists. (Skip if not exists)
    if [ -f $CATALOG_INFO ]; then
        log $CONFIG_REPO_URL "$CATALOG_INFO exists. Searching techdocs-ref annotation."

        # search for relevant techdocs-ref key in catalog-info
        TECHDOCS_REF=$(cat $CATALOG_INFO | shyaml get-value $TECHDOCS_REF_KEY 2> /dev/null)

        # proceed only if desired key found.
        if [[ $? -eq 0 ]]; then
            log $CONFIG_REPO_URL "key found, sanitizing & appending it to $MKDOCS."

            # value format example: github:https://github.com/spotify/backstage.git

            # trim .git postfix => github:https://github.com/spotify/backstage
            REPO_URL=${TECHDOCS_REF%.git}

            # trim prefix before : => https://github.com/spotify/backstage
            REPO_URL=${REPO_URL#*:}

            # append in mkdocs file
            # repo_url: 'https://github.com/spotify/backstage'
            printf "\nrepo_url: '$REPO_URL'" >> $MKDOCS

        else
            # skip if desired key not found
            skip $CONFIG_REPO_URL "key not found in $CATALOG_INFO."
        fi

    else
        skip $CONFIG_REPO_URL "$CATALOG_INFO not found."
    fi

fi

mkdocs $@
