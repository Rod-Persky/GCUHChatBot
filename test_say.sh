#!/bin/bash

curl \
  --location \
  --request POST 'http://localhost:3001/api/start-speech-synthesis' \
  --header 'Content-Type: application/json' \
  --data-raw '{"data": "hello world"}'
