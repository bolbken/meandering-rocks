#!/bin/bash
BUCKET="meandering-rocks-configuration"
SUBDIR="env"
ENVDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && cd ../.env && pwd )"
echo $DIR

if [ $1 == "up" ]
then
    echo "Uploading .env directory to S3"
    aws s3 sync $ENVDIR s3://$BUCKET/$SUBDIR
elif [ $1 == "down" ]
then
    echo "Downloading .env directory from S3"
    aws s3 sync s3://$BUCKET/$SUBDIR $ENVDIR
else
    echo "Unknown command.  Valid arugment: up, down"
fi