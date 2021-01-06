#!/bin/bash
if [ $STAGE = "review" ]; then
    git reset --hard HEAD
    yarn run new-version
else
    echo "Skipping versioning for stage: $STAGE"
fi