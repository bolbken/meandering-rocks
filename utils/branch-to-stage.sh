#!/bin/bash

BRANCH=`git branch --show-current`
GIT_STAGE=`cat $1 | json git_branch_stage.$BRANCH`
STAGE=''

if [ -z "$GIT_STAGE" ] 
    then

    # No corresponding stage for this git branch... return dev-<branch name>
    STAGE="$BRANCH"

else

    STAGE=$GIT_STAGE

fi

echo $STAGE