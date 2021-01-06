#!/bin/bash
if [ $STAGE = "review" ]; then
    yarn run new-version
else
    echo "Skipping versioning for stage: $STAGE"
fi