#!/bin/bash

ROOTDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && cd ../ && pwd )"
PORT_VARS=$(dotenv -e $ROOTDIR/.env.development printenv | grep '^API\S*_PORT')

for PORT_VAR in $PORT_VARS
do
  PORT=$(cut -d "=" -f2- <<< $PORT_VAR)
  PID=$(lsof -t -itcp:$PORT)
  if [ -n "$PID" ]; 
  then
    echo "Attempt killing process (pid: $PID) for port $PORT"
    echo "  process info:   $(ps -A | grep $PID)"
    kill $PID
  fi    
done