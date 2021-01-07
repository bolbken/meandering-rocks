#!/bin/bash

VERSION_BRANCH="review"

if [ $GIT_BRANCH = $VERSION_BRANCH ]; then
    git reset --hard HEAD
    git config --global credential.helper "store --file $HOME/.git-credentials"
    echo -n "https://$GH_TOKEN:x-oauth-basic@github.com" >> $HOME/.git-credentials
    git config --global user.email $MEANDERING_ROCKS_CI_GIT_USER_EMAIL
    git config --global user.name $MEANDERING_ROCKS_CI_GIT_USER_NAME
    yarn run new-version
    git push
else
    echo "Skipping versioning for stage: $STAGE"
fi